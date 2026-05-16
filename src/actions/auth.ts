"use server"

import prisma from "@/lib/prisma"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { sendLoginNotificationEmail, sendResetPasswordEmail } from "@/lib/email"

export async function loginAction(formData: FormData) {
  const idKaryawan = formData.get("idKaryawan") as string
  const password = formData.get("password") as string

  if (!idKaryawan || !password) {
    return { error: "ID Karyawan dan Password harus diisi." }
  }

  // EXTREME OPTIMIZATION: Try findUnique by ID first (Indexed & Fastest)
  let user = await prisma.user.findUnique({
    where: { id: idKaryawan }
  })

  // Fallback to case-insensitive lookup only if ID fails
  if (!user) {
    user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: { equals: idKaryawan, mode: 'insensitive' } },
          { email: { equals: idKaryawan, mode: 'insensitive' } }
        ]
      }
    })
  }

  // Fallback for initial setup (Seed only if no user found and using admin:admin)
  if (!user && idKaryawan === "admin" && password === "admin") {
    const count = await prisma.user.count()
    if (count === 0) {
      user = await prisma.user.create({
        data: {
          id: "admin",
          nama: "Administrator",
          role: "ADMIN",
          password: "admin",
        }
      })
    }
  }

  if (!user || user.password !== password) {
    return { error: "ID Karyawan/Email atau Password salah." }
  }

  if (user.status === "BLOKIR") {
    return { error: "Akun Anda telah diblokir. Hubungi Admin." }
  }

  const sessionData = { id: user.id, role: user.role }
  const cookieStore = await cookies()
  cookieStore.set("auth_session", JSON.stringify(sessionData), {
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

export async function requestPasswordResetAction(email: string) {
  if (!email) return { error: "Email harus diisi." }

  try {
    const user = await prisma.user.findFirst({
      where: { 
        email: {
          equals: email.toLowerCase().trim(),
          mode: 'insensitive' 
        } 
      }
    })

    if (!user) {
      // Untuk keamanan, jangan beri tahu jika email tidak ada
      // Tapi dalam aplikasi internal, mungkin lebih baik beri tahu.
      return { error: "Akun dengan email tersebut tidak ditemukan." }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 menit

    await prisma.passwordReset.create({
      data: {
        email,
        otp,
        expiresAt
      }
    })

    await sendResetPasswordEmail(email, user.nama, otp)
    return { success: true }
  } catch (err) {
    console.error("DEBUG_OTP_ERROR:", err)
    return { error: "Gagal memproses permintaan reset password. Silakan cek koneksi internet atau hubungi admin." }
  }
}

export async function verifyOtpAction(email: string, otp: string) {
  const reset = await prisma.passwordReset.findFirst({
    where: {
      email,
      otp,
      expiresAt: { gt: new Date() }
    },
    orderBy: { createdAt: 'desc' }
  })

  if (!reset) return { error: "Kode OTP tidak valid atau sudah kedaluwarsa." }
  return { success: true }
}

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email") as string
  const otp = formData.get("otp") as string
  const newPassword = formData.get("newPassword") as string

  const reset = await prisma.passwordReset.findFirst({
    where: {
      email,
      otp,
      expiresAt: { gt: new Date() }
    },
    orderBy: { createdAt: 'desc' }
  })

  if (!reset) return { error: "Sesi reset tidak valid." }

  await prisma.user.updateMany({
    where: { email },
    data: { password: newPassword } // In production, hash this!
  })

  // Hapus semua reset request untuk email ini
  await prisma.passwordReset.deleteMany({
    where: { email }
  })

  return { success: true }
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
