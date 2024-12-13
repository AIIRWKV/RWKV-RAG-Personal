"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Info } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formSchema = z.object({
  systemPrompt: z.string().min(1, "系统提示词不能为空"),
  similarityThreshold: z.number().min(0).max(1),
  keywordWeight: z.number().min(0).max(1),
  topN: z.number().min(1).max(10),
  multiTurn: z.boolean(),
  rerankModel: z.string().min(1, "重排序模型不能为空"),
  variables: z.array(z.object({
    key: z.string(),
    optional: z.boolean()
  }))
});

export type PromptEngineFormValues = z.infer<typeof formSchema>;

interface PromptEngineFormProps {
  onSubmit: (values: PromptEngineFormValues) => void;
  defaultValues?: Partial<PromptEngineFormValues>;
}

export function PromptEngineForm({ onSubmit, defaultValues }: PromptEngineFormProps) {
  const form = useForm<PromptEngineFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      systemPrompt: "",
      similarityThreshold: 0.5,
      keywordWeight: 0.5,
      topN: 5,
      multiTurn: false,
      rerankModel: "",
      variables: [{ key: "knowledge", optional: false }],
      ...defaultValues,
    },
  });

  const LabelWithTooltip = ({ label, tooltip }: { label: string; tooltip: string }) => (
    <div className="flex items-center gap-2">
      {label.includes("*") && <span className="text-red-500">*</span>}
      <Label>{label.replace("*", "")}</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="systemPrompt"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <LabelWithTooltip 
                label="*系统提示词" 
                tooltip="系统提示词" 
              />
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[100px]"
                  placeholder="输入系统提示词..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="similarityThreshold"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <LabelWithTooltip 
                label="相似度阈值" 
                tooltip="设置匹配的相似度阈值" 
              />
              <FormControl>
                <Slider
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keywordWeight"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <LabelWithTooltip 
                label="关键词相似度权重" 
                tooltip="设置关键词相似度的权重" 
              />
              <FormControl>
                <Slider
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topN"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <LabelWithTooltip 
                label="Top N" 
                tooltip="设置返回结果的数量" 
              />
              <FormControl>
                <Slider
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="multiTurn"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <LabelWithTooltip 
                label="多轮优化" 
                tooltip="启用多轮对话优化" 
              />
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
          name="rerankModel"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <LabelWithTooltip 
                label="重排序模型" 
                tooltip="选择重排序模型" 
              />
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="model1">Model 1</SelectItem>
                  <SelectItem value="model2">Model 2</SelectItem>
                  <SelectItem value="model3">Model 3</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>变量</Label>
            <Button type="button" variant="outline" size="sm">添加</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>可选</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.watch("variables").map((variable, index) => (
                <TableRow key={index}>
                  <TableCell>{variable.key}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={variable.optional}
                      onCheckedChange={(checked) => {
                        const variables = [...form.getValues("variables")];
                        variables[index].optional = checked;
                        form.setValue("variables", variables);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </form>
    </Form>
  );
}