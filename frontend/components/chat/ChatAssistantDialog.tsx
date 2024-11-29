"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AssistantSettingForm,
  AssistantSettingFormValues,
} from "./AssistantSettingForm";
import { Button } from "../ui/button";
import { PromptEngineForm, PromptEngineFormValues } from "./PromptEngineForm";
import { ModelSettingForm, ModelSettingFormValues } from "./ModelSettingForm";
import { useEffect } from "react";

export default function ChatConfigurationDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  function onSubmit(
    values:
      | AssistantSettingFormValues
      | PromptEngineFormValues
      | ModelSettingFormValues
  ) {
    console.log(values);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>聊天配置</DialogTitle>
          <p className="text-sm text-muted-foreground">
            这里，为您的专属知识库打造一个专属助手！ 💕
          </p>
        </DialogHeader>
        <Tabs defaultValue="account" className="">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assistantSetting" className="hover:bg-gray-200">
              助理设置
            </TabsTrigger>
            <TabsTrigger value="promptEngine" className="hover:bg-gray-200">
              提示词引擎
            </TabsTrigger>
            <TabsTrigger value="modelSetting" className="hover:bg-gray-200">
              模型设置
            </TabsTrigger>
          </TabsList>
          <TabsContent value="assistantSetting">
            <AssistantSettingForm onSubmit={onSubmit} />
          </TabsContent>
          <TabsContent value="promptEngine">
            <PromptEngineForm onSubmit={onSubmit} />
          </TabsContent>
          <TabsContent value="modelSetting">
            <ModelSettingForm onSubmit={onSubmit} />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" onClick={() => onSubmit}>
              确定
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
