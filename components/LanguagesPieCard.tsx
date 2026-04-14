"use client"

import { useMemo } from "react"
import { useRepoStore } from "@/store/useRepoStore"

import { Layers } from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { Progress } from "./ui/progress"


const COLORS = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#9333ea",
  "#e11d48",
  "#0891b2",
  "#ca8a04",
]

import type {
  TooltipProps
} from "recharts"

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload?.length) {
    const item = payload[0]
    return (
      <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-md text-xs">
        <span className="font-semibold text-zinc-800">{item.name}</span>
        <span className="ml-2 text-zinc-500">{item.value}%</span>
      </div>
    );
  }
  return null;
};

export function LanguagesPieCard() {

  const repo = useRepoStore(
    s => s.repo
  )

  const data = useMemo(() => {

    if (!repo) return []

    const arr = Object.entries(
      repo.languages
    ).map(([name, lang]) => ({

      name,

      value: lang.blanks

    }))


    // сортировка по убыванию
    arr.sort(
      (a, b) => b.value - a.value
    )


    return arr

  }, [repo])


  if (!repo || data.length === 0)
    return null


  const total = data.reduce(
    (sum, l) => sum + l.value,
    0
  )


  return (
    <Card className="">
        <CardHeader>
            <CardTitle className="flex gap-1.5 items-center text-muted-foreground">
                <Layers size={16}/>
                <p>Languages</p>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-center gap-4">
                <div className="w-32 h-32 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} dataKey="value" nameKey="name" innerRadius={28} outerRadius={52} paddingAngle={2} strokeWidth={0}>
                                {data.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip/>}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-5">
                    {
                        data.map((lang, index) => {
                            const percentRaw = ( lang.value / total * 100)
                            if (percentRaw <= 0.0) return null
                            const percent = percentRaw.toFixed(1)
                            return (
                                <div key={lang.name} >
                                    <div className="flex justify-between mb-1">
                                        <span className="flex items-center gap-1.5">
                                            <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span>{lang.name}</span>
                                        </span>
                                        <span className="text-muted-foreground">{percent}%</span>
                                    </div>
                                    <Progress value={percentRaw}/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </CardContent>
    </Card>
  )

}