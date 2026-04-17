import { create } from "zustand"
import { RepoStats, RepoSnapshot } from "@/types/types"

interface RepoState {
  repo?: RepoStats
  snapshots: RepoSnapshot[]

  loading: boolean
  error?: string

  setRepo: (repo: RepoStats) => void
  resetRepo: () => void

  setSnapshots: (snapshots: RepoSnapshot[]) => void
  removeSnapshot: (repoName: string) => void

  setLoading: (value: boolean) => void
  setError: (error?: string) => void
}

export const useRepoStore = create<RepoState>((set, get) => ({
  repo: undefined,
  snapshots: [],

  loading: false,
  error: undefined,

  setRepo: (repo) =>
    set({
      repo,
      loading: false
    }),

  resetRepo: () =>
    set({
      repo: undefined
    }),

  setSnapshots: (snapshots) =>
    set({
      snapshots
    }),

  removeSnapshot: (repoName) =>
    set((state) => {
      const updatedSnapshots = state.snapshots.filter(
        (snapshot) => snapshot.repo_name !== repoName
      )

      const shouldResetRepo =
        state.repo?.repo_slug === repoName

      return {
        snapshots: updatedSnapshots,
        repo: shouldResetRepo ? undefined : state.repo
      }
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