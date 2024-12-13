"use client";

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, FolderOpen } from "lucide-react";

interface AddFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileAddType: "text" | "file";
  fileName: string;
  setFileName: (value: string) => void;
  filePath: string;
  setFilePath: (value: string) => void;
  fileText: string;
  setFileText: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function AddFileDialog({
  open,
  onOpenChange,
  fileAddType,
  fileName,
  setFileName,
  filePath,
  setFilePath,
  fileText,
  setFileText,
  onSubmit,
  isLoading,
}: AddFileDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFilePath(file.name);
      setFileName(file.name);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {fileAddType === "text" ? "知识入库" : "文件入库"}
          </DialogTitle>
          <DialogDescription>添加一段文本到数据库</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fileAddType === "text" ? (
            <>
              <div className="gap-4">
                <Label htmlFor="fileName" className="text-right">
                  文件名
                </Label>
                <Input
                  id="fileName"
                  placeholder="输入文件名（选填）"
                  className="col-span-3"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
              <div className="gap-4">
                <Label htmlFor="fileText" className="text-right">
                  文件内容
                </Label>
                <Textarea
                  id="fileText"
                  placeholder="输入文件内容（按\n对文本进行分块）"
                  className="col-span-3"
                  value={fileText}
                  onChange={(e) => setFileText(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="grid gap-4">
              <div className="gap-4">
                <Label htmlFor="filePath" className="text-right">
                  文件路径
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="filePath"
                    placeholder="输入文件路径..."
                    className="col-span-2 flex-grow"
                    value={filePath}
                    onChange={(e) => setFilePath(e.target.value)}
                  />
                  {/* <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleFileSelect}
                  >
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  /> */}
                </div>
              </div>
              <div className="gap-4">
                <Label htmlFor="fileName" className="text-right">
                  文件名
                </Label>
                <Input
                  id="fileName"
                  placeholder="输入文件名（选填）"
                  className="col-span-3"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={onSubmit} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                入库中...
              </>
            ) : (
              "入库"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

