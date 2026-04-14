export interface LanguageStats {
  code: number
  comments: number
  blanks: number
}

export interface FileStat {
  path: string
  size: number
}

export interface ContributorStat {
  name: string
  commits: number
}

export interface CommitInfo {
  hash: string
  author: string
  message: string
  timestamp: number
}

export interface RepoSnapshot {
    repo_name: string
    repo_path: string
    saved_at: string
    stats: RepoStats
}

export interface RepoStats {
    repo_slug?: string

    total_files: number
    total_lines: number

    languages: Record<string, LanguageStats>

    commit_count: number
    commit_info: CommitInfo[]
    avg_commit_size: number
    commit_frequency: number

    contributors_count: number
    contributors: ContributorStat[]

    branches_count: number

    last_activity?: number

    repo_size: number

    largest_files: FileStat[]
}