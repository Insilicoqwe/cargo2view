use std::path::Path;
use std::path::PathBuf;
use git2::Repository;
use tauri::{AppHandle, Manager};
use chrono::Utc;
use std::fs;

fn extract_repo_slug(url: &str) -> Option<(String, String)> {
    let parts: Vec<&str> = url
        .trim_end_matches(".git")
        .split('/')
        .collect();

    if parts.len() < 2 {
        return None;
    }

    let repo = parts.last()?.to_string();
    let owner = parts.get(parts.len() - 2)?.to_string();

    Some((owner, repo))
}

pub fn build_repo_path(
    app: &AppHandle,
    repo_slug: &str,
) -> PathBuf {

    // let timestamp = Utc::now()
    //     .format("%Y-%m-%dT%H-%M")
    //     .to_string();

    app.path()
        .app_data_dir()
        .expect("cannot resolve app_data_dir")
        .join("repos")
        .join(format!("{}", repo_slug.replace("/", "_")))
}

pub fn fresh_clone_repo(
    path: &PathBuf,
    url: &str,
) -> Result<(), git2::Error> {

    if path.exists() {
        fs::remove_dir_all(path)
            .map_err(|e| git2::Error::from_str(&e.to_string()))?;
    }

    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| git2::Error::from_str(&e.to_string()))?;
    }

    println!("fresh: {:?}", &path);

    Repository::clone(url, path)?;

    Ok(())
}

pub fn clone_and_get_path(
    app: &AppHandle,
    url: &str,
) -> Result<PathBuf, String> {

    let (owner, repo) = extract_repo_slug(url)
        .ok_or("Invalid repository URL")?;

    let slug = format!("{}/{}", owner, repo);

    let repo_path = build_repo_path(app, &slug);

    fresh_clone_repo(&repo_path, url)
        .map_err(|e| e.to_string())?;

    Ok(repo_path)
}