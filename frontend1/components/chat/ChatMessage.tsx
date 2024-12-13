"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Copy,
  Pencil,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ChatMessageProps {
  onEdit?: (id: number | string, newText: string) => void;
  isThinking?: boolean;
  isError?: boolean;
  content: string;
  role?: string;
  time?: string;
}

export function ChatMessage({
  onEdit,
  isThinking,
  isError,
  content,
  role,
  time,
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(content || "");

  const handleSave = () => {
    if (editedText.trim() !== content) {
      onEdit?.(content, editedText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(content);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex items-start space-x-2 max-w-[80%] sm:max-w-[70%] md:max-w-[60%]`}
      >
        {role === "assistant" && (
          <Avatar className="w-8 h-8 hidden sm:flex">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        )}
        <div
          className={cn(
            "p-3 rounded-lg shadow relative group",
            role === "user" ? "bg-blue-100" : "bg-gray-100",
            isThinking && "animate-pulse",
            isError && "bg-red-50 border border-red-200"
          )}
        >
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="min-h-[100px] w-full resize-none"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-1" />
                  取消
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Check className="w-4 h-4 mr-1" />
                  保存
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-2">
                {isThinking && (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                )}
                <p
                  className={cn(
                    "whitespace-pre-wrap break-words",
                    isError && "text-red-500"
                  )}
                >
                  {content}
                </p>
              </div>

              {!isThinking && !isError && (
                <div className="absolute -bottom-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1 bg-white rounded-md shadow-sm p-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    title="复制"
                    onClick={() => {
                      navigator.clipboard.writeText(content);
                      toast({
                        title: "复制成功",
                      });
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {role != "assistant" && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      title="编辑"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                  {/* <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:bg-red-600 hover:text-white"
                    title="删除"
                  >
                    <Trash className="w-4 h-4" />
                  </Button> */}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
