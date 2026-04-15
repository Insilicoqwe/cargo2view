"use client"

import { LucideIcon } from "lucide-react"
import { useRepoStore } from "@/store/useRepoStore"
import { ChartNoAxesColumn} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import { Separator } from "./ui/separator";
import { Progress } from "@/components/ui/progress"

export function ContributorActivity() {

    const repo = useRepoStore(
        s => s.repo
    )

    if (!repo) return null

    const top = [...repo.contributors].sort((a, b) => b.commits - a.commits).slice(0, 5)

    const maxCommits = top[0]?.commits ?? 1

  return (
    <Card className="pb-8">
        <CardHeader>
            <CardTitle className="flex gap-1.5 items-center text-muted-foreground">
                <ChartNoAxesColumn size={16}/>
                <p>Top 5 contributors</p>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-center gap-4">
                <div className="flex-1  justify-between">
                {
                    top.map(contributor => {
                        const percent = (contributor.commits / maxCommits) * 100
                        return (
                            <div key={contributor.name}>
                                <div className="flex justify-between my-3">
                                    <p>{contributor.name}</p>
                                    <p>{contributor.commits}</p>
                                </div>
                                <Progress value={percent}></Progress>
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