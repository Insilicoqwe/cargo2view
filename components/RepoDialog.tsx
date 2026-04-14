"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { Plus } from 'lucide-react';

import { addRepo } from "@/lib/addRepo"
import { useRepoStore } from "@/store/useRepoStore"

export function RepoDialog({ onRepoAdded }: { onRepoAdded: () => void }) {
  const [url, setUrl] = useState("")
  const [open, setOpen] = useState(false)

  const setRepo = useRepoStore((s) => s.setRepo)

  async function handleSubmit() {
      if (!url) return

      const repo = await addRepo(url)
      setRepo(repo)
      onRepoAdded?.()
      setOpen(false)
      setUrl("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>
        <Button size="lg">
            <Plus/>
            Add repository
        </Button>
      </DialogTrigger>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Add repository
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">

          <div className="grid gap-2">

            <Label htmlFor="repo" className="text-muted-foreground">
              Repository URL
            </Label>

            <Input
              id="repo"
              placeholder="https://github.com/user/project"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

          </div>

        </div>

        <DialogFooter>

          <Button onClick={handleSubmit}>
            Analyze
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  )
}