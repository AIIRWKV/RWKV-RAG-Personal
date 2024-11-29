"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChatRecallForm, RecallFormValues } from "./ChatRecallForm";
import { Button } from "../ui/button";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface KnowledgeBase {
  id: string;
  name: string;
}

interface ChatRecallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeBase: KnowledgeBase | null;
  onSubmit: (values: RecallFormValues) => void;
  isLoading: boolean;
}

export default function ChatRecallDialog({
  isOpen,
  onClose,
  knowledgeBase,
  onSubmit,
  isLoading,
}: ChatRecallDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>创建聊天</DialogTitle>
          <p className="text-sm text-muted-foreground">
            这里，为您的专属知识库打造一个专属助手！ 💕
          </p>
        </DialogHeader>
        <p>选中的知识库: {knowledgeBase?.name}</p>
        <ChatRecallForm ref={formRef} onSubmit={onSubmit} />
        <DialogFooter>
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button
              type="button"
              onClick={() => formRef.current?.requestSubmit()}
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="animate-spin" />
                  <span>创建中...</span>
                </motion.div>
              ) : (
                "创建"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
