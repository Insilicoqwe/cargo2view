"use client"

import { useEffect, useState, useCallback } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { RepoDialog } from "./RepoDialog";
import { Settings, ChevronRight, Trash2 } from 'lucide-react';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { loadSnapshots } from "@/lib/loadSnapshots"
import { useRepoStore } from "@/store/useRepoStore"
import { RepoSnapshot, RepoStats } from "@/types/types"

function splitRepoName(fullName: string): { owner: string; repo: string } {
  const [owner, repo] = fullName.split("/");
  return { owner, repo };
}

export function AppSidebar() {
    const setRepo = useRepoStore((s) => s.setRepo);
    const [snapshots, setSnapshots] = useState<RepoSnapshot[]>([]);

    const refreshSnapshots = useCallback(async () => {
        const data = await loadSnapshots();
        setSnapshots(data);
    }, []);

    useEffect(() => {
        refreshSnapshots();
    }, [refreshSnapshots]);

    async function handleSubmit(repo: RepoStats) {
        setRepo(repo);
    }

  return (
    <Sidebar variant="inset">
        <SidebarHeader>
            <div className="flex items-center justify-center font-syne font-extrabold text-2xl select-none">
                <span>cargo<span className="text-amber-600">2</span>view</span>
            </div>
            <Separator/>
        </SidebarHeader>
        <SidebarContent className="flex-col gap-2">
            {snapshots.map(snapshot => {
                const { owner, repo } = splitRepoName(snapshot.repo_name);
                return (
                    <Item variant="outline" asChild className="cursor-pointer" key={snapshot.stats.repo_slug} onClick={() => handleSubmit(snapshot.stats)}>
                        <a>
                            <ItemContent>
                                <ItemTitle className="">{repo}</ItemTitle>
                                <ItemDescription className="">{owner}</ItemDescription>
                            </ItemContent>
                            <ItemActions>
                                <ChevronRight size={16}/>
                            </ItemActions>
                        </a>
                    </Item>
                );
            })}
        </SidebarContent>
        <SidebarFooter>
            <Separator/>
            <RepoDialog onRepoAdded={refreshSnapshots}/>
            {/* <Button><Plus/>Add repository</Button> */}
            <Button size="lg" variant="outline"><Settings/>Settings</Button>
        </SidebarFooter>
    </Sidebar>
  )
}