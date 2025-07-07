import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ChatInterface from './ChatInterface';

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChatDialog: React.FC<ChatDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>AI聊天助手</DialogTitle>
        </DialogHeader>
        <div className="h-full">
          <ChatInterface/>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
