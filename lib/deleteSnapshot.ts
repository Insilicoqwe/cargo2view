import { invoke } from "@tauri-apps/api/core"

export async function deleteSnapshot(snapshotId: string) {
  try {
    await invoke("delete_snapshot", {
      snapshotId
    })
  } catch (err) {
    console.error("Delete snapshot error:", err)
  }
}