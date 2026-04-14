"use client"

import { useRepoStore } from "@/store/useRepoStore"

export function CommitsList() {

  const repo = useRepoStore(
    s => s.repo
  )

  if (!repo) return null

  return (

    <div>

      <h3>Commits</h3>

      {repo.commit_info.map(commit => (

        <div key={commit.hash}>

          {commit.author}
          {" — "}
          {commit.timestamp}

        </div>

      ))}

    </div>

  )
}