import { PrismaClient } from '@prisma/client'

/**
 * Bangun DATABASE_URL dari komponen terpisah jika DB_PASSWORD tersedia.
 * Ini menghindari masalah URL-encoding karakter khusus (#, @, %) di password
 * yang sering bermasalah ketika disimpan di panel env hosting.
 * 
 * connection_limit=3 → Hostinger shared MySQL punya batas koneksi.
 * Default Prisma bisa buka 10 koneksi → bisa kena limit!
 * socket_timeout=20 → koneksi tidak menggantung selamanya
 */
const getDatabaseUrl = (): string => {
  // Parameter untuk batasi koneksi di hosting shared (PENTING untuk Hostinger!)
  const params = '?connection_limit=3&socket_timeout=20'

  if (process.env.DB_PASSWORD) {
    const host = process.env.DB_HOST || '127.0.0.1'
    const port = process.env.DB_PORT || '3306'
    const user = process.env.DB_USER || 'u500072377_admin'
    const password = encodeURIComponent(process.env.DB_PASSWORD)
    const database = process.env.DB_NAME || 'u500072377_absensirmp'
    return `mysql://${user}:${password}@${host}:${port}/${database}${params}`
  }

  const baseUrl = process.env.DATABASE_URL || ''
  // Tambah params jika belum ada
  if (baseUrl && !baseUrl.includes('connection_limit')) {
    return baseUrl + params
  }
  return baseUrl
}


const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl()
      }
    }
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
