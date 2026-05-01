"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { sendNotificationToUser, sendNotificationToAllUsers } from "@/actions/push"

// -- KALENDER / HARI LIBUR --
export async function createHolidayAction(formData: FormData) {
  const dateStr = formData.get("tanggal") as string
  const [year, month, day] = dateStr.split('-').map(Number)
  const tanggal = new Date(Date.UTC(year, month - 1, day))
  const keterangan = formData.get("keterangan") as string

  if (isNaN(tanggal.getTime()) || !keterangan) {
    return { error: "Data tidak valid" }
  }

  // Check if holiday already exists for this date
  const existing = await prisma.calendar.findFirst({
    where: { tanggal }
  })

  if (existing) {
    return { error: "Hari libur untuk tanggal tersebut sudah terdaftar!" }
  }

  try {
    await prisma.calendar.create({
      data: {
        tanggal,
        keterangan,
        isHoliday: true,
        image: formData.get("image") as string || null
      }
    })

    revalidatePath("/admin/kalender")
    revalidatePath("/employee/absensi")

    // Kirim Notifikasi Push Libur (Broadcast)
    try {
      await sendNotificationToAllUsers(
        "Hari Libur Baru",
        `${keterangan} pada tanggal ${tanggal.toLocaleDateString("id-ID")}`,
        "/employee/absensi"
      )
    } catch (e) {
      console.error("Gagal broadcast notifikasi libur:", e)
    }
    // redirect inside try-catch with Server Actions can be tricky, 
    // but in Next.js 14/15 it works if it's the last statement.
  } catch (error) {
    console.error("Create Holiday Error:", error)
    return { error: "Gagal menyimpan data hari libur ke database" }
  }

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

  const newAnnouncement = await prisma.announcement.create({
    data: { judul, konten, image: image || null, scheduleDate }
  })

  revalidatePath("/admin/kalender")
  revalidatePath("/employee/home")

  // Kirim Notifikasi Push Pengumuman (Broadcast)
  try {
    await sendNotificationToAllUsers(
      "Pengumuman Baru",
      judul,
      `/employee/home?announcementId=${newAnnouncement.id}`
    )
  } catch (e) {
    console.error("Gagal broadcast notifikasi pengumuman:", e)
  }

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

export async function getUnreadAnnouncementCount(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastSeenAnnouncement: true }
    })

    if (!user) return { success: false, count: 0 }

    const count = await prisma.announcement.count({
      where: {
        tanggal: { gt: user.lastSeenAnnouncement },
        // Also respect scheduleDate if it's in the future
        OR: [
          { scheduleDate: null },
          { scheduleDate: { lte: new Date() } }
        ]
      }
    })
    return { success: true, count }
  } catch (error) {
    return { success: false, count: 0 }
  }
}

export async function markAnnouncementsAsRead(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastSeenAnnouncement: new Date() }
    })
    revalidatePath("/employee/home")
    revalidatePath("/admin/home")
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

// -- PAYROLL --
import { sendPayrollNotificationEmail, sendPaymentConfirmationEmail } from "@/lib/email"

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
    const newPayroll = await prisma.payroll.create({
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

    // Kirim Notifikasi Email Otomatis Jika Email Tersedia
    if (user.email && user.emailNotifEnabled) {
      try {
        await sendPayrollNotificationEmail(user.email, user.nama, bulan, tahun, totalGaji)
      } catch (e) {
        console.error("Notifikasi email gagal dikirim (Generate), sistem tetap lanjut:", e)
      }
    }

    revalidatePath("/admin/payroll")

    // Kirim Notifikasi Push Slip Gaji
    try {
      await sendNotificationToUser(
        idKaryawan,
        "Slip Gaji Tersedia",
        `Slip gaji untuk periode ${bulan}/${tahun} telah diterbitkan.`,
        `/employee/transaksi?payrollId=${newPayroll.id}`
      )
    } catch (e) {
      console.error("Gagal mengirim notifikasi push slip gaji:", e)
    }

    return { success: true }
  } catch (err: any) {
    console.error("Payroll Error:", err)
    return { error: "Gagal menyimpan payroll. " + (err.message || "") }
  }
}

export async function deletePayrollAction(id: string) {
  try {
    await prisma.payroll.delete({ where: { id } })
    revalidatePath("/admin/payroll")
    return { success: true }
  } catch (err) {
    return { error: "Gagal menghapus data slip gaji" }
  }
}

