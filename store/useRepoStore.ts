import { create } from "zustand"
import { RepoStats } from "@/types/types"

interface RepoState {
  repo?: RepoStats
  loading: boolean
  error?: string

  setRepo: (repo: RepoStats) => void
  setLoading: (value: boolean) => void
  setError: (error?: string) => void
}

export const useRepoStore = create<RepoState>((set) => ({
  repo: undefined,
  loading: false,
  error: undefined,

  setRepo: (repo) =>
    set({
      repo,
      loading: false
    }),

  setLoading: (loading) =>
    set({
      loading
    }),

  setError: (error) =>
    set({
      error,
      loading: false
    })
}))