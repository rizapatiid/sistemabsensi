import prisma from "@/lib/prisma"
import styles from "@/styles/admin.module.css"
import Link from "next/link"
import KaryawanTableClient from "./KaryawanTableClient"

const IconPlus = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
)

const IconUsers = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1e3a8a' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
)

const IconUserCheck = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
)

const IconUserX = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>
)

export default async function AdminKaryawanPage() {
  const karyawan = await prisma.user.findMany({
    where: { role: "KARYAWAN" },
    orderBy: { createdAt: "desc" }
  })

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
    rekeningBank: k.rekeningBank,
    noRekening: k.noRekening,
    status: k.status
  }))

  return (
    <div className={styles.pageContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginBottom: '8px' }}>
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IconUsers />
                <h1 className={styles.pageTitle} style={{ fontSize: '2rem' }}>Kelola Karyawan</h1>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: '500', marginTop: '8px' }}>
                Manajemen data personil dan kontrol akses staf perusahaan.
            </p>
            
            <div style={{ marginTop: '24px' }}>
                <Link 
                  href="/admin/karyawan/tambah" 
                  className={styles.btnAction}
                  style={{ padding: '12px 24px', borderRadius: '14px' }}
                >
                  <IconPlus />
                  Tambah Karyawan
                </Link>
            </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
            <div className={styles.statPill} style={{ borderColor: '#dcfce7' }}>
                <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}><IconUserCheck /></div>
                <div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a' }}>{countAktif}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Aktif</div>
                </div>
            </div>
            
            <div className={styles.statPill} style={{ borderColor: '#fee2e2' }}>
                <div className={styles.statIcon} style={{ background: '#fee2e2', color: '#dc2626' }}><IconUserX /></div>
                <div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a' }}>{countBlokir}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Terblokir</div>
                </div>
            </div>
        </div>
      </div>

      <div className={styles.card}>
        <KaryawanTableClient karyawanInitial={formattedKaryawan} />
      </div>
    </div>
  )
}
