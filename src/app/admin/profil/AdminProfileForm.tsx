"use client"

import { useState } from "react"
import { updateProfileAdminAction } from "@/actions/employee"
import styles from "@/styles/profil_karyawan.module.css"

// Professional Line Icons
const IconEdit = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
)
const IconUser = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
)
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
)
const IconMapPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
)
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
)
const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
)

export default function AdminProfileForm({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{type: "error"|"success", text: string} | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMsg(null)
    const res = await updateProfileAdminAction(formData)
    if (res?.error) {
      setMsg({ type: "error", text: res.error })
    } else {
      setMsg({ type: "success", text: "Profil Administrator berhasil diperbarui!" })
      setTimeout(() => {
        setMsg(null)
        setIsOpen(false)
      }, 2000)
    }
    setLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={styles.submitBtn}
        style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
      >
        <IconEdit />
        MODIFIKASI DATA PROFIL
      </button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsOpen(false)} className={styles.modalClose}>
              <IconClose />
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalIcon} style={{ color: '#1e3a8a' }}>
                <IconEdit />
              </div>
              <h2 className={styles.modalTitle}>Identitas Administrator</h2>
              <p className={styles.modalSubtitle}>Perbarui informasi identitas dan kredensial sistem Anda.</p>
            </div>

            {msg && (
              <div style={{ 
                padding: "16px", borderRadius: "12px", marginBottom: "24px", fontSize: "0.9rem", textAlign: "center", fontWeight: "700",
                backgroundColor: msg.type === "success" ? "#f0fdf4" : "#fef2f2",
                color: msg.type === "success" ? "#166534" : "#991b1b",
                border: `1px solid ${msg.type === "success" ? "#dcfce7" : "#fee2e2"}`
              }}>
                {msg.text}
              </div>
            )}

            <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div className={styles.formGroup}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ color: '#1e3a8a' }}><IconUser /></div>
                  <label>NAMA LENGKAP ADMINISTRATOR</label>
                </div>
                <input type="text" name="nama" defaultValue={user.nama} required className={styles.input} />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ color: '#94a3b8' }}><IconMail /></div>
                    <label>EMAIL DINAS</label>
                  </div>
                  <input type="email" name="email" defaultValue={user.email || ""} className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ color: '#94a3b8' }}><IconPhone /></div>
                    <label>NOMOR WHATSAPP</label>
                  </div>
                  <input type="text" name="phone" defaultValue={user.phone || ""} className={styles.input} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ color: '#94a3b8' }}><IconMapPin /></div>
                  <label>DOMISILI TERDAFTAR</label>
                </div>
                <textarea name="alamat" defaultValue={user.alamat || ""} rows={3} className={styles.textarea} />
              </div>

              <div className={styles.formGroup} style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ color: '#b45309' }}><IconLock /></div>
                  <label style={{ color: '#b45309' }}>OTORITAS SANDI (SECURITY)</label>
                </div>
                <input type="text" name="password" defaultValue={user.password} required className={styles.input} style={{ background: '#fffbeb', border: '1px dashed #fef08a' }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: '2fr 1fr', gap: "12px" }}>
                <button type="submit" disabled={loading} className={styles.submitBtn}>
                  {loading ? "MEMPROSES..." : "SIMPAN PERUBAHAN"}
                </button>
                <button type="button" onClick={() => setIsOpen(false)} className={styles.btnSecondary}>
                  BATAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
