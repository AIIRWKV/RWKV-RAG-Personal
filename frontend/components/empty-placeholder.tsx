"use client";
import { LucideIcon } from "lucide-react";

interface EmptyPlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyPlaceholder({ icon: Icon, title, description }: EmptyPlaceholderProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <Icon className="h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
