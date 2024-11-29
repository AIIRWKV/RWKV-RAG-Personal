"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  assistantName: z.string().min(1, "Assistant name is required"),
  avatar: z.string().optional(),
  emptyResponse: z.string().optional(),
  opener: z.string().optional(),
  showQuote: z.boolean().default(true),
  textToSpeech: z.boolean().default(false),
  knowledgeBase: z.string().min(1, "Knowledge base is required"),
});

export type AssistantSettingFormValues = z.infer<typeof formSchema>;

interface AssistantSettingFormProps {
  onSubmit: (values: AssistantSettingFormValues) => void;
  defaultValues?: Partial<AssistantSettingFormValues>;
}

export function AssistantSettingForm({ 
  onSubmit, 
  defaultValues 
}: AssistantSettingFormProps) {
  const form = useForm<AssistantSettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assistantName: "",
      avatar: "",
      emptyResponse: "",
      opener: "你好，我是你的助手，有什么可以帮您的？",
      showQuote: true,
      textToSpeech: false,
      knowledgeBase: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="assistantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required">助手名称</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Resume Jarvis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>助手头像</FormLabel>
              <FormControl>
                <Button
                  type="button"
                  variant="outline" 
                  className="w-full"
                  onClick={() => {/* 处理上传逻辑 */}}
                >
                  上传
                </Button>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emptyResponse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>空响应</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="opener"
          render={({ field }) => (
            <FormItem>
              <FormLabel>设置开场白</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="showQuote"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>显示引用</FormLabel>
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="textToSpeech"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>文字转语音</FormLabel>
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="knowledgeBase"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required">知识库</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择知识库" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
