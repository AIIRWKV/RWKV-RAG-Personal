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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SliderFieldState {
  enabled: boolean;
  value: number[];
}

const formSchema = z.object({
  model: z.string().min(1, "Model is required"),
  freedom: z.string(),
  temperature: z.object({
    enabled: z.boolean(),
    value: z.array(z.number().min(0).max(1))
  }),
  topP: z.object({
    enabled: z.boolean(),
    value: z.array(z.number().min(0).max(1))
  }),
  presencePenalty: z.object({
    enabled: z.boolean(),
    value: z.array(z.number().min(0).max(1))
  }),
  frequencyPenalty: z.object({
    enabled: z.boolean(),
    value: z.array(z.number().min(0).max(1))
  }),
  maxTokens: z.object({
    enabled: z.boolean(),
    value: z.array(z.number().min(1).max(2048))
  })
});

export type ModelSettingFormValues = z.infer<typeof formSchema>;

interface ModelSettingFormProps {
  onSubmit: (values: ModelSettingFormValues) => void;
  defaultValues?: Partial<ModelSettingFormValues>;
}

const SliderField = ({ 
  label, 
  tooltip, 
  state, 
  setState, 
  max = 1, 
  step = 0.01 
}: {
  label: string;
  tooltip: string;
  state: SliderFieldState;
  setState: (state: SliderFieldState) => void;
  max?: number;
  step?: number;
}) => (
  <div className="grid gap-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Label>{label}</Label>
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
      <div className="flex items-center gap-4">
        <Switch
          checked={state.enabled}
          onCheckedChange={(checked) =>
            setState({ ...state, enabled: checked })
          }
        />
        <Input
          type="number"
          value={state.value[0]}
          onChange={(e) =>
            setState({
              ...state,
              value: [parseFloat(e.target.value)],
            })
          }
          className="w-16"
          step={step}
        />
      </div>
    </div>
    <Slider
      disabled={!state.enabled}
      value={state.value}
      onValueChange={(value) =>
        setState({ ...state, value })
      }
      max={max}
      step={step}
      className="w-full"
    />
  </div>
);

export function ModelSettingForm({ onSubmit, defaultValues }: ModelSettingFormProps) {
  const form = useForm<ModelSettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "deepseek-chat",
      freedom: "precise",
      temperature: { enabled: true, value: [0.1] },
      topP: { enabled: true, value: [0.3] },
      presencePenalty: { enabled: true, value: [0.4] },
      frequencyPenalty: { enabled: true, value: [0.7] },
      maxTokens: { enabled: true, value: [512] },
      ...defaultValues,
    },
  });

  const LabelWithTooltip = ({ label, tooltip, required = false }: { 
    label: string; 
    tooltip: string;
    required?: boolean;
  }) => (
    <div className="flex items-center gap-2">
      {required && <span className="text-red-500">*</span>}
      <Label>{label}</Label>
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
          name="model"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <LabelWithTooltip 
                label="模型" 
                tooltip="选择使用的AI模型"
                required 
              />
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择模型" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="deepseek-chat">deepseek-chat</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="freedom"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <LabelWithTooltip 
                label="自由度" 
                tooltip="设置响应的自由度" 
              />
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择自由度" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="precise">Precise</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          {[
            {
              name: "temperature",
              label: "温度",
              tooltip: "控制输出的随机性",
              max: 1,
              step: 0.01
            },
            {
              name: "topP",
              label: "Top P",
              tooltip: "控制输出的多样性",
              max: 1,
              step: 0.01
            },
            {
              name: "presencePenalty",
              label: "Presence Penalty",
              tooltip: "基于文本中出现的新词进行惩罚",
              max: 1,
              step: 0.01
            },
            {
              name: "frequencyPenalty",
              label: "频率惩罚",
              tooltip: "基于文本中出现的新词进行惩罚",
              max: 1,
              step: 0.01
            },
            {
              name: "maxTokens",
              label: "最大Token数",
              tooltip: "生成Token的最大数量",
              max: 2048,
              step: 1
            }
          ].map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name as keyof ModelSettingFormValues}
              render={({ field: formField }) => (
                <FormItem>
                  <SliderField
                    label={field.label}
                    tooltip={field.tooltip}
                    state={formField.value as SliderFieldState}
                    setState={(newState) => formField.onChange(newState)}
                    max={field.max}
                    step={field.step}
                  />
                </FormItem>
              )}
            />
          ))}
        </div>
      </form>
    </Form>
  );
}