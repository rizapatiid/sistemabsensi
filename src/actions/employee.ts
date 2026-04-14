"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { getSession } from "@/actions/auth"

const EmployeeSchema = z.object({
  id: z.string().min(1, "ID Karyawan Wajib diisi"),
  nama: z.string().min(1, "Nama Wajib diisi"),
  jabatan: z.string().min(1, "Jabatan Wajib diisi"),
  phone: z.string().optional(),
  email: z.string().email("Format email salah").optional().or(z.literal("")),
  alamat: z.string().optional(),
  password: z.string().min(5, "Password minimal 5 karakter")
})

export async function createEmployeeAction(formData: FormData) {
  const result = EmployeeSchema.safeParse({
    id: formData.get("id"),
    nama: formData.get("nama"),
    jabatan: formData.get("jabatan"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    alamat: formData.get("alamat"),
    password: formData.get("password")
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const exists = await prisma.user.findUnique({ where: { id: result.data.id } })
  if (exists) {
    return { error: "ID Karyawan sudah terdaftar!" }
  }

  await prisma.user.create({
    data: {
      id: result.data.id,
      nama: result.data.nama,
      jabatan: result.data.jabatan,
      phone: result.data.phone || null,
      email: result.data.email || null,
      alamat: result.data.alamat || null,
      password: result.data.password,
      role: "KARYAWAN",
      status: "AKTIF"
    }
  })

  revalidatePath("/admin/karyawan")
  redirect("/admin/karyawan")
}

export async function updateEmployeeAction(formData: FormData) {
  const idOriginal = formData.get("idOriginal") as string
  const result = EmployeeSchema.safeParse({
    id: formData.get("id"),
    nama: formData.get("nama"),
    jabatan: formData.get("jabatan"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    alamat: formData.get("alamat"),
    password: formData.get("password")
  })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  await prisma.user.update({
    where: { id: idOriginal },
    data: {
      id: result.data.id,
      nama: result.data.nama,
      jabatan: result.data.jabatan,
      phone: result.data.phone || null,
      email: result.data.email || null,
      alamat: result.data.alamat || null,
      password: result.data.password,
    }
  })

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

  await prisma.user.create({
    data: { id, nama, password, role: "ADMIN", status: "AKTIF" }
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

  await prisma.user.update({
    where: { id: session.id },
    data: { 
      nama, 
      email: email || null, 
      phone: phone || null, 
      alamat: alamat || null, 
      password 
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

  await prisma.user.update({
    where: { id: idOriginal },
    data: { id, nama, password }
  })
  
  revalidatePath("/admin/kelola-admin")
  return { success: true }
}

export async function toggleAbsensiAccessAction(id: string, currentStatus: boolean) {
  // Gunakan executeRaw karena prisma client belum terupdate (EPERM file lock)
  const newVal = !currentStatus
  await prisma.$executeRaw`
    UPDATE "User" SET "absensiEnabled" = ${newVal} WHERE id = ${id}
  `
  revalidatePath("/admin/karyawan")
}
