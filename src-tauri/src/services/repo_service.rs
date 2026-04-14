use crate::analysis::repo_analysis::analyze_repo;
use crate::git::clone::clone_and_get_path;
use crate::domain::repo_stats::RepoStats;
use tauri::AppHandle;

pub fn analyze_repository(
    app: &AppHandle,
    url: &str,
) -> Result<RepoStats, String> {

    let repo_path = clone_and_get_path(&app, &url)?;
    println!("Repo dir: {:?}", &repo_path);
    Ok(analyze_repo(&repo_path))
}