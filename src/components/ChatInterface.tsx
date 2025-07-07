import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是范小教AI助手，有什么可以帮助你的吗？',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(() => uuidv4());
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 创建AI回复消息
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      content: '',
      isUser: false,
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, aiMessage]);

    try {
      // 创建AbortController用于取消请求
      abortControllerRef.current = new AbortController();

      const response = await fetch('http://60.204.168.139:8002/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputValue,
          user_id: userId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let currentEvent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7);
            continue;
          }
          if (line.startsWith('data: ')) {
            const content = line.slice(6);
            // 只处理content事件的数据，忽略user_id事件的数据
            if (currentEvent === 'content' && content.trim()) {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessageId
                    ? { ...msg, content: msg.content + content }
                    : msg
                )
              );
            }
            // 重置当前事件
            currentEvent = '';
          }
        }
      }

      // 流式传输完成，移除streaming标记
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('请求被取消');
        return;
      }

      console.error('发送消息失败:', error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content: '抱歉，发生了错误，请稍后重试。',
                isStreaming: false
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
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
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUser && (
                  <Avatar className="h-8 w-8 mt-1">
                    <Bot className="h-4 w-4" />
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.isUser ? (
                    <p className="text-sm">{message.content}</p>
                  ) : (
                    <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                      {message.isStreaming && (
                        <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                      )}
                    </div>
                  )}
                </div>

                {message.isUser && (
                  <Avatar className="h-8 w-8 mt-1">
                    <User className="h-4 w-4" />
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题..."
              disabled={isLoading}
              className="flex-1"
            />
            {isLoading ? (
              <Button onClick={stopGeneration} variant="outline" size="icon">
                停止
              </Button>
            ) : (
              <Button onClick={sendMessage} disabled={!inputValue.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            用户ID: {userId}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
