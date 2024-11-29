"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SearchInput } from "@/components/search/SearchInput";
import { SearchResult } from "@/components/search/SearchResult";
import { useState, useEffect } from "react";
import { getKnowledgeList } from "@/api/knowledge/getKnowledgeList";
import { getInternetSearch } from "@/api/search/getInternetSearch";
import { createKnowledgeFile } from "@/api/knowledge/createKnowledgeFile";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SearchPage() {
  const { toast } = useToast();
  const [knowledgeBases, setKnowledgeBases] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>({});
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    handleKnowledgeList();
  }, []);

  const handleSearch = (query: string) => {
    setIsSearching(true);
    setHasSearched(true);
    let params = {
      query: query,
    };
    getInternetSearch(params)
      .then((res) => {
        if (res.code === 200) {
          setSearchResult(res.data);
          toast({
            title: "搜索成功",
            description: "搜索结果已保存到" + res.data.file_path,
          });
        } else {
          toast({
            title: "搜索失败",
            description: res.msg,
          });
        }
      })
      .catch((err) => {
        toast({
          title: "搜索失败",
          description: err,
        });
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  const handleKnowledgeList = () => {
    getKnowledgeList().then((res) => {
      const data = res.data.map((item: any) => item.name);
      setKnowledgeBases(data);
    });
  };

  const handleImport = (knowledgeBase: string) => {
    let params = {
      name: knowledgeBase,
      file_name: searchResult.file_name,
      file_path: searchResult.file_path,
    };
    createKnowledgeFile(params).then((res) => {
      if (res.code === 200) {
        toast({
          title: "导入成功",
          description: `搜索结果已导入到 ${knowledgeBase}`,
        });
      } else {
        toast({
          title: "导入失败",
          description: res.msg,
        });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={`w-full max-w-3xl ${
            hasSearched ? "mb-8" : "flex items-center justify-center h-[50vh]"
          }`}
          initial={false}
          animate={{
            height: hasSearched ? "auto" : "50vh",
          }}
        >
          <SearchInput onSearch={handleSearch} isSearching={isSearching} />
        </motion.div>
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <Loader2 className="h-8 w-8 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
        {hasSearched && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">
                保存路径： {searchResult.file_path}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    入库
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {knowledgeBases.map((kb, index) => (
                    <DropdownMenuItem
                      key={index}
                      onSelect={() => handleImport(kb)}
                    >
                      {kb}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="bg-card text-card-foreground rounded-lg shadow-md">
              <SearchResult result={searchResult} />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
