import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import PayrollAdminClient from "./PayrollAdminClient"

export default async function AdminPayrollPage() {
  const users = await prisma.user.findMany({ 
    where: { role: "KARYAWAN" },
    select: {
      id: true,
      nama: true,
      rekeningBank: true,
      noRekening: true,
      namaRekening: true
    }
  })
  
  const payrolls = await prisma.payroll.findMany({ 
    include: { user: true },
    orderBy: [{ tahun: "desc" }, { bulan: "desc" }] 
  })

  // Format payroll data for client
  const formattedPayrolls = payrolls.map(p => ({
    id: p.id,
    bulan: p.bulan,
    tahun: p.tahun,
    idKaryawan: p.idKaryawan,
    tipeGaji: p.tipeGaji,
    jumlahAbsen: p.jumlahAbsen,
    gajiPokok: p.gajiPokok,
    tunjangan: p.tunjangan,
    keteranganTunjangan: p.keteranganTunjangan,
    totalGaji: p.totalGaji,
    statusPembayaran: p.statusPembayaran,
    bankSnapshot: p.bankSnapshot,
    noRekeningSnapshot: p.noRekeningSnapshot,
    namaRekeningSnapshot: p.namaRekeningSnapshot,
    createdAt: p.createdAt.toISOString(),
    user: {
      id: p.user.id,
      nama: p.user.nama,
      jabatan: p.user.jabatan,
      rekeningBank: p.user.rekeningBank,
      noRekening: p.user.noRekening,
      namaRekening: p.user.namaRekening
    }
  }))

  return (
    <div className={styles.pageContainer}>
      <PayrollAdminClient payrolls={formattedPayrolls} users={users} />
    </div>
  )
}
