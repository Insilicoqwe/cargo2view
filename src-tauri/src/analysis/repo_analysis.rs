use git2::{BranchType, Repository, DiffOptions};
use ignore::WalkBuilder;
use std::collections::{HashMap, HashSet};
use std::fs;
use chrono::{NaiveDateTime, Utc};
use tauri::AppHandle;
use tokei::{Config, Languages};
use std::path::PathBuf;

use crate::domain::repo_stats::{
    RepoStats,
    LanguageStats,
    FileStat,
    ContributorStat,
    CommitInfo,
};

fn get_repo_slug(repo: &git2::Repository) -> Option<String> {

    let remote =
        repo.find_remote("origin")
            .ok()?;

    let url =
        remote.url()?;

    extract_slug_from_url(url)

}

fn extract_slug_from_url(url: &str) -> Option<String> {

    if url.contains("github.com") {

        if let Some(pos) =
            url.find("github.com")
        {

            let slug =
                &url[pos + 11..];

            let slug =
                slug.trim_start_matches(':')
                    .trim_start_matches('/');

            let slug =
                slug.trim_end_matches(".git");

            return Some(slug.to_string());
        }
    }

    None
}

pub fn calculate_avg_commit_size(repo: &Repository) -> Result<f64, git2::Error> {
    let mut revwalk = repo.revwalk()?;
    revwalk.push_head()?;

    let mut total_changed_lines = 0;
    let mut commit_count = 0;

    for oid in revwalk {
        let oid = oid?;
        let commit = repo.find_commit(oid)?;

        if commit.parent_count() == 0 {
            continue;
        }

        let parent = commit.parent(0)?;

        let tree = commit.tree()?;
        let parent_tree = parent.tree()?;

        let diff = repo.diff_tree_to_tree(
            Some(&parent_tree),
            Some(&tree),
            Some(DiffOptions::new().include_untracked(true)),
        )?;

        let stats = diff.stats()?;

        total_changed_lines +=
            stats.insertions() + stats.deletions();

        commit_count += 1;
    }

    if commit_count == 0 {
        return Ok(0.0);
    }

    Ok(total_changed_lines as f64 / commit_count as f64)
}

pub fn calculate_commit_frequency(repo: &Repository) -> Result<f64, git2::Error> {
    let mut revwalk = repo.revwalk()?;
    revwalk.push_head()?;

    let mut commit_count = 0usize;
    let mut first_commit_timestamp = i64::MAX;

    for oid in revwalk {
        let oid = oid?;
        let commit = repo.find_commit(oid)?;

        commit_count += 1;

        let time = commit.time().seconds();

        if time < first_commit_timestamp {
            first_commit_timestamp = time;
        }
    }

    if commit_count == 0 {
        return Ok(0.0);
    }

    let now = Utc::now().timestamp();

    let repo_age_seconds = now - first_commit_timestamp;

    if repo_age_seconds <= 0 {
        return Ok(commit_count as f64);
    }

    let repo_age_weeks =
        repo_age_seconds as f64 / (60.0 * 60.0 * 24.0 * 7.0);

    Ok(commit_count as f64 / repo_age_weeks)
}

