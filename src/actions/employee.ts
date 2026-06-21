"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { getSession } from "@/actions/auth"
import { sendWhatsAppMessage } from "@/lib/whatsapp"
import { uploadBase64Image } from "@/lib/cloudinary"
import bcrypt from "bcryptjs"

const EmployeeSchema = z.object({
  id: z.string().min(1, "ID Karyawan Wajib diisi"),
  nama: z.string().min(1, "Nama Wajib diisi"),
  jabatan: z.string().min(1, "Jabatan Wajib diisi"),
  phone: z.string().optional(),
  email: z.string().email("Format email salah").optional().or(z.literal("")),
  alamat: z.string().optional(),
  password: z.string().min(5, "Password minimal 5 karakter"),
  fotoProfil: z.string().optional(),
  rekeningBank: z.string().optional(),
  noRekening: z.string().optional(),
  namaRekening: z.string().optional(),
})

export async function createEmployeeAction(formData: FormData) {
  const result = EmployeeSchema.safeParse({
    id: formData.get("id") as string,
    nama: formData.get("nama") as string,
    jabatan: formData.get("jabatan") as string,
    phone: (formData.get("phone") as string) ?? undefined,
    email: (formData.get("email") as string) ?? undefined,
    alamat: (formData.get("alamat") as string) ?? undefined,
    password: formData.get("password") as string,
    fotoProfil: (formData.get("fotoProfil") as string) ?? undefined,
    rekeningBank: (formData.get("rekeningBank") as string) ?? undefined,
    noRekening: (formData.get("noRekening") as string) ?? undefined,
    namaRekening: (formData.get("namaRekening") as string) ?? undefined,
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  let finalId = result.data.id
  if (finalId === "OTOMATIS (SISTEM)" || finalId.trim() === "") {
    finalId = await getNextEmployeeId()
  }

  const exists = await prisma.user.findUnique({ where: { id: finalId } })
  if (exists) {
    return { error: "ID Karyawan sudah terdaftar!" }
  }

  if (result.data.email) {
    const emailExists = await prisma.user.findFirst({ where: { email: result.data.email } })
    if (emailExists) return { error: "Email sudah terdaftar untuk karyawan lain!" }
  }

  if (result.data.phone) {
    const phoneExists = await prisma.user.findFirst({ where: { phone: result.data.phone } })
    if (phoneExists) return { error: "Nomor WhatsApp sudah terdaftar untuk karyawan lain!" }
  }

  let finalFotoProfil = result.data.fotoProfil;
  if (finalFotoProfil && finalFotoProfil.startsWith('data:image')) {
    const uploadedUrl = await uploadBase64Image(finalFotoProfil, 'absensi/profil');
    if (uploadedUrl) {
      finalFotoProfil = uploadedUrl;
    } else {
      return { error: "Gagal mengunggah foto profil ke server" };
    }
  }

  const hashedPassword = await bcrypt.hash(result.data.password, 10)
  
  // Create existing fields using prisma client
  const newEmp = await prisma.user.create({
    data: {
      id: finalId,
      nama: result.data.nama,
      jabatan: result.data.jabatan,
      phone: result.data.phone || null,
      email: result.data.email || null,
      alamat: result.data.alamat || null,
      password: hashedPassword,
      role: "KARYAWAN",
      status: "AKTIF"
    }
  })

  // Update new fields using executeRaw because Prisma Client is locked (EPERM)
  await prisma.$executeRaw`
    UPDATE \`User\` SET 
      \`fotoProfil\` = ${finalFotoProfil || null},
      \`rekeningBank\` = ${result.data.rekeningBank || null},
      \`noRekening\` = ${result.data.noRekening || null},
      \`namaRekening\` = ${result.data.namaRekening || null}
    WHERE \`id\` = ${finalId}
  `

  if (newEmp.phone) {
    try {
      await sendWhatsAppMessage(
        newEmp.phone,
        `Halo *${newEmp.nama}*,\n\nAkun Sistem Pegawai Profesional RMP Digitals Anda telah berhasil didaftarkan oleh Admin.\n\n*Informasi Login Anda:*\n👤 ID Karyawan: *${newEmp.id}*\n🔑 Password: *${result.data.password}*\n\nSilakan login melalui tautan berikut: https://app.rmpid.com\n\nSimpan pesan ini jika Anda lupa password. _(Otomatis dari HRIS RMP Digitals)_`
      )
    } catch (e) {
      console.error("Gagal mengirim WA Info Login", e);
    }
  }

  revalidatePath("/admin/karyawan")
  redirect("/admin/karyawan")
}

export async function getNextEmployeeId() {
  const lastUser = await prisma.user.findFirst({
    where: { id: { startsWith: 'RMP-' } },
    orderBy: { id: 'desc' },
    select: { id: true }
  })
  if (!lastUser) return "RMP-001"
  
  const lastId = lastUser.id // e.g. RMP-005
  const numPart = parseInt(lastId.replace("RMP-", ""))
  if (isNaN(numPart)) return "RMP-001"
  
  const nextNum = numPart + 1
  return `RMP-${nextNum.toString().padStart(3, '0')}`
}

export async function updateEmployeeAction(formData: FormData) {
  const idOriginal = formData.get("idOriginal") as string
  const result = EmployeeSchema.safeParse({
    id: formData.get("id") as string,
    nama: formData.get("nama") as string,
    jabatan: formData.get("jabatan") as string,
    phone: (formData.get("phone") as string) ?? undefined,
    email: (formData.get("email") as string) ?? undefined,
    alamat: (formData.get("alamat") as string) ?? undefined,
    password: (formData.get("password") as string) || "123456", // Temporary fallback to pass validation if empty
    fotoProfil: (formData.get("fotoProfil") as string) ?? undefined,
    rekeningBank: (formData.get("rekeningBank") as string) ?? undefined,
    noRekening: (formData.get("noRekening") as string) ?? undefined,
    namaRekening: (formData.get("namaRekening") as string) ?? undefined,
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  if (result.data.email) {
    const emailExists = await prisma.user.findFirst({ 
      where: { email: result.data.email, NOT: { id: idOriginal } } 
    })
    if (emailExists) return { error: "Email sudah terdaftar untuk karyawan lain!" }
  }

  if (result.data.phone) {
    const phoneExists = await prisma.user.findFirst({ 
      where: { phone: result.data.phone, NOT: { id: idOriginal } } 
    })
    if (phoneExists) return { error: "Nomor WhatsApp sudah terdaftar untuk karyawan lain!" }
  }

  let finalFotoProfil = result.data.fotoProfil;
  if (finalFotoProfil && finalFotoProfil.startsWith('data:image')) {
    const uploadedUrl = await uploadBase64Image(finalFotoProfil, 'absensi/profil');
    if (uploadedUrl) {
      finalFotoProfil = uploadedUrl;
    } else {
      return { error: "Gagal mengunggah foto profil ke server" };
    }
  }

  const updateData: any = {
    id: result.data.id,
    nama: result.data.nama,
    jabatan: result.data.jabatan,
    phone: result.data.phone || null,
    email: result.data.email || null,
    alamat: result.data.alamat || null,
  }
  
  const pw = formData.get("password") as string
  if (pw && pw.trim() !== "") {
      const hashedPassword = await bcrypt.hash(pw, 10)
      updateData.password = hashedPassword
  }

  // Update existing fields using prisma client
  await prisma.user.update({
    where: { id: idOriginal },
    data: updateData
  })

  // Update new fields using executeRaw because Prisma Client is locked (EPERM)
  await prisma.$executeRaw`
    UPDATE \`User\` SET 
      \`fotoProfil\` = ${finalFotoProfil || null},
      \`rekeningBank\` = ${result.data.rekeningBank || null},
      \`noRekening\` = ${result.data.noRekening || null},
      \`namaRekening\` = ${result.data.namaRekening || null}
    WHERE \`id\` = ${result.data.id}
  `

  revalidatePath("/admin/karyawan")
  redirect("/admin/karyawan")
}

export async function deleteEmployeeAction(id: string) {
  await prisma.user.delete({ where: { id } })
  revalidatePath("/admin/karyawan")
}

export async function toggleBlockEmployeeAction(id: string, currentStatus: string) {
  await prisma.user.update({
    where: { id },
    data: { status: currentStatus === "AKTIF" ? "BLOKIR" : "AKTIF" }
  })
  revalidatePath("/admin/karyawan")
}

export async function createAdminAction(formData: FormData) {
  const id = formData.get("id") as string
  const nama = formData.get("nama") as string
  const password = formData.get("password") as string

  if (!id || !nama || !password) return { error: "Semua data wajib diisi" }

  const exists = await prisma.user.findUnique({ where: { id } })
  if (exists) return { error: "ID Admin sudah terdaftar!" }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: { id, nama, password: hashedPassword, role: "ADMIN", status: "AKTIF" }
  })
  revalidatePath("/admin/kelola-admin")
  return { success: true }
}

export async function deleteAdminAction(id: string) {
  await prisma.user.delete({ where: { id } })
  revalidatePath("/admin/kelola-admin")
}

export async function updateProfileAdminAction(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") return { error: "Unauthorized" }

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
      password: hashedPassword 
    }
  })

  revalidatePath("/admin/profil")
  return { success: true }
}

export async function updateAdminAction(formData: FormData) {
  const idOriginal = formData.get("idOriginal") as string
  const id = formData.get("id") as string
  const nama = formData.get("nama") as string
  const password = formData.get("password") as string

  if (!idOriginal || !id || !nama || !password) return { error: "Semua data wajib diisi" }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { id: idOriginal },
    data: { id, nama, password: hashedPassword }
  })
  
  revalidatePath("/admin/kelola-admin")
  return { success: true }
}

export async function toggleAbsensiAccessAction(id: string, currentStatus: boolean) {
  // Gunakan executeRaw karena prisma client belum terupdate (EPERM file lock)
  const newVal = !currentStatus
  await prisma.$executeRaw`
    UPDATE \`User\` SET \`absensiEnabled\` = ${newVal} WHERE id = ${id}
  `
  revalidatePath("/admin/karyawan")
}
