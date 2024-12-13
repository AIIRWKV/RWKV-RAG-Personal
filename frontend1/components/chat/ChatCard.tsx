import { MoreHorizontal, RefreshCcw, Trash2 } from "lucide-react";
import { Chat } from "@/types/chat";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatCardProps {
  chat: Chat;
  onDelete: (chat: Chat) => void;
  onClick: (chat: Chat) => void;
  onRecall: (chat: Chat) => void;
  isSelected: boolean;
  isDisabled: boolean;
}

export function ChatCard({
  chat,
  onDelete,
  onClick,
  onRecall,
  isSelected,
  isDisabled,
}: ChatCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-3 flex items-center justify-between hover:shadow-md transition-shadow group cursor-pointer w-[180px] ${
        isSelected ? "bg-[#e8e8ea]" : ""
      }`}
      onClick={() => onClick(chat)}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="font-medium truncate flex-1 text-left">
              {chat.query}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{chat.query}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2 flex-shrink-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onRecall(chat);
            }}
            className="hover:text-orange-500"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            <span>召回</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onDelete(chat);
            }}
            className="!text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>删除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}