import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import styles from "@/styles/profil_karyawan.module.css"
import AdminProfileForm from "./AdminProfileForm"
import CopyButton from "@/components/CopyButton"
import CopyIdButton from "@/components/CopyIdButton"
import PushNotificationManager from "@/components/PushNotificationManager"
import EmailNotificationSettings from "@/components/EmailNotificationSettings"
import AvatarEditorAdmin from "./AvatarEditorAdmin"

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

export default async function AdminProfilePage() {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") redirect("/")

  const user = await prisma.user.findUnique({
    where: { id: session.id }
  })

  if (!user) redirect("/")

  return (
    <div className={styles.pageContainer}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* 1. FOTO PROFIL & STATUS CARD */}
        <div className={styles.card} style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Banner */}
          <div style={{ height: '100px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', position: 'relative' }}>
             <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)' }}></div>
             <div style={{ position: 'absolute', top: '20px', left: 'clamp(20px, 5vw, 32px)', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
               <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>PROFIL SAYA</span>
             </div>
          </div>
          
          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 24px 24px 24px', marginTop: '-48px', flex: 1 }}>
            <AvatarEditorAdmin user={{ fotoProfil: user.fotoProfil, nama: user.nama }} />
            
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', textAlign: 'center' }}>{user.nama}</h3>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#2563eb', padding: '6px 12px', borderRadius: '20px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Administrator
              </span>
            </div>

            <div style={{ width: '100%', height: '1px', background: '#e2e8f0', margin: '24px 0 20px 0' }}></div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className={styles.infoBox} style={{ marginBottom: 0, padding: '12px' }}>
                  <span className={styles.infoLabel} style={{ fontSize: '0.7rem' }}>ID Akses</span>
                  <div className={styles.infoValue} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconId />
                    </div>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '800', fontFamily: 'monospace', fontSize: '0.9rem' }}>{user.id}</span>
                    <CopyButton text={user.id} />
                  </div>
                </div>

                <div className={styles.infoBox} style={{ marginBottom: 0, padding: '12px' }}>
                  <span className={styles.infoLabel} style={{ fontSize: '0.7rem' }}>Role Sistem</span>
                  <div className={styles.infoValue} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconShield />
                    </div>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.role}</span>
                  </div>
                </div>
              </div>

              <div className={styles.infoBox} style={{ marginBottom: 0, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={styles.infoLabel} style={{ fontSize: '0.75rem', marginBottom: 0 }}>Status Akun</span>
                <span className={`${styles.badge} ${user.status === 'AKTIF' ? styles.badgeAktif : styles.badgeNonaktif}`} style={{ padding: '4px 10px', fontSize: '0.7rem' }}>
                   <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></div>
                   {user.status}
                </span>
              </div>

              <div style={{ 
                padding: "10px 14px", 
                background: "#fffbeb", 
                borderRadius: "8px",
                border: "1px solid #fef3c7",
                display: "flex",
                gap: "10px"
              }}>
                <div style={{ color: '#d97706', marginTop: '1px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <p style={{ margin: 0, fontSize: "0.7rem", color: "#b45309", lineHeight: "1.4", fontWeight: '600' }}>
                  Informasi ID dan Role dikunci oleh sistem untuk keamanan validasi akses.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BIODATA CARD + POPUP TRIGGER */}
        <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className={styles.cardHeader}>
                <div style={{ color: '#1e3a8a' }}><IconUser /></div>
                <span className={styles.cardTitle}>Biodata Saya</span>
            </div>

            <div className={styles.infoBox}>
                <span className={styles.infoLabel}>NAMA LENGKAP ADMINISTRATOR</span>
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

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ 
                padding: "10px 14px", 
                background: "#eff6ff", 
                borderRadius: "8px",
                border: "1px solid #bfdbfe",
                display: "flex",
                gap: "10px"
              }}>
                <div style={{ color: '#2563eb', marginTop: '1px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </div>
                <p style={{ margin: 0, fontSize: "0.7rem", color: "#1e40af", lineHeight: "1.4", fontWeight: '600' }}>
                  Pastikan data biodata Anda selalu valid dan diperbarui untuk keperluan administrasi.
                </p>
              </div>
              <AdminProfileForm user={user} />
            </div>
        </div>
      </div>
      
      {/* 4. NOTIFICATION SETTINGS SECTION */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingLeft: '4px' }}>
          <div style={{ color: '#1e3a8a' }}><IconSettings /></div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Pengaturan Keamanan & Notifikasi</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <PushNotificationManager />
          <EmailNotificationSettings initialEnabled={user.emailNotifEnabled} />
        </div>
      </div>

      {/* 5. TENTANG APLIKASI SECTION */}
      <div style={{ marginTop: '32px', marginBottom: '16px' }}>
        <Link 
          href="/admin/tentang" 
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
