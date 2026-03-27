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
    tunjangan: p.tunjangan,
    totalGaji: p.totalGaji,
    statusPembayaran: p.statusPembayaran,
    user: {
      id: p.user.id,
      nama: p.user.nama,
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
