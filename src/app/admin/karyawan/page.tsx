import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import Link from "next/link"
import KaryawanTableClient from "./KaryawanTableClient"

const IconPlus = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
)

const IconUserCheck = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
)

const IconUserX = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>
)

export default async function AdminKaryawanPage() {
  // Gunakan queryRaw karena prisma generate gagal akibat file lock di Windows (EPERM)
  const karyawan = await prisma.$queryRaw<any[]>`
    SELECT * FROM \`User\` WHERE role = 'KARYAWAN' ORDER BY \`createdAt\` DESC
  `

  const countTotal = karyawan.length
  const countAktif = karyawan.filter(k => k.status === 'AKTIF').length
  const countBlokir = karyawan.filter(k => k.status !== 'AKTIF').length

  // Format data untuk client component
  const formattedKaryawan = karyawan.map(k => ({
    id: k.id,
    nama: k.nama,
    jabatan: k.jabatan,
    phone: k.phone,
    email: k.email,
    alamat: k.alamat,
    fotoProfil: k.fotoProfil || null,
    rekeningBank: k.rekeningBank,
    noRekening: k.noRekening,
    namaRekening: k.namaRekening,
    status: k.status,
    absensiEnabled: k.absensiEnabled ?? true,
    createdAt: k.createdAt ? new Date(k.createdAt).toISOString() : new Date().toISOString()
  }))

  return (
    <div className={styles.pageContainer} style={{ padding: '16px 0', gap: '12px' }}>
      <KaryawanTableClient karyawanInitial={formattedKaryawan} />
    </div>
  )
}
