import { PrismaClient } from '@prisma/client'

/**
 * Bangun DATABASE_URL dari komponen terpisah jika DB_PASSWORD tersedia.
 * Ini menghindari masalah URL-encoding karakter khusus (#, @, %) di password
 * yang sering bermasalah ketika disimpan di panel env hosting.
 */
const getDatabaseUrl = (): string => {
  if (process.env.DB_PASSWORD) {
    const host = process.env.DB_HOST || '127.0.0.1'
    const port = process.env.DB_PORT || '3306'
    const user = process.env.DB_USER || 'u500072377_admin'
    const password = encodeURIComponent(process.env.DB_PASSWORD)
    const database = process.env.DB_NAME || 'u500072377_absensirmp'
    const url = `mysql://${user}:${password}@${host}:${port}/${database}`
    console.log('[Prisma] Using DB_PASSWORD env var to construct DATABASE_URL')
    return url
  }
  return process.env.DATABASE_URL || ''
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
