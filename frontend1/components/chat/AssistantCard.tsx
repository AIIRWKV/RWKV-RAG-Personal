"use client";
import { motion } from "framer-motion";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Assistant } from "@/types/assistant";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AssistantCardProps {
  assistant: Assistant;
  onEdit: (assistant: Assistant) => void;
  onDelete: (assistant: Assistant) => void;
}

export function AssistantCard({
  assistant,
  onEdit,
  onDelete,
}: AssistantCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm p-3 flex items-center justify-between hover:shadow-md transition-shadow group cursor-pointer"
    >
      <span className="font-medium truncate">{assistant.name}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => onEdit(assistant)}
            className="cursor-pointer hover:bg-gray-50"
          >
            <Pencil className="mr-2 h-4 w-4 text-gray-500" />
            <span>编辑</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDelete(assistant)}
            className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>删除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}