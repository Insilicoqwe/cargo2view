"use client"

import { useRepoStore } from "@/store/useRepoStore"
import { LucideIcon } from "lucide-react"

import { Files, Hash, GitCommit, Users, GitBranch, HardDrive } from 'lucide-react';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  description: string
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: StatCardProps) {
  return (
    <Card className="w-full">

        <CardHeader className="">
            <CardTitle className="text-md text-muted-foreground flex items-center gap-1.5">
                {Icon && <Icon size={16}/>}
                {title}
            </CardTitle>
        </CardHeader>

        <CardContent>
            <div className="text-4xl font-extrabold">
            {value}
            </div>
        </CardContent>

        <CardFooter className="text-muted-foreground">
            {description}
        </CardFooter>
    </Card>
  )
}

export function RepoStats() {
  const repo = useRepoStore((s) => s.repo)

  if (!repo) return null

  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-8">

      <StatCard
        title="Files"
        value={repo.total_files}
        icon={Files}
        description="tracked files"
      />

      <StatCard
        title="Lines"
        value={repo.total_lines}
        icon={Hash}
        description="total lines"
      />

      <StatCard
        title="Commits"
        value={repo.commit_count}
        icon={GitCommit}
        description="all time"
      />

      <StatCard
        title="Contributors"
        value={repo.contributors_count}
        icon={Users}
        description={`in ${repo.branches_count} branches`}
      />

      <StatCard
        title="Branches"
        value={repo.branches_count}
        icon={GitBranch}
        description="total branches"
      />

      <StatCard
        title="Repo size"
        value={
          (repo.repo_size / 1024 / 1024)
            .toFixed(2) + " MB"
        }
        icon={HardDrive}
        description="total repository size"
      />

    </div>
    
    // <div>
    //   <h2>Repository overview</h2>

    //   <p>Files: {repo.total_files}</p>

    //   <p>Lines: {repo.total_lines}</p>

    //   <p>Commits: {repo.commit_count}</p>

    //   <p>Contributors: {repo.contributors_count}</p>

    //   <p>Branches: {repo.branches_count}</p>

    //   <p>Size: {(repo.repo_size / 1024 / 1024).toFixed(2)} MB</p>

    //   <p>
    //     Last activity:
    //     {" "}
    //     {repo.last_activity
    //       ? new Date(
    //           repo.last_activity * 1000
    //         ).toLocaleString()
    //       : "unknown"}
    //   </p>
    // </div>
  )
}