import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import styles from "@/styles/profil_karyawan.module.css"
import ProfileForm from "./ProfileForm"
import CopyIdButton from "@/components/CopyIdButton"
import PushNotificationManager from "@/components/PushNotificationManager"
import EmailNotificationSettings from "@/components/EmailNotificationSettings"

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
const IconSettings = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
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
      
      {/* Premium Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: 'clamp(12px, 3vw, 16px)',
        padding: 'clamp(20px, 5vw, 32px)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)',
        marginBottom: '4px'
      }}>
        {/* Geometric Accents */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 'clamp(12px, 3vw, 20px)', alignItems: 'center' }}>
          <div style={{ 
            width: 'clamp(56px, 12vw, 64px)', height: 'clamp(56px, 12vw, 64px)', 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: 'clamp(14px, 3vw, 20px)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            flexShrink: 0
          }}>
            <svg width="clamp(24px, 6vw, 32px)" height="clamp(24px, 6vw, 32px)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#60a5fa' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 'clamp(1.4rem, 4.5vw, 1.75rem)', fontWeight: 900, margin: '0 0 clamp(4px, 1vw, 6px) 0', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Profil Saya</h1>
            <p style={{ margin: 0, color: '#93c5fd', fontSize: 'clamp(0.8rem, 2.5vw, 0.95rem)', fontWeight: 500, lineHeight: 1.4 }}>Kelola rincian akun dan biografi pribadi Anda.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* 2. PROFILE SUMMARY CARD */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
             <div style={{ color: '#1e3a8a' }}><IconShield /></div>
             <span className={styles.cardTitle}>Status Karyawan</span>
          </div>
          
          <div className={styles.infoBox}>
            <span className={styles.infoLabel}>ID Karyawan</span>
            <div className={styles.infoValue} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconId />
                </div>
                <span>{user.id}</span>
              </div>
              <CopyIdButton id={user.id} />
            </div>
          </div>

          <div className={styles.infoBox}>
            <span className={styles.infoLabel}>Jabatan Resmi</span>
            <div className={styles.infoValue}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconBriefcase />
              </div>
              {user.jabatan || "-"}
            </div>
          </div>

          <div className={styles.infoBox}>
            <span className={styles.infoLabel}>Status Kepegawaian</span>
            <div style={{ marginTop: '8px' }}>
              <span className={`${styles.badge} ${user.status === 'AKTIF' ? styles.badgeAktif : styles.badgeNonaktif}`}>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></div>
                 {user.status}
              </span>
            </div>
          </div>

          <div style={{ 
            padding: "10px 14px", 
            background: "#fffbeb", 
            borderRadius: "10px",
            border: "1px solid #fef3c7",
            display: "flex",
            gap: "10px",
            marginBottom: "10px"
          }}>
            <div style={{ color: '#d97706', marginTop: '1px' }}><IconAlertCircle /></div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#b45309", lineHeight: "1.5", fontWeight: '500' }}>
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

            <div className={styles.infoBox}>
                <span className={styles.infoLabel}>NAMA LENGKAP KARYAWAN</span>
                <div className={styles.infoValue}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <IconUser />
                    </div>
                    {user.nama}
                </div>
            </div>

            <div className={styles.formRow} style={{ marginBottom: '10px' }}>
                <div className={styles.infoBox} style={{ marginBottom: 0 }}>
                    <span className={styles.infoLabel}>EMAIL AKTIF</span>
                    <div className={styles.infoValue} style={{ fontSize: '0.85rem' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <IconMail />
                        </div>
                        {user.email || "-"}
                    </div>
                </div>
                <div className={styles.infoBox} style={{ marginBottom: 0 }}>
                    <span className={styles.infoLabel}>NOMOR TELEPON</span>
                    <div className={styles.infoValue} style={{ fontSize: '0.85rem' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <IconPhone />
                        </div>
                        {user.phone || "-"}
                    </div>
                </div>
            </div>

            <div className={styles.infoBox}>
                <span className={styles.infoLabel}>ALAMAT DOMISILI SAAT INI</span>
                <div className={styles.infoValue} style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500', lineHeight: '1.5', alignItems: 'flex-start' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        <IconId />
                    </div>
                    {user.alamat || "Belum melengkapi data alamat domisili"}
                </div>
            </div>

            <ProfileForm user={user} />
        </div>
      </div>
      
      {/* 4. NOTIFICATION SETTINGS SECTION */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingLeft: '4px' }}>
          <div style={{ color: '#1e3a8a' }}><IconSettings /></div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Pengaturan Notifikasi</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <PushNotificationManager />
          <EmailNotificationSettings initialEnabled={user.emailNotifEnabled} />
        </div>
      </div>

      {/* 5. TENTANG APLIKASI SECTION */}
      <div style={{ marginTop: '32px', marginBottom: '16px' }}>
        <Link 
          href="/employee/tentang" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: '#ffffff', 
            padding: '20px 24px', 
            borderRadius: '16px', 
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02)',
            textDecoration: 'none',
            color: '#0f172a',
            transition: 'all 0.2s ease'
          }}
          className={styles.tentangHover}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Tentang Aplikasi</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Informasi sistem, privasi, dan bantuan teknis</p>
            </div>
          </div>
          <div style={{ color: '#94a3b8' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .${styles.tentangHover}:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05) !important;
          border-color: #e2e8f0 !important;
        }
      `}} />
    </div>
  )
}
