import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  User,
  Bot,
  Trash2,
  Plus,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Message, UserType } from "@/types/chat";
import {
  createChatSession,
  sendStreamMessage,
  deleteChatSession,
} from "@/api/chat";
import MessageItem from "@/components/AIChat/MessageItem";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AIChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userType, setUserType] = useState<UserType>("student");
  const [error, setError] = useState<string | null>(null);
  const [currentStreamingMessage, setCurrentStreamingMessage] =
    useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamingMessage]);

  // 初始化会话
  const initializeSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const session = await createChatSession();
      setSessionId(session.session_id);
      setMessages([]);
      toast.success("新会话已创建");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "创建会话失败";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 组件挂载时创建会话
  useEffect(() => {
    initializeSession();
  }, []);

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || isStreaming) return;

    const messageId = Date.now().toString();
    const userMessage: Message = {
      id: messageId,
      content: inputMessage.trim(),
      role: "user",
      timestamp: new Date(),
    };

    // 添加用户消息
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsStreaming(true);
    setCurrentStreamingMessage("");
    setError(null);

    // 创建AI消息占位符
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, aiMessage]);

    try {
      await sendStreamMessage(
        {
          session_id: sessionId,
          message: userMessage.content,
          user_type: userType,
        },
        // onMessage 回调
        (chunk: string) => {
          setCurrentStreamingMessage((prev) => prev + chunk);
          // 实时更新AI消息内容
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg,
            ),
          );
        },
        // onComplete 回调
        () => {
          setIsStreaming(false);
          setCurrentStreamingMessage("");
          // 标记消息完成
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg,
            ),
          );
          toast.success("消息发送成功");
        },
        // onError 回调
        (error: string) => {
          setIsStreaming(false);
          setCurrentStreamingMessage("");
          setError(error);
          // 移除失败的AI消息
          setMessages((prev) => prev.filter((msg) => msg.id !== aiMessageId));
          toast.error(`发送消息失败: ${error}`);
        },
      );
    } catch (error) {
      setIsStreaming(false);
      setCurrentStreamingMessage("");
      const errorMessage =
        error instanceof Error ? error.message : "发送消息失败";
      setError(errorMessage);
      // 移除失败的AI消息
      setMessages((prev) => prev.filter((msg) => msg.id !== aiMessageId));
      toast.error(errorMessage);
    }
  };

  // 清空会话
  const handleClearChat = async () => {
    if (sessionId) {
      try {
        await deleteChatSession(sessionId);
      } catch (error) {
        console.error("Failed to delete session:", error);
      }
    }

    // 创建新会话
    await initializeSession();
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[80vh] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">范小教 AI助手</CardTitle>
              <Badge variant={sessionId ? "default" : "destructive"}>
                {sessionId ? "已连接" : "未连接"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={userType}
                onValueChange={(value: UserType) => setUserType(value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      学生
                    </div>
                  </SelectItem>
                  <SelectItem value="teacher">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      教师
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearChat}
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 mr-1" />
                新会话
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setMessages([])}
                disabled={messages.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                清空
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Separator />
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* 消息列表 */}
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 py-4">
              {messages.length === 0 && !isLoading && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">
                    欢迎使用范小教 AI助手！
                  </p>
                  <p className="text-sm">
                    我是您的智能教学助手，可以帮您搜索信息、生成PPT、回答问题等。
                  </p>
                  <p className="text-sm mt-2">请在下方输入您的问题开始对话。</p>
                </div>
              )}

              {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}

              {isLoading && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* 输入区域 */}
          <div className="flex-shrink-0 p-6 pt-0">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`以${userType === "teacher" ? "教师" : "学生"}身份向AI助手提问...`}
                  className="resize-none min-h-[50px] max-h-[120px] pr-12"
                  disabled={!sessionId || isStreaming}
                  rows={2}
                />

                <Button
                  size="sm"
                  className="absolute bottom-2 right-2 h-8 w-8 p-0"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || !sessionId || isStreaming}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>按 Enter 发送，Shift+Enter 换行</span>
              <span>{inputMessage.length}/2000</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChatInterface;
