"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, FileText, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCallback } from "react";

interface KnowledgeCardProps {
  name: string;
  title: string;
  docsCount: number;
  createdAt: string;
  onDelete?: (name: string) => void;
  onClick?: () => void;
}

export function KnowledgeCard({
  name,
  title,
  docsCount,
  createdAt,
  onDelete,
  onClick,
}: KnowledgeCardProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  //   Handle Delete
  const handleDelete = useCallback(() => {
    onDelete?.(name);
    setIsOpen(false);
  }, [onDelete]);

  //   Handle Click
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onClick?.();
  };

  return (
    <Card
      className="p-6 flex items-start justify-between h-[300px] min-w-[300px] hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="space-y-1 flex flex-col justify-between h-full">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground font-semibold">
          <span className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            {docsCount} 文档
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {createdAt}
          </span>
        </div>
      </div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-accent hover:text-accent-foreground"
            aria-label="More options"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-0">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </PopoverContent>
      </Popover>
    </Card>
  );
}
