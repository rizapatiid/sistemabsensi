"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getSession } from "@/actions/auth"
import { getTodayJakarta, getJakartaDate } from "@/lib/date"
import { sendNotificationToUser } from "@/actions/push"

export async function submitKehadiranAction(status: "HADIR" | "IZIN", foto?: string, buktiApp?: string, alasan?: string) {
  const session = await getSession()
  if (!session || session.role !== "KARYAWAN") return { error: "Unauthorized" }

  const today = getTodayJakarta()

  // Cek apakah sudah absen hari ini
  const existing = await prisma.attendance.findUnique({
    where: {
      idKaryawan_tanggal: {
        idKaryawan: session.id,
        tanggal: today
      }
    }
  })

  if (existing) {
    return { error: "Anda sudah melakukan absen hari ini!" }
  }

  await prisma.attendance.create({
    data: {
      idKaryawan: session.id,
      tanggal: today,
      waktuMasuk: getJakartaDate(),
      status,
      foto,
      buktiApp,
      alasan
    }
  })

  revalidatePath("/employee/absensi")
  revalidatePath("/employee/riwayat")

  // Kirim Notifikasi Push
  try {
    await sendNotificationToUser(
      session.id, 
      "Absen Berhasil", 
      `Anda telah berhasil melakukan absen ${status === "HADIR" ? "Hadir" : "Izin"} pada hari ini.`
    )
  } catch (e) {
    console.error("Gagal mengirim notifikasi push absen:", e)
  }

  return { success: true }
}

export async function updateRekeningAction(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== "KARYAWAN") return { error: "Unauthorized" }

  const rekeningBank = formData.get("rekeningBank") as string
  const noRekening = formData.get("noRekening") as string
  const namaRekening = formData.get("namaRekening") as string

  if (!rekeningBank || !noRekening || !namaRekening) return { error: "Lengkapi data rekening!" }

  await prisma.user.update({
    where: { id: session.id },
    data: { rekeningBank, noRekening, namaRekening }
  })

  revalidatePath("/employee/transaksi")
  return { success: true }
}

export async function updateProfileKaryawanAction(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== "KARYAWAN") return { error: "Unauthorized" }

  const nama = formData.get("nama") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const alamat = formData.get("alamat") as string
  const password = formData.get("password") as string

  if (!nama || !password) return { error: "Nama dan Password wajib diisi" }

  await prisma.user.update({
    where: { id: session.id },
    data: {
      nama,
      email: email || null,
      phone: phone || null,
      alamat: alamat || null,
      password,
    }
  })

  revalidatePath("/employee/profil")
  return { success: true }
}

