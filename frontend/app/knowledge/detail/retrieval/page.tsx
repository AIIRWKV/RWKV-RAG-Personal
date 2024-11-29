"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  Settings,
  Target,
} from "lucide-react";
import Link from "next/link";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
export default function Retrieval() {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [pageSize, setPageSize] = useState("10");
  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex flex-1">
        <div className="flex-1 px-6">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/knowledge">知识库</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>检索测试</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Card className="p-6">
            <div className="mb-6">
              <h1 className="mb-2 text-xl font-semibold">检索测试</h1>
              <p className="text-sm text-gray-600">
                进行检索测试，检查 RWKV-RAG 是否能够恢复 LLM 所需的意图内容。
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">
                    相似度阈值
                  </label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-sm">
                        设置检索测试的相似度阈值
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Slider defaultValue={[30]} max={100} step={1} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">
                    关键词相似度权重
                  </label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-sm">
                        设置检索测试的关键词相似度权重
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">重排序模型</label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-sm">
                        选择重排序模型
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="model1">模型 1</SelectItem>
                    <SelectItem value="model2">模型 2</SelectItem>
                    <SelectItem value="model3">模型 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">测试文本</label>
                <Textarea
                  className="min-h-[200px]"
                  placeholder="输入测试文本..."
                />
              </div>

              <div className="flex justify-end">
                <Button>测试</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="w-[400px] border-l p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600">
            <FileText className="h-4 w-4" />
            0/0 文件已选择
          </div>
          <div className="flex h-[calc(100vh-200px)] items-center justify-center rounded-lg border-2 border-dashed">
            <div className="text-center text-sm text-gray-500">无数据</div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-4">
            <span className="text-sm text-gray-600">总计 1</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="px-4">
                1
              </Button>
              <Button variant="outline" size="icon" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Select value={pageSize} onValueChange={setPageSize}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