pub fn analyze_repo(path: &PathBuf) -> RepoStats {

    let repo = Repository::open(&path)
        .expect("failed to open repository");

    println!("Analyze path: {:?}", path);

    let repo_slug = get_repo_slug(&repo);
    let avg_commit_size = calculate_avg_commit_size(&repo).unwrap_or_default();
    let commit_frequency = calculate_commit_frequency(&repo).unwrap_or_default();
    /*
        =========================
        FILE COUNT
        =========================
    */

    let mut total_files = 0usize;

    let walker = WalkBuilder::new(&path)
        .hidden(false)
        .git_ignore(true)
        .filter_entry(|entry| {

            let name = entry.file_name().to_string_lossy();

            !matches!(
                name.as_ref(),
                "node_modules" | "target" | "dist" | "build" | ".git"
            )
        })
        .build();

    for entry in walker {

        if let Ok(entry) = entry {

            if entry
                .file_type()
                .map(|ft| ft.is_file())
                .unwrap_or(false)
            {
                total_files += 1;
            }
        }
    }


    /*
        =========================
        LANGUAGE + LINE STATS
        =========================
    */

    let mut languages = Languages::new();

    let config = Config::default();

    languages.get_statistics(&[&path], &[], &config);

    let mut total_lines = 0usize;

    let mut lang_map = HashMap::new();

    for (name, lang) in &languages {

        total_lines += lang.code;

        lang_map.insert(
            name.to_string(),
            LanguageStats {

                code: lang.code,
                comments: lang.comments,
                blanks: lang.blanks,

            },
        );
    }

    /*
        =========================
        COMMIT COUNT
        =========================
    */

    let mut revwalk = repo.revwalk()
        .expect("revwalk failed");

    revwalk.push_head()
        .expect("push_head failed");

    let mut commit_info = Vec::new();

    for oid in revwalk {
        if let Ok(oid) = oid {
            if let Ok(commit) = repo.find_commit(oid) {
                commit_info.push(
                    CommitInfo {
                        hash: oid.to_string(),
                        author: commit.author().name().unwrap_or("unknown").to_string(),
                        message: commit.summary().unwrap_or("unknown").to_string(),
                        timestamp: commit.time().seconds(),
                    }
                )
            }
        }
    }

    let commit_count = commit_info.len();


    /*
        =========================
        CONTRIBUTORS COUNT + CONTRIBUTORS STATS
        =========================
    */

    let mut contributor_map: HashMap<String, usize> = HashMap::new();

    let mut revwalk = repo.revwalk()
        .expect("revwalk failed");

    revwalk.push_head()
        .expect("push_head failed");

    for oid in revwalk {

        if let Ok(oid) = oid {

            if let Ok(commit) = repo.find_commit(oid) {

                if let Some(name) = commit.author().name() {
                    *contributor_map.entry(name.to_string()).or_insert(0) += 1;
                }
            }
        }
    }

    let contributors_count = contributor_map.len();

    let mut contributors: Vec<ContributorStat> =
    contributor_map
        .into_iter()
        .map(|(name, commits)| ContributorStat {
            name,
            commits,
        })
        .collect();

    contributors.sort_by(|a, b| b.commits.cmp(&a.commits));

    /*
        =========================
        BRANCH COUNT
        =========================
    */

    let branches_count = repo
        .branches(Some(BranchType::Local))
        .expect("branches failed")
        .count();


    /*
        =========================
        LAST ACTIVITY
        =========================
    */

    let last_activity = repo
        .head()
        .ok()
        .and_then(|h| h.peel_to_commit().ok())
        .map(|commit| commit.time().seconds());


    /*
        =========================
        REPOSITORY SIZE
        =========================
    */

    let mut repo_size = 0u64;

    let walker = WalkBuilder::new(&path)
        .hidden(false)
        .git_ignore(true)
        .filter_entry(|entry| {

            entry.file_name() != ".git"
        })
        .build();

    for entry in walker {

        if let Ok(entry) = entry {

            if let Ok(metadata) = entry.metadata() {

                if metadata.is_file() {

                    repo_size += metadata.len();
                }
            }
        }
    }


    /*
        =========================
        LARGEST FILES (TOP 10)
        =========================
    */

    let mut files: Vec<FileStat> = Vec::new();

    let walker = WalkBuilder::new(&path)
        .hidden(false)
        .git_ignore(true)
        .filter_entry(|entry| {

            entry.file_name() != ".git"
        })
        .build();

    for entry in walker {

        if let Ok(entry) = entry {

            if let Ok(metadata) = entry.metadata() {

                if metadata.is_file() {

                    files.push(FileStat {

                        path: entry
                            .path()
                            .display()
                            .to_string(),

                        size: metadata.len(),

                    });
                }
            }
        }
    }

    files.sort_by(|a, b| {

        b.size.cmp(&a.size)

    });

    let largest_files = files
        .into_iter()
        .take(10)
        .collect();


    /*
        =========================
        FINAL STRUCT
        =========================
    */

    RepoStats {
        repo_slug,

        total_files,

        total_lines,

        languages: lang_map,

        commit_count,
        commit_info,
        avg_commit_size,
        commit_frequency,

        contributors_count,

        contributors,

        branches_count,

        last_activity,

        repo_size,

        largest_files,
    }
}