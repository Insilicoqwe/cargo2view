use crate::services::repo_service::analyze_repository;
use crate::domain::repo_stats::RepoStats;
use crate::services::snapshot_service::load_snapshots;
use crate::services::snapshot_service::save_snapshot;
use crate::services::snapshot_service::RepoSnapshot;
use tauri::AppHandle;

#[tauri::command]
pub fn add_repo(
    url: &str,
    app: tauri::AppHandle,
) -> Result<RepoStats, String> {

    let stats = analyze_repository(&app, url)?;
    save_snapshot(&app, stats.clone())?;
    Ok(stats)
}

#[tauri::command]
pub fn get_saved_repos(
    app: tauri::AppHandle,
) -> Result<Vec<RepoSnapshot>, String> {

    load_snapshots(&app)
}