// AI教学助手 API 工具函数
//const BASE_URL = "http://60.204.168.139:720";
const BASE_URL = "";
const API_PREFIX = "/api/v1";

export interface ChatSession {
  session_id: string;
}

export interface ChatMessage {
  session_id: string;
  message: string;
  user_type: "teacher" | "student";
}

export interface ChatResponse {
  session_id: string;
  response: string;
  timestamp: string;
}

export interface StreamEvent {
  event: "start" | "message" | "end" | "error";
  session_id: string;
  chunk?: string;
  is_complete?: boolean;
  error?: string;
  timestamp?: string;
}

// 创建新会话
export async function createChatSession(): Promise<ChatSession> {
  try {
    const response = await fetch(`${BASE_URL}${API_PREFIX}/chat/session`, {
      method: "POST",
      // headers: {
      //   'Content-Type': 'application/json',
      // },
    });
    console.log(response.body);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to create session");
    }

    return data.data;
  } catch (error) {
    console.error("Failed to create chat session:", error);
    throw error;
  }
}

// 删除会话
export async function deleteChatSession(sessionId: string): Promise<void> {
  try {
    const response = await fetch(
      `${BASE_URL}${API_PREFIX}/chat/session/${sessionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to delete session");
    }
  } catch (error) {
    console.error("Failed to delete chat session:", error);
    throw error;
  }
}

// 发送消息（非流式）
export async function sendMessage(
  chatMessage: ChatMessage,
): Promise<ChatResponse> {
  try {
    const response = await fetch(`${BASE_URL}${API_PREFIX}/chat/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chatMessage),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
}

// 发送消息（流式）
export async function sendStreamMessage(
  chatMessage: ChatMessage,
  onMessage: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void,
): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}${API_PREFIX}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chatMessage),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const eventData = JSON.parse(line.substring(6)) as StreamEvent;

            switch (eventData.event) {
              case "start":
                // 可以在这里处理开始事件
                break;
              case "message":
                if (eventData.chunk) {
                  onMessage(eventData.chunk);
                }
                break;
              case "end":
                onComplete();
                return;
              case "error":
                onError(eventData.error || "Unknown error occurred");
                return;
            }
          } catch (parseError) {
            console.error("Failed to parse stream event:", parseError);
          }
        }
      }
    }
  } catch (error) {
    console.error("Failed to send stream message:", error);
    onError(error instanceof Error ? error.message : "Unknown error occurred");
  }
}

// 获取会话信息
export async function getSessionInfo(): Promise<{
  active_sessions: number;
  total_count: number;
}> {
  try {
    const response = await fetch(`${BASE_URL}${API_PREFIX}/chat/sessions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to get session info");
    }

    return data.data;
  } catch (error) {
    console.error("Failed to get session info:", error);
    throw error;
  }
}

// 检查服务健康状态
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      method: "GET",
    });

    return response.ok;
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
}
