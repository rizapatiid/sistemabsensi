import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const adminId = "admin"
  const adminNama = "MASTER ADMINISTRATOR"
  const adminPassword = "absensirmp123" // Menggunakan sandi yang sama dengan Supabase agar mudah diingat

  console.log("🚀 Memulai inisialisasi akun ADMIN pertama...")

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { id: adminId }
    })

    if (existingAdmin) {
      console.log("⚠️ Akun admin sudah tersedia. Inisialisasi dibatalkan.")
      return
    }

    const admin = await prisma.user.create({
      data: {
        id: adminId,
        nama: adminNama,
        password: adminPassword,
        role: "ADMIN",
        status: "AKTIF",
        jabatan: "Sistem Eksekutif"
      }
    })

    console.log("✨ Akun ADMIN berhasil didaftarkan di Supabase!")
    console.log("-----------------------------------------")
    console.log(`ID Login  : ${admin.id}`)
    console.log(`Password  : ${adminPassword}`)
    console.log("-----------------------------------------")
    console.log("Silakan login ke aplikasi RMP Digital sekarang.")

  } catch (error) {
    console.error("❌ Terjadi kesalahan saat registrasi admin:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
