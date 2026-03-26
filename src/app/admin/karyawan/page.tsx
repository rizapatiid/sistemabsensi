import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import Link from "next/link"
import KaryawanTableClient from "./KaryawanTableClient"

export default async function AdminKaryawanPage() {
  const karyawan = await prisma.user.findMany({
    where: { role: "KARYAWAN" },
    orderBy: { createdAt: "desc" }
  })

  // Format data untuk client component
  const formattedKaryawan = karyawan.map(k => ({
    id: k.id,
    nama: k.nama,
    jabatan: k.jabatan,
    phone: k.phone,
    email: k.email,
    rekeningBank: k.rekeningBank,
    noRekening: k.noRekening,
    status: k.status
  }))

  return (
    <div className={styles.pageContainer}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className={styles.pageTitle}>Kelola Karyawan</h1>
        <Link 
          href="/admin/karyawan/tambah" 
          className={styles.actionBtn} 
          style={{ textDecoration: "none", display: "inline-block" }}
        >
          + Tambah Karyawan Baru
        </Link>
      </div>

      <div className={`${styles.section} glass`}>
        <h2>Daftar Seluruh Karyawan</h2>
        <KaryawanTableClient karyawanInitial={formattedKaryawan} />
      </div>
    </div>
  )
}
