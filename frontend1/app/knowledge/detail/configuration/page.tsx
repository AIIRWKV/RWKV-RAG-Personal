"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Upload } from "lucide-react";

export default function Configuration() {
  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 px-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/knowledge">知识库</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>配置</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <h1 className="mb-4 text-xl font-semibold">配置</h1>
              <p className="mb-6 text-sm text-gray-600">
                更新知识库配置，特别是分块方法。
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="kb-name">知识库名称</Label>
                  <Input id="kb-name" value="1313" />
                </div>

                <div className="space-y-2">
                  <Label>知识库封面</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" />
                      上传
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">描述</Label>
                  <Textarea id="description" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">语言</Label>
                  <Select defaultValue="english">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">英语</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>权限</Label>
                  <RadioGroup defaultValue="only-me">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="only-me" id="only-me" />
                      <Label htmlFor="only-me">仅自己</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="team" id="team" />
                      <Label htmlFor="team">团队</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="embedding">Embedding 模型</Label>
                  <Input id="embedding" value="BAAI/bge-zh-v1.5" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chunk-method">分块方法</Label>
                  <Select defaultValue="general">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="auto-keyword">自动关键词</Label>
                    <Input type="number" id="auto-keyword" defaultValue="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="auto-question">自动问题</Label>
                    <Input type="number" id="auto-question" defaultValue="0" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chunk-token">分块 token 数</Label>
                  <Input type="number" id="chunk-token" defaultValue="128" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delimiter">分隔符</Label>
                  <Input id="delimiter" placeholder="###..." />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="layout-recognition">布局识别</Label>
                    <Switch id="layout-recognition" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="excel-to-html">Excel 转 HTML</Label>
                    <Switch id="excel-to-html" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="raptor">使用 RAPTOR 增强检索</Label>
                    <Switch id="raptor" />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">取消</Button>
                  <Button>保存</Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Description Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 font-semibold">
                "General" 分块方法描述
              </h2>
              <p className="mb-2 text-sm text-gray-600">
                支持的文件格式是 DOCX, EXCEL, PPT, IMAGE, PDF, TXT, MD, JSON,
                EML, HTML。这种方法使用“朴素”方法分块文件：
              </p>
              <ul className="mb-4 list-inside list-disc space-y-2 text-sm text-gray-600">
                <li>
                  使用视觉检测模型将文本拆分为更小的片段。
                </li>
                <li>
                  然后将相邻的片段组合在一起，直到 token 数超过“分块 token
                  数”指定的阈值，此时创建一个分块。
                </li>
              </ul>

              <h3 className="mb-4 font-semibold">"General" Examples</h3>
              <p className="mb-4 text-sm text-gray-600">
                以下截图仅供参考：
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-gray-100 p-4">
                  <h4 className="mb-2 font-medium">
                    第一步：拆分为片段。
                  </h4>
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <h5 className="mb-2 text-sm font-medium">
                      About the company
                    </h5>
                    <p className="text-sm text-gray-600">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Aliquam vestibulum, nulla odio nisi vitae...
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-100 p-4">
                  <h4 className="mb-2 font-medium">
                    第二步：合并为分块。
                  </h4>
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <h5 className="mb-2 text-sm font-medium">
                      About the company
                    </h5>
                    <p className="text-sm text-gray-600">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Aliquam vestibulum, nulla odio nisi vitae...
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
