import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  content: string;
  isUser?: boolean;
  isStreaming?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ content, isUser, isStreaming }) => {
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src="/lovable-uploads/64311975-8676-4b83-afd3-477e04d3abdb.png" alt="范小教AI助手" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{content}</ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1 align-[-2px]" />
            )}
          </div>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarFallback>你</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble;
