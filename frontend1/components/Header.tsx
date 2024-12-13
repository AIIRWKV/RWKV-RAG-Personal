"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bot, FileText, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useEffect } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "知识库",
    href: "/knowledge",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "问答",
    href: "/chat",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    title: "联网搜索",
    href: "/search",
    icon: <Search className="h-4 w-4" />,
  },
  // {
  //   title: "文件管理",
  //   href: "/files",
  //   icon: <FileText className="h-4 w-4" />,
  // },
];

export function Header() {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(""); // 添加状态

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);
  return (
    <header className="border-b flex justify-center bg-white">
      <div className="container flex h-14 items-center">
        <div className="w-full flex justify-between gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <span className="font-bold">RWKV-RAG 个人版</span>
          </Link>

          <nav className="flex items-center gap-4 md:gap-6">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "flex items-center gap-2",
                  currentPath.startsWith(item.href) && "bg-muted" // 使用 currentPath 替代直接使用 pathname
                )}
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">English</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>中文</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>
      </div>
    </header>
  );
}