export async function togglePayrollStatusAction(id: string, currentStatus: string) {
  const newStatus = currentStatus === "DIBAYAR" ? "DIPROSES" : "DIBAYAR"

  const payroll = await prisma.payroll.update({
    where: { id },
    data: { statusPembayaran: newStatus },
    include: { user: true }
  })

  // Jika status berubah menjadi DIBAYAR, kirim email konfirmasi
  if (newStatus === "DIBAYAR" && payroll.user.email && payroll.user.emailNotifEnabled) {
    try {
      await sendPaymentConfirmationEmail(
        payroll.user.email,
        payroll.user.nama,
        payroll.bulan,
        payroll.tahun,
        payroll.totalGaji,
        payroll.bankSnapshot || payroll.user.rekeningBank || "-",
        payroll.noRekeningSnapshot || payroll.user.noRekening || "-",
        payroll.namaRekeningSnapshot || payroll.user.namaRekening || "-"
      )
    } catch (emailErr) {
      console.error("Gagal mengirim email konfirmasi, tapi status tetap diupdate:", emailErr)
    }
  }

  revalidatePath("/admin/payroll")

  // Kirim Notifikasi Push Pembayaran
  if (newStatus === "DIBAYAR") {
    try {
      await sendNotificationToUser(
        payroll.idKaryawan,
        "Pembayaran Gaji Berhasil",
        `Gaji periode ${payroll.bulan}/${payroll.tahun} sebesar Rp ${payroll.totalGaji.toLocaleString("id-ID")} telah dikirim.`,
        `/employee/transaksi?payrollId=${payroll.id}`
      )
    } catch (e) {
      console.error("Gagal mengirim notifikasi push pembayaran:", e)
    }
  }
}

export async function getUnreadPayrollCount(userId: string) {
  try {
    const count = await prisma.payroll.count({
      where: {
        idKaryawan: userId,
        isRead: false
      }
    })
    return { success: true, count }
  } catch (error) {
    return { success: false, count: 0 }
  }
}

export async function markPayrollsAsRead(userId: string) {
  try {
    await prisma.payroll.updateMany({
      where: {
        idKaryawan: userId,
        isRead: false
      },
      data: { isRead: true }
    })
    revalidatePath("/employee/transaksi")
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

// -- ABSENSI MANAGEMENT ACTIONS --
// This action handles the secure deletion/rejection of attendance records.
export async function rejectAttendanceAction(id: string) {
  try {
    const att = await prisma.attendance.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!att) return { error: "Data absensi tidak ditemukan" }

    await prisma.attendance.delete({ where: { id } })

    revalidatePath("/admin/absensi")
    revalidatePath("/employee/absensi")
    revalidatePath("/employee/home")

    try {
      await sendNotificationToUser(
        att.idKaryawan,
        "Presensi Ditolak",
        `Presensi Anda pada tanggal ${att.tanggal.toLocaleDateString("id-ID")} ditolak. Silakan lakukan presensi ulang.`,
        "/employee/absensi"
      )
    } catch (e) {
      console.error("Gagal mengirim notifikasi penolakan absensi:", e)
    }

    return { success: true }
  } catch (err) {
    console.error("Reject Attendance Error:", err)
    return { error: "Gagal menolak data absensi" }
  }
}

export async function manualAttendanceAction(formData: FormData) {
  const idKaryawan = formData.get("idKaryawan") as string
  const tanggalStr = formData.get("tanggal") as string
  const waktuStr = formData.get("waktu") as string
  const status = formData.get("status") as string

  if (!idKaryawan || !tanggalStr || !waktuStr || !status) {
    return { error: "Semua data harus diisi" }
  }

  const tanggal = new Date(tanggalStr)
  tanggal.setHours(0, 0, 0, 0)

  const [hours, minutes] = waktuStr.split(':').map(Number)
  const waktuMasuk = new Date(tanggal)
  waktuMasuk.setHours(hours, minutes, 0, 0)

  // Check if already exists
  const existing = await prisma.attendance.findUnique({
    where: { idKaryawan_tanggal: { idKaryawan, tanggal } }
  })

  if (existing) {
    return { error: "Karyawan sudah memiliki rekaman absensi pada tanggal tersebut." }
  }

  try {
    await prisma.attendance.create({
      data: {
        idKaryawan,
        tanggal,
        waktuMasuk,
        status,
        alasan: status === "IZIN" ? "Input Manual oleh Admin" : null
      }
    })

    revalidatePath("/admin/absensi")
    revalidatePath("/employee/absensi")
    revalidatePath("/employee/home")

    return { success: true }
  } catch (error) {
    console.error("Manual Attendance Error:", error)
    return { error: "Gagal menyimpan absensi manual" }
  }
}
