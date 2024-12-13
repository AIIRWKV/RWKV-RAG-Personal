"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCw, Trash2 } from "lucide-react";

interface FileData {
  file_path: string;
  create_time: string;
  status: string;
}

interface DatasetTableProps {
  data: FileData[];
  onDelete: (filePath: string) => void;
  onRetry: (filePath: string) => void;
}

export function DatasetTable({ data, onDelete, onRetry }: DatasetTableProps) {
  const getStatusInfo = (status: string) => {
    const defaultStatus = { text: "未知状态", color: "bg-gray-100" };

    if (!status) return defaultStatus;

    const statusMap = {
      unprocess: { text: "上传成功", color: "bg-gray-100" },
      waitinglist: { text: "排队入库", color: "bg-gray-100" },
      processing: { text: "正在入库", color: "bg-gray-100" },
      processed: { text: "入库成功", color: "bg-green-100" },
      failed: { text: "入库失败", color: "bg-red-100" },
      delete_failed: { text: "删除失败", color: "bg-red-100" },
      deleting: { text: "删除中", color: "bg-yellow-100" },
    };

    return statusMap[status as keyof typeof statusMap] || defaultStatus;
  };

  return (
    <div className="relative">
      <ScrollArea className="h-[calc(100vh-291px)] w-full">
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead className="w-[40%]">文件路径</TableHead>
              <TableHead className="w-[25%]">创建时间</TableHead>
              <TableHead className="w-[20%]">状态</TableHead>
              <TableHead className="w-[15%] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(!data || data.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
            {data?.map((item, index) => {
              const statusInfo = getStatusInfo(item.status);
              const isDeleting = item.status === "deleting";
              const canDelete = item.status === "processed";
              const canRetry =
                item.status === "failed" || item.status === "delete_failed";

              return (
                <TableRow key={index}>
                  <TableCell className="text-blue-500 w-[40%]">
                    {item.file_path}
                  </TableCell>
                  <TableCell className="w-[25%]">{item.create_time}</TableCell>
                  <TableCell className="w-[20%]">
                    <Badge
                      variant="outline"
                      className={`text-xs ${statusInfo.color}`}
                    >
                      {statusInfo.text}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[15%]">
                    <div className="flex items-center justify-end gap-1">
                      {canRetry && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onRetry(item.file_path)}
                        >
                          <RotateCw className="h-4 w-4 text-green-500 hover:text-green-700" />
                        </Button>
                      )}

                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onDelete(item.file_path)}
                          disabled={isDeleting}
                        >
                          <Trash2
                            className={`h-4 w-4 ${
                              isDeleting
                                ? "text-gray-300"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
