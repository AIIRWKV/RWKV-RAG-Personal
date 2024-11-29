"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Menu, Loader2 } from "lucide-react";
import { ChatCard } from "./ChatCard";
import { Chat } from "@/types/chat";
import ChatRecallDialog from "./ChatRecallDialog";
import { KnowledgeBaseList } from "./KnowledgeBaseList";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecallFormValues } from "./ChatRecallForm";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface KnowledgeBase {
  id: string;
  name: string;
}

interface SidebarProps {
  chats: Chat[];
  knowledgeBases: KnowledgeBase[];
  selectedKnowledgeBase: KnowledgeBase | null;
  createChatLoading: boolean;
  onSelectKnowledgeBase: (knowledgeBase: KnowledgeBase) => void;
  onChatClick: (chat: Chat) => void;
  onDeleteChat: (chat: Chat) => void;
  onRecallChat: (chat: Chat) => void;
  onCreateChat: (values: RecallFormValues) => void;
  selectedChat: Chat | null;
  getChatsLoading: boolean;
  isChatRecallDialogOpen: boolean;
  setIsChatRecallDialogOpen: (open: boolean) => void;
}

export function Sidebar({
  chats,
  knowledgeBases,
  selectedKnowledgeBase,
  createChatLoading,
  onSelectKnowledgeBase,
  onChatClick,
  onDeleteChat,
  onRecallChat,
  onCreateChat,
  selectedChat,
  getChatsLoading,
  isChatRecallDialogOpen,
  setIsChatRecallDialogOpen,
}: SidebarProps) {
  const handleCreateChat = () => {
    if (selectedKnowledgeBase) {
      setIsChatRecallDialogOpen(true);
    } else {
      toast({
        title: "请先选择一个知识库",
        description: "请先选择一个知识库",
      });
    }
  };

  const handleSelectKnowledgeBase = (knowledgeBase: KnowledgeBase) => {
    onSelectKnowledgeBase(knowledgeBase);
  };

  const handleChatClick = (chat: Chat) => {
    onChatClick(chat);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-4">
      <div className="flex flex-grow overflow-hidden">
        <KnowledgeBaseList
          knowledgeBases={knowledgeBases}
          selectedKnowledgeBase={selectedKnowledgeBase}
          onSelectKnowledgeBase={handleSelectKnowledgeBase}
        />
        <div className="flex-1">
          <h2 className="text-sm font-semibold mb-2">聊天记录</h2>
          {getChatsLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-2">
                <button
                  onClick={handleCreateChat}
                  disabled={
                    !selectedKnowledgeBase ||
                    createChatLoading ||
                    getChatsLoading
                  }
                  className={`w-[180px] p-3 flex items-center gap-2 rounded-lg border border-dashed 
                  ${
                    !selectedKnowledgeBase ||
                    createChatLoading ||
                    getChatsLoading
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">创建新对话</span>
                </button>

                {chats.map((chat) => (
                  <ChatCard
                    key={chat.search_id}
                    chat={chat}
                    onDelete={onDeleteChat}
                    onClick={handleChatClick}
                    onRecall={onRecallChat}
                    isSelected={selectedChat?.search_id === chat.search_id}
                    isDisabled={!selectedKnowledgeBase}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-96 border-r border-gray-200 h-full overflow-hidden">
        <SidebarContent />
      </div>
      <ChatRecallDialog
        isOpen={isChatRecallDialogOpen}
        onClose={() => setIsChatRecallDialogOpen(false)}
        knowledgeBase={selectedKnowledgeBase}
        onSubmit={onCreateChat}
        isLoading={createChatLoading}
      />

      {/* Mobile/Tablet Sheet Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="lg:hidden absolute left-4 top-1/2 -translate-y-1/2 z-50"
            size="icon"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="sm:max-w-none p-0 w-4/5"
        >
          <DialogHeader>
            <DialogTitle>
              <VisuallyHidden>侧边栏菜单</VisuallyHidden>
            </DialogTitle>
          </DialogHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
