'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PDF_TOOLS, TOOL_CATEGORIES } from '@/lib/pdf-tools'
import {
  Layers,
  Minimize2,
  ArrowLeftRight,
  Edit3,
  Shield,
  Sparkles,
  FileText,
  Scissors,
  FileImage,
  FileType,
  Lock,
  Unlock,
  RotateCw,
  Trash2,
  Copy,
  FolderOpen,
  Wrench,
  ScanText,
  PenTool,
  Hash,
  Droplets,
  Crop,
  EyeOff,
  MessageSquare,
  Languages,
  FileOutput,
} from 'lucide-react'

const toolIcons: Record<string, React.ReactNode> = {
  merge: <Layers className="h-6 w-6" />,
  split: <Scissors className="h-6 w-6" />,
  'remove-pages': <Trash2 className="h-6 w-6" />,
  'extract-pages': <Copy className="h-6 w-6" />,
  organize: <FolderOpen className="h-6 w-6" />,
  rotate: <RotateCw className="h-6 w-6" />,
  compress: <Minimize2 className="h-6 w-6" />,
  repair: <Wrench className="h-6 w-6" />,
  ocr: <ScanText className="h-6 w-6" />,
  'jpg-to-pdf': <FileImage className="h-6 w-6" />,
  'png-to-pdf': <FileImage className="h-6 w-6" />,
  'word-to-pdf': <FileType className="h-6 w-6" />,
  'excel-to-pdf': <FileType className="h-6 w-6" />,
  'ppt-to-pdf': <FileType className="h-6 w-6" />,
  'html-to-pdf': <FileOutput className="h-6 w-6" />,
  'pdf-to-jpg': <FileImage className="h-6 w-6" />,
  'pdf-to-png': <FileImage className="h-6 w-6" />,
  'pdf-to-word': <FileType className="h-6 w-6" />,
  'pdf-to-excel': <FileType className="h-6 w-6" />,
  'pdf-to-ppt': <FileType className="h-6 w-6" />,
  edit: <Edit3 className="h-6 w-6" />,
  'add-page-numbers': <Hash className="h-6 w-6" />,
  'add-watermark': <Droplets className="h-6 w-6" />,
  crop: <Crop className="h-6 w-6" />,
  protect: <Lock className="h-6 w-6" />,
  unlock: <Unlock className="h-6 w-6" />,
  sign: <PenTool className="h-6 w-6" />,
  redact: <EyeOff className="h-6 w-6" />,
  'ai-summarize': <Sparkles className="h-6 w-6" />,
  'ai-translate': <Languages className="h-6 w-6" />,
  'ai-chat': <MessageSquare className="h-6 w-6" />,
}

const categoryColors: Record<string, string> = {
  organize: 'bg-chart-1/10 text-chart-1 hover:bg-chart-1/20',
  optimize: 'bg-chart-3/10 text-chart-3 hover:bg-chart-3/20',
  'convert-to': 'bg-chart-2/10 text-chart-2 hover:bg-chart-2/20',
  'convert-from': 'bg-chart-2/10 text-chart-2 hover:bg-chart-2/20',
  edit: 'bg-chart-4/10 text-chart-4 hover:bg-chart-4/20',
  security: 'bg-accent/10 text-accent hover:bg-accent/20',
  ai: 'bg-chart-5/10 text-chart-5 hover:bg-chart-5/20',
}

const categoryIcons: Record<string, React.ReactNode> = {
  organize: <Layers className="h-5 w-5" />,
  optimize: <Minimize2 className="h-5 w-5" />,
  'convert-to': <ArrowLeftRight className="h-5 w-5" />,
  'convert-from': <ArrowLeftRight className="h-5 w-5" />,
  edit: <Edit3 className="h-5 w-5" />,
  security: <Shield className="h-5 w-5" />,
  ai: <Sparkles className="h-5 w-5" />,
}

export function ToolsGrid() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            <FileText className="mr-2 h-3.5 w-3.5" />
            25+ PDF Tools
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            All the PDF Tools You Need
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            From basic operations to advanced AI features, we have everything covered.
          </p>
        </div>

        {/* Tools by Category */}
        <div className="space-y-12">
          {TOOL_CATEGORIES.map(category => {
            const categoryTools = PDF_TOOLS.filter(tool => tool.category === category.id)
            if (categoryTools.length === 0) return null

            return (
              <div key={category.id}>
                {/* Category Header */}
                <div className="mb-6 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${categoryColors[category.id]}`}
                  >
                    {categoryIcons[category.id]}
                  </div>
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                {/* Tools Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryTools.map(tool => (
                    <Link key={tool.id} href={tool.path}>
                      <Card
                        className={`group relative h-full transition-all duration-200 hover:shadow-md ${categoryColors[tool.category]}`}
                      >
                        <CardContent className="flex items-start gap-4 p-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">
                            {toolIcons[tool.id] || <FileText className="h-6 w-6" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground">{tool.name}</h4>
                              {tool.isPremium && (
                                <Badge
                                  variant="secondary"
                                  className="bg-primary/10 text-primary text-[10px] px-1.5 py-0"
                                >
                                  PRO
                                </Badge>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                              {tool.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
