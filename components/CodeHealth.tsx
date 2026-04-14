"use client"

import { LucideIcon } from "lucide-react"
import { useRepoStore } from "@/store/useRepoStore"
import { ChartNoAxesColumn, RulerDimensionLine, FileStack, FolderGit, Gauge } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

// ─── Format bytes ──────────────────────────────────────────────────────────
function formatBytes(bytes: number) {
  if (!bytes) return "0 B"

  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return (
    (bytes / Math.pow(k, i)).toFixed(2) +
    " " +
    sizes[i]
  )
}

function getAverageLines(totalLines: number, totalFiles: number) {
  if (!totalFiles) return 0
  return Math.round(totalLines / totalFiles)
}

// ─── Insight helper ──────────────────────────────────────────────────────────
const fileSizeInsight = (n:number) => {
  if (n < 3_000)  return { label: "Very modular",     tone: "good" };
  if (n < 10_000) return { label: "Modular",          tone: "good" };
  if (n < 30_000) return { label: "Mixed",            tone: "neutral" };
  if (n < 80_000) return { label: "Large files",      tone: "warn" };
  return                 { label: "Monolithic files", tone: "warn" };
};

const linesInsight = (n:number) => {
  if (n < 80)  return { label: "Very small",          tone: "good" };
  if (n < 200) return { label: "Well-sized",          tone: "good" };
  if (n < 400) return { label: "Getting long",        tone: "neutral" };
  if (n < 800) return { label: "Overly large",        tone: "warn" };
  return              { label: "Monolithic",          tone: "warn" };
};

const commitSizeInsight = (n:number) => {
  if (n < 10)  return { label: "Micro-commits",       tone: "good" };
  if (n < 40)  return { label: "Professional style",  tone: "good" };
  if (n < 120) return { label: "Resonable",           tone: "neutral" };
  if (n < 400) return { label: "Large commits",       tone: "warn" };
  return              { label: "Massive commits",     tone: "warn" };
};

const freqInsight = (n:number) => {
  if (n >= 10)  return { label: "Daily cadence",      tone: "good" };
  if (n >= 2)   return { label: "Active",             tone: "good" };
  if (n >= 0.5) return { label: "Common",             tone: "neutral" };
  if (n < 0.5)  return { label: "Slow",               tone: "warn" };
  return               { label: "Inactive",           tone: "warn" };
};

// ─── Insight ──────────────────────────────────────────────────────────
interface InsightProps {
    label: string
    tone?: string
}

const tones = {
  good: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  warn: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  neutral: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  info: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
} as const

const Insight = ({ label, tone = "neutral" }: InsightProps) => {
  return (
    <Badge variant="outline" className={`${tones[tone as keyof typeof tones] || tones.neutral}`}>
      {label}
    </Badge>
  );
};

// ─── Metric row ──────────────────────────────────────────────────────────
interface MetricRowProps {
    icon?: LucideIcon
    label: string
    value: any
    sub: string
    insight: InsightProps
}

const MetricRow = ({icon: Icon, label, value, sub, insight}: MetricRowProps) => (
    <Item>
        <ItemMedia variant="image">
            <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center shrink-0">
                {Icon && <Icon/>}
            </div>
        </ItemMedia>
        <ItemContent>
            <ItemTitle className="">{label}</ItemTitle>
            <ItemDescription className="">{sub}</ItemDescription>
        </ItemContent>
            <ItemActions className="flex">
                {insight && <Insight label={insight.label} tone={insight.tone}/>}
                <p>{value}</p> 
        </ItemActions>
    </Item>
);

export function CodeHealth() {

    const repo = useRepoStore(
        s => s.repo
    )
  
    if (!repo) return null

    const averageFileSize =
    repo.total_files > 0
        ? repo.repo_size / repo.total_files
        : 0

    const avgLines = getAverageLines(
        repo.total_lines,
        repo.total_files
    )

  return (
    <Card className="pb-8">
        <CardHeader>
            <CardTitle className="flex gap-1.5 items-center text-muted-foreground">
                <ChartNoAxesColumn size={16}/>
                <p>Code Health</p>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <MetricRow icon={RulerDimensionLine} label={"Avg file size"} value={formatBytes(averageFileSize)} sub="size / files" insight={fileSizeInsight(averageFileSize)}/>
            <Separator/>
            <MetricRow icon={FileStack} label={"Avg lines per file"} value={avgLines} sub="lines / files" insight={linesInsight(avgLines)}/>
            <Separator/>
            <MetricRow icon={FolderGit} label={"Avg commit size"} value={(repo.avg_commit_size).toFixed(1)} sub="lines changed per commit" insight={commitSizeInsight(repo.avg_commit_size)}/>
            <Separator/>
            <MetricRow icon={Gauge} label={"Commit frequency"} value={(repo.commit_frequency).toFixed(1)+ "/wk"} sub="average commits per week" insight={freqInsight(repo.commit_frequency)}/>
        </CardContent>
    </Card>
  )
}