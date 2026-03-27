import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🔍 Mengecek data di Supabase Cloud...")
  try {
    const users = await prisma.user.findMany()
    console.log(`✅ Ditemukan ${users.length} user:`)
    users.forEach(u => {
      console.log(`- ID: ${u.id}, Nama: ${u.nama}, Role: ${u.role}`)
    })
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat pemeriksaan:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
