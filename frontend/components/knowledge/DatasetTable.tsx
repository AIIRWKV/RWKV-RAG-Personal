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
import { Pencil, PlayCircle } from "lucide-react";

const statusTextMap = {
  unprocess: { text: "上传成功", color: "bg-gray-100" },
  waitinglist: { text: "排队入库", color: "bg-gray-100" },
  processing: { text: "正在入库", color: "bg-gray-100" },
  processed: { text: "入库成功", color: "bg-green-100" },
  failed: { text: "入库失败", color: "bg-red-100" },
};
export function DatasetTable({ data }: { data: any[] }) {
  return (
    <div className="relative">
      <ScrollArea className="h-[calc(100vh-291px)] w-full">
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead className="w-[40%]">文件路径</TableHead>
              <TableHead className="w-[25%]">创建时间</TableHead>
              <TableHead className="w-[20%]">状态</TableHead>
              {/* <TableHead className="w-[15%]">操作</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-blue-500 w-[40%]">
                  {item.file_path}
                </TableCell>
                <TableCell className="w-[25%]">{item.create_time}</TableCell>
                <TableCell className="w-[20%]">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      statusTextMap[item.status as keyof typeof statusTextMap]
                        .color
                    }`}
                  >
                    {
                      statusTextMap[item.status as keyof typeof statusTextMap]
                        .text
                    }
                  </Badge>
                </TableCell>
                {/* <TableCell className="w-[15%]">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <PlayCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
