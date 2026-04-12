"use server"

import { toggleMaintenanceMode } from "@/lib/settings"
import { revalidatePath } from "next/cache"

export async function updateMaintenanceAction(value: boolean, reason?: string, until?: string) {
    try {
        await toggleMaintenanceMode(value, reason, until)
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        return { error: "Gagal memperbarui mode maintenance." }
    }
}
