"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getSession } from "@/actions/auth"
import { getTodayJakarta, getJakartaDate } from "@/lib/date"
import { sendNotificationToUser } from "@/actions/push"
import { uploadBase64Image } from "@/lib/cloudinary"
import bcrypt from "bcryptjs"

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

  const fotoUrl = foto ? await uploadBase64Image(foto, 'absensi/foto') : null;
  const buktiAppUrl = buktiApp ? await uploadBase64Image(buktiApp, 'absensi/bukti') : null;

  await prisma.attendance.create({
    data: {
      idKaryawan: session.id,
      tanggal: today,
      waktuMasuk: getJakartaDate(),
      status,
      foto: fotoUrl || null,
      buktiApp: buktiAppUrl || null,
      alasan
    }
  })

  revalidatePath("/employee/riwayat")
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
  revalidatePath("/employee/home")
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

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { id: session.id },
    data: {
      nama,
      email: email || null,
      phone: phone || null,
      alamat: alamat || null,
      password: hashedPassword,
    }
  })

  revalidatePath("/employee/profil")
  return { success: true }
}

export async function updateAvatarKaryawanAction(base64Image: string) {
  const session = await getSession()
  if (!session || session.role !== "KARYAWAN") return { error: "Unauthorized" }

  try {
    const fotoUrl = await uploadBase64Image(base64Image, 'absensi/profil');
    await prisma.user.update({
      where: { id: session.id },
      data: { fotoProfil: fotoUrl }
    })
    revalidatePath("/employee/profil")
    return { success: true }
  } catch (error) {
    console.error("Gagal update avatar:", error)
    return { error: "Terjadi kesalahan saat mengunggah foto profil." }
  }
}
