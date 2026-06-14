"use server"

import { toggleMaintenanceMode } from "@/lib/settings"
import { revalidatePath, revalidateTag } from "next/cache"

export async function updateMaintenanceAction(value: boolean, reason?: string, until?: string) {
    try {
        await toggleMaintenanceMode(value, reason, until)
        revalidateTag("system-settings", "max") // Bust cache settings secara instan
        revalidatePath("/", "layout")     // Rerender semua halaman
        return { success: true }
    } catch (error) {
        return { error: "Gagal memperbarui mode maintenance." }
    }
}

