"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

// -- KALENDER / HARI LIBUR --
export async function createHolidayAction(formData: FormData) {
  const tanggal = new Date(formData.get("tanggal") as string)
  tanggal.setHours(0, 0, 0, 0)
  const keterangan = formData.get("keterangan") as string

  if (isNaN(tanggal.getTime()) || !keterangan) {
    return { error: "Data tidak valid" }
  }

  await prisma.calendar.create({
    data: {
      tanggal,
      keterangan,
      isHoliday: true
    }
  })

  revalidatePath("/admin/kalender")
  revalidatePath("/employee/absensi")
  redirect("/admin/kalender")
}

export async function deleteHolidayAction(id: string) {
  await prisma.calendar.delete({ where: { id } })
  revalidatePath("/admin/kalender")
  revalidatePath("/employee/absensi")
}

// -- PENGUMUMAN --
export async function createAnnouncementAction(formData: FormData) {
  const judul = formData.get("judul") as string
  const konten = formData.get("konten") as string
  const image = formData.get("image") as string 
  const scheduleStr = formData.get("scheduleDate") as string
  const scheduleDate = scheduleStr ? new Date(scheduleStr) : null

  if (!judul || !konten) return { error: "Data tidak lengkap" }

  await prisma.announcement.create({
    data: { judul, konten, image: image || null, scheduleDate }
  })
  
  revalidatePath("/admin/kalender")
  revalidatePath("/employee/home")
  return { success: true }
}

export async function updateAnnouncementAction(formData: FormData) {
  const id = formData.get("id") as string
  const judul = formData.get("judul") as string
  const konten = formData.get("konten") as string
  const image = formData.get("image") as string
  const scheduleStr = formData.get("scheduleDate") as string
  const scheduleDate = scheduleStr ? new Date(scheduleStr) : null

  if (!id || !judul || !konten) return { error: "Data tidak lengkap" }

  await prisma.announcement.update({
    where: { id },
    data: { judul, konten, image: image || null, scheduleDate }
  })

  revalidatePath("/admin/kalender")
  revalidatePath("/employee/home")
  return { success: true }
}

export async function deleteAnnouncementAction(id: string) {
  await prisma.announcement.delete({ where: { id } })
  revalidatePath("/admin/kalender")
}

// -- PAYROLL --
export async function generatePayrollAction(formData: FormData) {
  const idKaryawan = formData.get("idKaryawan") as string
  const bulan = parseInt(formData.get("bulan") as string)
  const tahun = parseInt(formData.get("tahun") as string)
  const gajiPokok = parseFloat(formData.get("gajiPokok") as string)
  
  const tipeGaji = formData.get("tipeGaji") as string || "BULANAN"
  const tunjangan = parseFloat(formData.get("tunjangan") as string) || 0
  const ketTunjangan = formData.get("ketTunjangan") as string || ""
  const modeAbsen = formData.get("modeAbsen") as string || "AUTO"
  let jumlahAbsen = parseInt(formData.get("jumlahAbsen") as string) || 0

  if (!idKaryawan || isNaN(bulan) || isNaN(tahun) || isNaN(gajiPokok)) return { error: "Data tidak valid" }

  const exists = await prisma.payroll.findUnique({
    where: {
      idKaryawan_bulan_tahun: { idKaryawan, bulan, tahun }
    }
  })

  if (exists) {
    return { error: "Payroll untuk karyawan ini pada bulan tersebut sudah dibuat!" }
  }

  const user = await prisma.user.findUnique({ where: { id: idKaryawan } })
  if (!user) return { error: "Karyawan tidak ditemukan" }

  if (tipeGaji === "HARIAN" && modeAbsen === "AUTO") {
    const startDate = new Date(tahun, bulan - 1, 1)
    const endDate = new Date(tahun, bulan, 0)
    const count = await prisma.attendance.count({
      where: {
        idKaryawan,
        status: "HADIR",
        tanggal: { gte: startDate, lte: endDate }
      }
    })
    jumlahAbsen = count
  }

  const totalGaji = tipeGaji === "HARIAN" 
    ? (gajiPokok * jumlahAbsen) + tunjangan
    : gajiPokok + tunjangan;

  try {
    await prisma.payroll.create({
      data: { 
        idKaryawan, 
        bulan, 
        tahun, 
        gajiPokok, 
        tipeGaji,
        jumlahAbsen,
        tunjangan,
        keteranganTunjangan: ketTunjangan,
        totalGaji, 
        statusPembayaran: "BELUM_LUNAS",
        bankSnapshot: user.rekeningBank,
        noRekeningSnapshot: user.noRekening,
        namaRekeningSnapshot: user.namaRekening
      }
    })
    
    revalidatePath("/admin/payroll")
    return { success: true }
  } catch (err: any) {
    console.error("Payroll Error:", err)
    return { error: "Gagal menyimpan payroll. " + (err.message || "") }
  }
}

export async function togglePayrollStatusAction(id: string, currentStatus: string) {
  await prisma.payroll.update({
    where: { id },
    data: { statusPembayaran: currentStatus === "LUNAS" ? "BELUM_LUNAS" : "LUNAS" }
  })
  revalidatePath("/admin/payroll")
}
