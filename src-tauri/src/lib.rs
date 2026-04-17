mod commands;
mod services;
mod analysis;
mod git;
mod domain;

use crate::commands::repo_command::add_repo;
use crate::commands::repo_command::get_saved_repos;
use crate::commands::repo_command::delete_snapshot;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![add_repo, get_saved_repos, delete_snapshot])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}