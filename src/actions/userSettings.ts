"use server"

import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import { revalidatePath } from "next/cache"

export async function updateEmailNotifAction(enabled: boolean) {
  const session = await getSession()
  if (!session) return { error: "Sesi tidak valid" }

  try {
    await prisma.user.update({
      where: { id: session.id },
      data: { emailNotifEnabled: enabled }
    })
    revalidatePath("/admin/profil")
    revalidatePath("/employee/profil")
    return { success: true }
  } catch (error) {
    console.error("Gagal update pengaturan email:", error)
    return { error: "Gagal menyimpan pengaturan." }
  }
}
