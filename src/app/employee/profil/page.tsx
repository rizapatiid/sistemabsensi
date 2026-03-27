import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import { redirect } from "next/navigation"
import styles from "@/styles/profil_karyawan.module.css"
import ProfileForm from "./ProfileForm"
import CopyIdButton from "./CopyIdButton"

// Professional Line Icons
const IconUser = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)
const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
)
const IconBriefcase = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
)
const IconId = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M10 10c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/><path d="M14 10h4"/><path d="M14 14h4"/><path d="M6 16c0-1.1.9-2 2-2s2 .9 2 2"/></svg>
)
const IconAlertCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
)
const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
)
const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
)

export default async function EmployeeProfilePage() {
  const session = await getSession()
  if (!session) redirect("/")

  const user = await prisma.user.findUnique({
    where: { id: session.id }
  })

  if (!user) redirect("/")

  return (
    <div className={styles.pageContainer}>
      
      {/* 1. CLEAN HEADER SECTION */}
      <section className={styles.headerSection}>
        <div className={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ color: '#1e3a8a' }}><IconUser /></div>
            <h1>Profil Saya</h1>
          </div>
          <p>Kelola rincian akun dan biografi pribadi Anda dalam satu dasbor terpusat.</p>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* 2. PROFILE SUMMARY CARD */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
             <div style={{ color: '#1e3a8a' }}><IconShield /></div>
             <span className={styles.cardTitle}>Status Karyawan</span>
          </div>
          
          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>ID Karyawan</span>
            <div className={styles.infoValue} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconId />
                <span>{user.id}</span>
              </div>
              <CopyIdButton id={user.id} />
            </div>
          </div>

          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>Jabatan Resmi</span>
            <div className={styles.infoValue}>
              <IconBriefcase />
              {user.jabatan || "-"}
            </div>
          </div>

          <div className={styles.infoGroup}>
            <span className={styles.infoLabel}>Status Kepegawaian</span>
            <div style={{ marginTop: '8px' }}>
              <span className={`${styles.badge} ${user.status === 'AKTIF' ? styles.badgeAktif : styles.badgeNonaktif}`}>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></div>
                 {user.status}
              </span>
            </div>
          </div>

          <div style={{ 
            marginTop: "32px", 
            padding: "20px", 
            background: "#f8fafc", 
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            display: "flex",
            gap: "12px"
          }}>
            <div style={{ color: '#64748b' }}><IconAlertCircle /></div>
            <p style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: "1.6", fontWeight: '500' }}>
              Informasi ID dan Jabatan dikunci oleh sistem untuk keamanan validasi data.
            </p>
          </div>
        </div>

        {/* 3. BIODATA CARD + POPUP TRIGGER */}
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div style={{ color: '#1e3a8a' }}><IconUser /></div>
                <span className={styles.cardTitle}>Data Biodata Personal</span>
            </div>

            <div className={styles.infoBox} style={{ marginBottom: '16px' }}>
                <span className={styles.infoLabel}>NAMA LENGKAP KARYAWAN</span>
                <div className={styles.infoValue}>
                    <IconUser />
                    {user.nama}
                </div>
            </div>

            <div className={styles.formRow} style={{ marginBottom: '16px' }}>
                <div className={styles.infoBox}>
                    <span className={styles.infoLabel}>EMAIL AKTIF</span>
                    <div className={styles.infoValue} style={{ fontSize: '0.9rem' }}>
                        <IconMail />
                        {user.email || "-"}
                    </div>
                </div>
                <div className={styles.infoBox}>
                    <span className={styles.infoLabel}>NO. TELEPON</span>
                    <div className={styles.infoValue} style={{ fontSize: '0.9rem' }}>
                        <IconPhone />
                        {user.phone || "-"}
                    </div>
                </div>
            </div>

            <div className={styles.infoBox}>
                <span className={styles.infoLabel}>ALAMAT DOMISILI SAAT INI</span>
                <div className={styles.infoValue} style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500', lineHeight: '1.6', alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '4px' }}><IconId /></div>
                    {user.alamat || "Belum melengkapi data alamat domisili"}
                </div>
            </div>

            <ProfileForm user={user} />
        </div>
      </div>
    </div>
  )
}
