"use client";
import { Card } from "@/components/ui/card";
import { AlertCircle, FileText, Upload } from "lucide-react";
import { DatasetTable } from "@/components/knowledge/DatasetTable";
import { getKnowledgeFileList } from "@/api/knowledge/getKnowledgeFileList";
import { createKnowledgeText } from "@/api/knowledge/createKnowledgeText";
import { createKnowledgeFile } from "@/api/knowledge/createKnowledgeFile";
import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { getFileListCount } from "@/api/knowledge/getFileListCount";
import { PaginationComponent } from "@/components/Pagination";
import { debounce } from "lodash-es";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AddFileDialog } from "@/components/knowledge/AddFileDialog";
import {
  deleteKnowledgeFile,
  reloadKnowledgeFile,
} from "@/api/chat/createKnowledgeRecall";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FileData {
  file_path: string;
  create_time: string;
  status: string;
}
export default function Dataset() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [fileText, setFileText] = useState("");
  const [fileAddOpen, setFileAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [fileAddOptionsOpen, setFileAddOptionsOpen] = useState(false);
  const [fileAddType, setFileAddType] = useState<"text" | "file">("text");
  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteFilePath, setDeleteFilePath] = useState("");

  useEffect(() => {
    handleGetFileListCount();
    handleGetFileList();
  }, []);

  // 监听页码和页面大小的变化
  useEffect(() => {
    handleGetFileList();
  }, [currentPage, pageSize]);

  // 获取文件列表总数
  const handleGetFileListCount = () => {
    let params = {
      name: window.localStorage.getItem("knowledgeName") || "",
    };
    getFileListCount(params).then((res) => {
      setTotalItems(res.data || 0);
      // 计算总页数，向上取整
      setTotalPages(Math.ceil(res.data / pageSize));
    });
  };

  // 获取文件列表
  const handleGetFileList = (keyword?: string) => {
    let params = {
      name: window.localStorage.getItem("knowledgeName") || "",
      page: currentPage,
      page_size: pageSize,
      keyword: keyword || "",
    };

    getKnowledgeFileList(params).then((res) => {
      if (res && res.data) {
        setFiles(res.data);
        // 如果当前页没有数据且不是第一页，则回到上一页
        if (res.data.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        setFiles([]);
      }
    }).catch((error) => {
      console.error('Failed to get file list:', error);
      setFiles([]);
      toast({
        variant: "destructive",
        title: "获取文件列表失败",
        description: "请稍后重试",
      });
    });
  };

  // 添加文件初始化
  const handleAddFileInit = () => {
    setFileName("");
    setFilePath("");
    setFileText("");
    setFileAddOpen(true);
    setFileAddOptionsOpen(false);
  };

  // 添加文件
  const handleAddFile = async () => {
    setIsCreating(true);
    try {
      if (fileAddType === "text") {
          let params = {
        name: window.localStorage.getItem("knowledgeName") || "",
        file_name: fileName,
        text: fileText,
      };
        const res = await createKnowledgeText(params);
        if (res.code === 200) {
          toast({
            title: "添加文件成功",
            description: "文件已添加",
          });
          setFileText("");
          handleGetFileList();
          setFileAddOpen(false);
        } else {
          toast({
            variant: "destructive",
            title: "添加文件失败",
            description: res.msg,
          });
        }
      } else {
           let params = {
        name: window.localStorage.getItem("knowledgeName") || "",
        file_path: filePath,
        file_name: fileName,
      };
        const res = await createKnowledgeFile(params);
        if (res.code === 200) {
          toast({
            title: "添加文件成功",
            description: "文件已添加",
          });
          setFileAddOpen(false);
        } else {
          toast({
            variant: "destructive",
            title: "添加文件失败",
            description: res.msg,
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "添加文件失败",
        description: "请求出错，请稍后重试",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // 分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // 页面大小
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  // 搜索
  const handleSearchFileList = useCallback(
    debounce((keyword?: string) => {
      handleGetFileList(keyword);
    }, 500),
    []
  );

  // 搜索处理函数
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    const value = e.target.value;
    setSearchValue(value);
    handleSearchFileList(value);
  };

  // 删除文件
  const handleDeleteFile = async (filePath: string) => {
    setDeleteFilePath(filePath);
    setDeleteOpen(true);
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    try {
      const res = await deleteKnowledgeFile({
        name: window.localStorage.getItem("knowledgeName") || "",
        file_path: deleteFilePath,
      });

      if (res.code === 200) {
        toast({
          title: "删除成功",
          description: "文件已删除",
        });
        
        // 先获取最新的文件总数
        await handleGetFileListCount();
        
        // 如果当前页是最后一页且没有数据了，则回到上一页
        if (currentPage > 1 && (currentPage - 1) * pageSize >= totalItems) {
          setCurrentPage(prev => prev - 1);
        } else {
          // 否则刷新当前页
          await handleGetFileList();
        }
      } else {
        toast({
          variant: "destructive",
          title: "删除失败",
          description: res.msg || "操作失败，请重试",
        });
      }
    } catch (error) {
      console.error('Delete file error:', error);
      toast({
        variant: "destructive",
        title: "删除失败",
        description: "请求出错，请稍后重试",
      });
    } finally {
      setDeleteOpen(false);
    }
  };

  // 重试入库
  const handleRetryFile = async (filePath: string) => {
    try {
      const res = await reloadKnowledgeFile({
        name: window.localStorage.getItem("knowledgeName") || "",
        file_path: filePath,
      });
      if (res.code === 200) {
        toast({
          title: "重试成功",
          description: "文件正在重新入库",
        });
        // 刷新文件列表
        handleGetFileList();
      } else {
        toast({
          variant: "destructive",
          title: "重试失败",
          description: res.msg,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "重试失败",
        description: "请求出错，请稍后重试",
      });
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 px-6">
        {/* Breadcrumb */}
        {/* <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/knowledge">知识库</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>数据集</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}

        <Card className="p-6">
          <h1 className="mb-2 text-xl font-semibold">数据集</h1>

          {/* Table Controls */}
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-md bg-orange-50 p-3 text-orange-800">
              <AlertCircle className="h-4 w-4" />
              问题和答案只有在解析成功后才能回答。
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索文件"
                  className="pl-8"
                  value={searchValue}
                  onChange={handleSearch}
                />
              </div>
              <Popover
                open={fileAddOptionsOpen}
                onOpenChange={setFileAddOptionsOpen}
              >
                <PopoverTrigger asChild>
                  <Button>添加文件</Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 px-2 py-1.5 text-sm"
                      onClick={() => {
                        setFileAddType("text");
                        handleAddFileInit();
                      }}
                    >
                      <FileText className="h-4 w-4" />
                      知识入库
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 px-2 py-1.5 text-sm"
                      onClick={() => {
                        setFileAddType("file");
                        handleAddFileInit();
                      }}
                    >
                      <Upload className="h-4 w-4" />
                      文件入库
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {/* 表格 */}
          <DatasetTable
            data={files}
            onDelete={handleDeleteFile}
            onRetry={handleRetryFile}
          />
          {/* 分页 */}
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[10, 20, 30, 50]}
          />
        </Card>
      </div>
      <AddFileDialog
        open={fileAddOpen}
        onOpenChange={setFileAddOpen}
        fileAddType={fileAddType}
        fileName={fileName}
        setFileName={setFileName}
        filePath={filePath}
        setFilePath={setFilePath}
        fileText={fileText}
        setFileText={setFileText}
        onSubmit={handleAddFile}
        isLoading={isCreating}
      />
      {/* 删除确认框 */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这个文件吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
