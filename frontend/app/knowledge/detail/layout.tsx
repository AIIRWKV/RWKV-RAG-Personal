"use client";

import { DatasetSidebar } from "@/components/knowledge/DatasetSidebar";
import { useState, useEffect } from "react";

export default function KnowledgeBaseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(window.localStorage.getItem("knowledgeName") || "");
  }, []);

  return (
    <div className="flex h-full">
      <DatasetSidebar name={name} />
      <main className="flex-1">{children}</main>
    </div>
  );
}