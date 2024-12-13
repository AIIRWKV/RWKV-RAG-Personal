"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchResultProps {
  result: any;
}

export function SearchResult({ result }: SearchResultProps) {
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (result) {
      setShowResult(true);
    }
  }, [result]);

  if (!showResult) return null;

  return (
    <motion.div
      className="p-4 bg-blue-100 rounded shadow-md w-full max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-bold mb-2">搜索结果</h2>

      <ScrollArea className="h-[60vh] rounded-md">
        <motion.div
          className="p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-600 break-all">{result.text}</p>
        </motion.div>
      </ScrollArea>
    </motion.div>
  );
}
