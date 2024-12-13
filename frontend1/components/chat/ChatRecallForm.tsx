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
import { forwardRef } from "react";

const formSchema = z.object({
  value: z.string().min(1, "请输入召回内容"),
});

export type RecallFormValues = z.infer<typeof formSchema>;

interface RecallFormProps {
  onSubmit: (values: RecallFormValues) => void;
  defaultValues?: Partial<RecallFormValues>;
}

export const ChatRecallForm = forwardRef<HTMLFormElement, RecallFormProps>(
  ({ onSubmit, defaultValues }, ref) => {
    const form = useForm<RecallFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        value: "",
        ...defaultValues,
      },
    });

    return (
      <Form {...form}>
        <form
          ref={ref}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="required">召回内容</FormLabel>
                <FormControl>
                  <Input placeholder="请输入想要了解的内容" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  }
);

ChatRecallForm.displayName = "ChatRecallForm";
