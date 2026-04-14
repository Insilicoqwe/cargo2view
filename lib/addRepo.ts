import { invoke } from "@tauri-apps/api/core"
import { RepoStats } from "@/types/types"

export async function addRepo(
    url: string,
): Promise<RepoStats> {

    return invoke("add_repo", { url })

}