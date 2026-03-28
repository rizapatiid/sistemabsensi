"use server"

import prisma from "@/lib/prisma"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { sendLoginNotificationEmail } from "@/lib/email"

export async function loginAction(formData: FormData) {
  const idKaryawan = formData.get("idKaryawan") as string
  const password = formData.get("password") as string

  if (!idKaryawan || !password) {
    return { error: "ID Karyawan dan Password harus diisi." }
  }

  // Seed initial Admin if no users exist
  const count = await prisma.user.count()
  if (count === 0 && idKaryawan === "admin" && password === "admin") {
    await prisma.user.create({
      data: {
        id: "admin",
        nama: "Administrator",
        role: "ADMIN",
        password: "admin", // in production, hash this!
      }
    })
  }

  const user = await prisma.user.findUnique({
    where: { id: idKaryawan }
  })

  if (!user || user.password !== password) {
    return { error: "ID Karyawan atau Password salah." }
  }

  if (user.status === "BLOKIR") {
    return { error: "Akun Anda telah diblokir. Hubungi Admin." }
  }

  const cookieStore = await cookies()
  cookieStore.set("auth_session", JSON.stringify({ id: user.id, role: user.role }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })

  // -- NOTIFIKASI LOGIN KEAMANAN (FAIL-SAFE) --
  if (user.email) {
    const head = await headers()
    const ip = head.get("x-forwarded-for") || head.get("x-real-ip") || "Unknown IP"
    const ua = head.get("user-agent") || "Perangkat Tidak Dikenal"
    
    // Kirim secara async tanpa menunggu (agar login tetap cepat)
    try {
      sendLoginNotificationEmail(user.email, user.nama, ip, ua)
    } catch (e) {
      console.error("Gagal mengirim notifikasi login:", e)
    }
  }

  if (user.role === "ADMIN") {
    redirect("/admin/home")
  } else {
    redirect("/employee/home")
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("auth_session")
  redirect("/")
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("auth_session")
  if (!session) return null
  return JSON.parse(session.value)
}
