import { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/chat";
import { RecallCardList } from "@/components/recall/RecallCardList";
import { BestMatch } from "@/components/recall/BestMatch";
import { Recall } from "@/types/recall";

interface ChatWindowProps {
  messages: Message[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  recallResults: Recall | null;
  selectedCard: string | null;
  setSelectedCard: (id: string | null) => void;
  isLoading?: boolean;
}

export function ChatWindow({
  messages,
  input,
  onInputChange,
  onSend,
  recallResults,
  selectedCard,
  setSelectedCard,
  isLoading = false,
}: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-4 py-1">
        <div ref={scrollAreaRef}>
          {recallResults && (
            <div className="mx-auto space-y-4">
              <RecallCardList
                title="召回结果"
                results={recallResults?.recall_msg || []}
                selectedCard={selectedCard}
                setSelectedCard={setSelectedCard}
              />
              <BestMatch result={recallResults?.match_best || ""} />
            </div>
          )}
          <div className="mx-auto space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                content={message.content}
                role={message.role}
              />
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4">
        <div className="mx-auto">
          <ChatInput
            input={input}
            onChange={onInputChange}
            onSend={onSend}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
