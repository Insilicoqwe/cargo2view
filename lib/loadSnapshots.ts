import { invoke } from "@tauri-apps/api/core"
import { RepoSnapshot } from "@/types/types"

export async function loadSnapshots(
): Promise<RepoSnapshot[]> {

    return invoke<RepoSnapshot[]>("get_saved_repos")
}