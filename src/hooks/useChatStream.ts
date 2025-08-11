import { useEffect, useRef, useState } from "react";

const BASE_URL = "http://60.204.168.139:720";

interface StreamEvent {
  event: "start" | "message" | "end" | "error";
  session_id?: string;
  chunk?: string;
  is_complete?: boolean;
  error?: string;
  timestamp?: string;
}

export function useChatStream() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const initSession = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/chat/session`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`创建会话失败: ${res.status}`);
      const data = await res.json();
      setSessionId(data?.data?.session_id || null);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  useEffect(() => {
    // 自动初始化一个会话
    initSession().catch(() => {});
  }, []);

  const stop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setIsStreaming(false);
    }
  };

  const streamMessage = async (
    message: string,
    onDelta: (delta: string) => void,
    userType: "teacher" | "student" = "teacher"
  ) => {
    if (!sessionId) throw new Error("会话未初始化");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${BASE_URL}/api/v1/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message, user_type: userType }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(`流式接口错误: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // 保留最后不完整行

        for (const raw of lines) {
          const line = raw.trim();
          if (!line.startsWith("data:")) continue;
          const jsonStr = line.slice(5).trim();
          if (!jsonStr) continue;
          try {
            const evt: StreamEvent = JSON.parse(jsonStr);
            if (evt.event === "message" && evt.chunk) {
              onDelta(evt.chunk);
            } else if (evt.event === "end") {
              setIsStreaming(false);
            } else if (evt.event === "error") {
              throw new Error(evt.error || "未知错误");
            }
          } catch (err) {
            // 单行解析失败不影响整体
            console.warn("解析流数据失败", err);
          }
        }
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  return { sessionId, initSession, streamMessage, stop, isStreaming };
}
