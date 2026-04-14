use serde::{Serialize, Deserialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LanguageStats {
    pub code: usize,
    pub comments: usize,
    pub blanks: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileStat {
    pub path: String,
    pub size: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContributorStat {
    pub name: String,
    pub commits: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommitInfo {
    pub hash: String,
    pub author: String,
    pub message: String,
    pub timestamp: i64,

}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RepoStats {
    pub repo_slug: Option<String>,

    pub total_files: usize,
    pub total_lines: usize,
    pub languages: HashMap<String, LanguageStats>,

    pub commit_count: usize,
    pub commit_info: Vec<CommitInfo>,
    pub avg_commit_size: f64,
    pub commit_frequency: f64,

    pub contributors_count: usize,
    pub contributors: Vec<ContributorStat>,

    pub branches_count: usize,

    pub last_activity: Option<i64>,

    pub repo_size: u64,

    pub largest_files: Vec<FileStat>,
}