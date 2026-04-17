use std::fs;
use std::path::PathBuf;
use chrono::Utc;
use serde::{Serialize, Deserialize};
use tauri::{AppHandle, Manager};

use crate::domain::repo_stats::RepoStats;

#[derive(Serialize, Deserialize, Debug)]
pub struct RepoSnapshot {
    pub repo_name: String,
    pub repo_path: String,
    pub saved_at: String,
    pub stats: RepoStats,
}

pub fn save_snapshot(
    app: &AppHandle,
    stats: RepoStats,
) -> Result<(), String> {

    let app_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    let snapshots_dir = app_dir.join("snapshots");

    if !snapshots_dir.exists() {
        fs::create_dir_all(&snapshots_dir)
            .map_err(|e| e.to_string())?;
    }

    let timestamp = Utc::now().to_rfc3339();

    let filename = format!(
        "{}.json",
        stats.repo_slug.clone().unwrap_or_default().clone().replace(" ", "_").replace("/", "-"),
    );

    let file_path: PathBuf = snapshots_dir.join(filename);

    println!("snapshot dir: {:?}", file_path.display());

    let snapshot = RepoSnapshot {
        repo_name: stats.repo_slug.clone().unwrap_or_default().clone(),
        repo_path: file_path.display().to_string().clone(),
        saved_at: timestamp.clone(),
        stats,
    };

    println!("{:?}", snapshot);

    let json = serde_json::to_string_pretty(&snapshot)
        .map_err(|e| e.to_string())?;

    fs::write(file_path, json)
        .map_err(|e| e.to_string())?;

    Ok(())
}

pub fn load_snapshots(
    app: &AppHandle,
) -> Result<Vec<RepoSnapshot>, String> {

    let mut dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    dir.push("snapshots");

    println!("Load snap dir: {:?}", dir);

    let mut result = Vec::new();

    if !dir.exists() {
        return Ok(result);
    }

    for entry in std::fs::read_dir(dir)
        .map_err(|e| e.to_string())?
    {
        let path = entry.unwrap().path();

        let content =
            std::fs::read_to_string(path)
                .map_err(|e| e.to_string())?;

        let snapshot: RepoSnapshot =
            serde_json::from_str(&content)
                .map_err(|e| e.to_string())?;

        result.push(snapshot);
    }

    Ok(result)
}

pub fn delete_snapshot_by_id(
    app: &AppHandle,
    snapshot_id: &str,
) -> Result<(), String> {

    let mut path: PathBuf = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    path.push("snapshots");
    path.push(format!("{snapshot_id}.json"));

    if path.exists() {
        fs::remove_file(path)
            .map_err(|e| format!("Failed to delete snapshot: {e}"))?;
    }

    Ok(())
}