"use client"

import { useRepoStore } from "@/store/useRepoStore"

export function ContributorsList() {

  const repo = useRepoStore(
    s => s.repo
  )

  if (!repo) return null

  return (

    <div>

      <h3>Top contributors</h3>

      {repo.contributors.map(author => (

        <div key={author.name}>

          {author.name}
          {" — "}
          {author.commits} commits

        </div>

      ))}

    </div>

  )
}