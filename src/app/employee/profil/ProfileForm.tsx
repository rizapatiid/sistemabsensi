"use client"

import { useState } from "react"
import { updateProfileKaryawanAction } from "@/actions/employeeUser"
import styles from "@/styles/profil_karyawan.module.css"

// Professional Line Icons
const IconUpdate = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
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
const IconKey = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zM12 12l.4 1 1 .4 1 1 .4 1 1 .4 1 1 .4 1L19 19l2 2"/></svg>
)
const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
)

export default function ProfileForm({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{type: "error"|"success", text: string} | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMsg(null)
    const res = await updateProfileKaryawanAction(formData)
    if (res?.error) {
      setMsg({ type: "error", text: res.error })
    } else {
      setMsg({ type: "success", text: "Profil Anda berhasil diperbarui!" })
      setTimeout(() => {
        setMsg(null)
        setIsOpen(false)
      }, 2000)
    }
    setLoading(false)
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button 
          onClick={() => setIsOpen(true)}
          className={styles.submitBtn}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: 0 }}
        >
          <IconUpdate />
          PERBARUI
        </button>
      </div>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '14px', color: '#3b82f6' }}>
                <IconUpdate />
              </div>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0f172a", margin: 0 }}>Informasi Personal</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>Pastikan data biodata Anda sesuai dengan dokumen valid.</p>
              </div>
            </div>

            {msg && (
              <div style={{ 
                padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.85rem", textAlign: "center", fontWeight: "600",
                backgroundColor: msg.type === "success" ? "#f0fdf4" : "#fef2f2",
                color: msg.type === "success" ? "#166534" : "#991b1b",
                border: `1px solid ${msg.type === "success" ? "#dcfce7" : "#fee2e2"}`
              }}>
                {msg.text}
              </div>
            )}

            <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '8px', letterSpacing: '0.04em' }}>
                  <div style={{ color: '#94a3b8', display: 'flex', transform: 'scale(0.85)', transformOrigin: 'left center' }}><IconUser /></div>
                  NAMA LENGKAP KARYAWAN
                </label>
                <input type="text" name="nama" defaultValue={user.nama} required style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', fontWeight: '600', color: '#0f172a', outline: 'none' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '8px', letterSpacing: '0.04em' }}>
                    <div style={{ color: '#94a3b8', display: 'flex', transform: 'scale(0.85)', transformOrigin: 'left center' }}><IconMail /></div>
                    EMAIL AKTIF
                  </label>
                  <input type="email" name="email" defaultValue={user.email || ""} style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', fontWeight: '600', color: '#0f172a', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '8px', letterSpacing: '0.04em' }}>
                    <div style={{ color: '#94a3b8', display: 'flex', transform: 'scale(0.85)', transformOrigin: 'left center' }}><IconPhone /></div>
                    NOMOR TELEPON
                  </label>
                  <input type="text" name="phone" defaultValue={user.phone || ""} style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', fontWeight: '600', color: '#0f172a', outline: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '8px', letterSpacing: '0.04em' }}>
                  <div style={{ color: '#94a3b8', display: 'flex', transform: 'scale(0.85)', transformOrigin: 'left center' }}><IconMapPin /></div>
                  ALAMAT DOMISILI SAAT INI
                </label>
                <textarea name="alamat" defaultValue={user.alamat || ""} rows={3} style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', fontWeight: '600', color: '#0f172a', outline: 'none', resize: 'vertical' }} />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '8px', letterSpacing: '0.04em' }}>
                  <div style={{ color: '#1e3a8a', display: 'flex', transform: 'scale(0.85)', transformOrigin: 'left center' }}><IconKey /></div>
                  UBAH KATA SANDI (SECURITY)
                </label>
                <input type="text" name="password" placeholder="Kosongkan jika tidak ingin mengubah sandi" style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px dashed #cbd5e1', background: '#f1f5f9', fontSize: '0.95rem', fontWeight: '600', color: '#0f172a', outline: 'none' }} />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <button type="button" onClick={() => setIsOpen(false)} style={{ flex: 1, padding: '14px', background: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                  Batal
                </button>
                <button type="submit" disabled={loading} style={{ flex: 2, padding: '14px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}>
                  {loading ? "MEMPROSES..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
