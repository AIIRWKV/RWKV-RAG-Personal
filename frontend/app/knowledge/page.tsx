"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search } from "lucide-react";
import { KnowledgeCard } from "@/components/knowledge/KnowledgeCard";
import { useCallback, useEffect, useState } from "react";
import { getKnowledgeList } from "@/api/knowledge/getKnowledgeList";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createKnowledgeBase } from "@/api/knowledge/createKnowledge";
import { deleteKnowledge } from "@/api/knowledge/deleteKnowledge";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { debounce } from "lodash-es";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { LoadingSpinner } from "@/components/loading-spinner";
import { motion, AnimatePresence } from "framer-motion";

interface Knowledge {
  name: string;
  meta: {
    create_time: string;
    "hnsw:space": string;
  };
  count: number;
}

export default function Knowledge() {
  const router = useRouter();
  const [knowledgeBases, setKnowledgeBases] = useState<Knowledge[]>([]);
  const [showCreateKnowledgeBaseModal, setShowCreateKnowledgeBaseModal] =
    useState(false);
  const [knowledgeName, setKnowledgeName] = useState("");
  const [fetchKnowledgeListLoading, setFetchKnowledgeListLoading] =
    useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchKnowledgeList();
  }, []);

  const handleKnowledgeDelete = (name: string) => {
    let params = {
      name: name,
    };
    deleteKnowledge(params).then((res) => {
      if (res.code === 200) {
        toast({
          title: "删除知识库成功",
          description: "知识库已删除",
        });
        handleGetKnowledgeList();
      }
    });
  };

  // 获取知识库列表
  const fetchKnowledgeList = (keyword?: string) => {
    setFetchKnowledgeListLoading(true);
    let params = {
      need_count: 1,
      keyword: keyword || "",
    };
    getKnowledgeList(params)
      .then((res) => {
        if (res.code === 200) {
          setKnowledgeBases(res.data);
          window.localStorage.setItem(
            "knowledge_bases",
            JSON.stringify(res.data)
          );
        } else {
          toast({
            title: "获取知识库列表失败",
            description: res.msg,
          });
        }
      })
      .finally(() => {
        setFetchKnowledgeListLoading(false);
      });
  };

  // 获取知识库列表
  const handleGetKnowledgeList = useCallback(
    debounce((keyword?: string) => {
      fetchKnowledgeList(keyword);
    }, 500),
    []
  );

  // 创建知识库
  const handleKnowledgeCreate = () => {
    let params = {
      name: knowledgeName,
    };
    createKnowledgeBase(params).then((res) => {
      if (res.code === 200) {
        toast({
          title: "创建知识库成功",
          description: "知识库已创建",
        });
        setShowCreateKnowledgeBaseModal(false);
        setKnowledgeName("");
        handleGetKnowledgeList();
      } else {
        toast({
          title: "创建知识库失败",
          description: res.msg,
        });
      }
    });
  };

  // 渲染知识库列表
  const renderContent = () => {
    if (fetchKnowledgeListLoading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="col-span-full flex items-center justify-center h-[300px]"
        >
          <LoadingSpinner className="h-12 w-12" />
        </motion.div>
      );
    }

    if (knowledgeBases.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="col-span-full"
        >
          <EmptyPlaceholder
            icon={Plus}
            title="没有找到知识库"
            description="创建一个新的知识库开始使用吧"
          />
        </motion.div>
      );
    }

    return (
      <AnimatePresence>
        {knowledgeBases.map((knowledge, index) => (
          <motion.div
            key={knowledge.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <KnowledgeCard
              name={knowledge.name}
              title={knowledge.name}
              docsCount={knowledge.count}
              createdAt={knowledge.meta.create_time}
              onDelete={handleKnowledgeDelete}
              onClick={() => {
                window.localStorage.setItem("knowledgeName", knowledge.name);
                router.push(`/knowledge/detail/dataset?name=${knowledge.name}`);
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold tracking-tight"
          >
            欢迎回来
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground"
          >
            今天我们使用哪个知识库？
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="w-full sm:w-[250px] pl-8"
              placeholder="搜索知识库..."
              type="search"
              onChange={(e) => {
                handleGetKnowledgeList(e.target.value);
              }}
            />
          </div>
          <Dialog
            open={showCreateKnowledgeBaseModal}
            onOpenChange={setShowCreateKnowledgeBaseModal}
          >
            <DialogTrigger asChild>
              <Button
                className="flex items-center gap-2 w-full sm:w-auto"
                onClick={() => {
                  setKnowledgeName("");
                  setShowCreateKnowledgeBaseModal(true);
                }}
              >
                <Plus className="h-4 w-4" />
                创建知识库
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>创建知识库</DialogTitle>
                <DialogDescription>
                  创建一个新的知识库来存储您的文档。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="gap-4 flex items-center">
                  <Label htmlFor="name" className="text-right w-16">
                    名称
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={knowledgeName}
                    onChange={(e) => {
                      setKnowledgeName(e.target.value);
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => {
                    handleKnowledgeCreate();
                    setShowCreateKnowledgeBaseModal(false);
                  }}
                >
                  创建
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {renderContent()}
      </motion.div>
    </motion.div>
  );
}
