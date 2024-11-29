"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ input, disabled, onChange, onSend }: ChatInputProps) {
  const [rows, setRows] = useState(3);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const paddingTop = parseInt(getComputedStyle(textarea).paddingTop);
      const paddingBottom = parseInt(getComputedStyle(textarea).paddingBottom);
      
      // 重置高度以获取真实的 scrollHeight
      textarea.style.height = 'auto';
      
      const contentHeight = textarea.scrollHeight - paddingTop - paddingBottom;
      const newRows = Math.min(
        8, // 最大行数限制
        Math.max(1, Math.ceil(contentHeight / lineHeight))
      );
      
      setRows(newRows);
      
      // 如果超过最大行数，启用滚动
      if (newRows >= 8) {
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-end space-x-2">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-1 resize-none"
        rows={rows}
        disabled={disabled}
      />
      <Button onClick={onSend} size="icon" className="mb-1" disabled={disabled}>
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}
