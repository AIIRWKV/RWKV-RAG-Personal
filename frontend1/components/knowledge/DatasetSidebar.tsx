'use client';

import { FileText, Settings, Target, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  name: string;
  className?: string;
}

const navItems: NavItem[] = [
  {
    title: "数据集",
    href: "/knowledge/detail/dataset",
    icon: FileText,
  },
  // {
  //   title: "检索测试",
  //   href: "/knowledge/detail/retrieval",
  //   icon: Target,
  // },
  // {
  //   title: "配置",
  //   href: "/knowledge/detail/configuration",
  //   icon: Settings,
  // },
];

export function DatasetSidebar({ name, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside 
      className={cn("w-64 rounded-lg shadow-lg p-6 bg-white", className)}
      aria-label="Dataset sidebar"
    >
      <div className="mb-8 flex items-center gap-4">
        <div 
          className="h-12 w-12 rounded-full bg-gray-200" 
          role="img"
          aria-label="Dataset avatar"
        />
        <span className="text-xl font-semibold truncate" title={name || ""}>
          {name || ""}
        </span>
      </div>
      <nav className="space-y-2" aria-label="Dataset navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={`${item.href}?name=${name}`}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}