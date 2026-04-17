use crate::services::repo_service::analyze_repository;
use crate::domain::repo_stats::RepoStats;
use crate::services::snapshot_service::load_snapshots;
use crate::services::snapshot_service::save_snapshot;
use crate::services::snapshot_service::RepoSnapshot;
use crate::services::snapshot_service::delete_snapshot_by_id;
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

#[tauri::command]
pub fn delete_snapshot(
    app: AppHandle,
    snapshot_id: String,
) -> Result<(), String> {
    delete_snapshot_by_id(&app, &snapshot_id)?;
    Ok(())
}