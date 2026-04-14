"use client"

import { Clock } from 'lucide-react';
import { useRepoStore } from "@/store/useRepoStore"
import { Separator } from "./ui/separator"
import { HardDrive } from 'lucide-react';

export function RepoSlugLabel() {

    const repo = useRepoStore((s) => s.repo)

    return (
        <div>
            <p className="font-sans text-2xl">{repo?.repo_slug ?? "Repository"}</p>
            <div className="flex gap-4 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground"><Clock size={14}/>{repo?.last_activity ? new Date(repo.last_activity * 1000).toLocaleDateString() : "unknown"}</p>
                <p className="flex items-center gap-2 text-muted-foreground"><HardDrive size={14}/>{(repo?.repo_size / 1024 / 1024).toFixed(2) + " MB"}</p>
            </div>
            <Separator className='mt-5'></Separator>
        </div>
    )
}