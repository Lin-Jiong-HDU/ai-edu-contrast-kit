import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Square } from "lucide-react";
import MessageBubble from "@/components/chat/MessageBubble";
import { useChatStream } from "@/hooks/useChatStream";
import { toast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

const ChatInterface: React.FC = () => {
  const { sessionId, streamMessage, stop, isStreaming, initSession } = useChatStream();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "你好！我是范小教AI助手，有什么可以帮助你的吗？",
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const canSend = useMemo(() => inputValue.trim().length > 0 && !isStreaming, [inputValue, isStreaming]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLDivElement | null;
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!canSend) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: Date.now(),
    };

    const aiId = `a_${Date.now() + 1}`;
    const aiMsg: Message = {
      id: aiId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputValue("");

    try {
      await streamMessage(userMsg.content, (delta) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === aiId ? { ...m, content: m.content + delta } : m))
        );
      });
      // 结束标记
      setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, isStreaming: false } : m)));
    } catch (e) {
      console.error(e);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId
            ? { ...m, content: "抱歉，发生了错误，请稍后重试。", isStreaming: false }
            : m
        )
      );
      toast({ title: "发送失败", description: "与服务器连接异常，请稍后再试" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewSession = async () => {
    try {
      await initSession();
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "新会话已创建，我能帮你做什么？",
          timestamp: Date.now(),
        },
      ]);
    } catch (e) {
      toast({ title: "创建会话失败", description: "请稍后重试" });
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/lovable-uploads/64311975-8676-4b83-afd3-477e04d3abdb.png" alt="范小教" />
            <AvatarFallback>范</AvatarFallback>
          </Avatar>
          范小教AI助手
          <span className="ml-2 text-xs text-muted-foreground">
            {sessionId ? `会话ID: ${sessionId.slice(0, 8)}...` : "正在初始化会话..."}
          </span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleNewSession} disabled={isStreaming}>
            新会话
          </Button>
          {isStreaming && (
            <Button variant="destructive" size="sm" onClick={stop}>
              <Square className="h-4 w-4 mr-1" /> 停止
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((m) => (
              <MessageBubble key={m.id} content={m.content} isUser={m.role === "user"} isStreaming={m.isStreaming} />
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题，按 Enter 发送，Shift+Enter 换行"
              disabled={isStreaming}
              className="flex-1 min-h-[48px] max-h-40"
            />
            <Button onClick={handleSend} disabled={!canSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
