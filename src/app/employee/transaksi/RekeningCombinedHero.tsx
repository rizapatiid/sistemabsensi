"use client"

import { useState, useTransition, useEffect } from "react"
import { updateRekeningAction } from "@/actions/employeeUser"
import styles from "@/styles/transaksi_karyawan.module.css"
import { useSearchParams } from "next/navigation"

interface RekeningSectionProps {
  initialBank: string
  initialNoRek: string
  initialNamaRek: string
  totalGajiTahunIni: number
}

// Professional SVGs
const IconWallet = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/><path d="M16 12h5"/><circle cx="16" cy="12" r="1"/></svg>
)
const IconBank = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg>
)
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
)
const IconNumber = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="9" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="15"/><line x1="3" y1="10" x2="15" y2="10"/><line x1="9" y1="16" x2="21" y2="16"/></svg>
)
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)
const IconAlertCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
)
const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
)

export default function RekeningCombinedHero({ 
  initialBank, 
  initialNoRek, 
  initialNamaRek,
  totalGajiTahunIni 
}: RekeningSectionProps) {
  const [isPending, startTransition] = useTransition()
  const [showEdit, setShowEdit] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("openValidasi") === "true") {
      setShowEdit(true)
    }
  }, [searchParams])

  async function handleSubmit(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      try {
        const res = await updateRekeningAction(formData)
        if (res?.error) {
          setMessage({ type: "error", text: res.error })
        } else {
          setMessage({ type: "success", text: "Rekening berhasil diperbarui!" })
          setTimeout(() => {
            setShowEdit(false)
            setMessage(null)
          }, 1500)
        }
      } catch (err) {
        setMessage({ type: "error", text: "Terjadi kesalahan sistem." })
      }
    })
  }

  return (
    <section className={styles.headerSection}>
      <div className={styles.headerContent} style={{ flex: 1 }}>
        <div className={styles.headerTitleContainer}>
          <div className={styles.headerIconWrapper}><IconWallet /></div>
          <h1>Transaksi & Payroll</h1>
        </div>
        <p className={styles.headerDescription}>Pantau laporan penghasilan dan kelola data verifikasi rekening payroll Anda.</p>
        
        <div className={styles.lightAccountCard}>
          <div className={styles.accountInfo}>
            <div className={styles.accountIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg>
            </div>
            <div className={styles.accountText}>
              <p className={styles.accountName}>{initialNamaRek || "NAMA BELUM TERDAFTAR"}</p>
              <p className={styles.accountBank}>
                {initialBank ? initialBank : "Belum ada data rekening. Silakan perbarui."}
              </p>
              {initialNoRek && (
                <p className={styles.accountNumber}>
                  {initialNoRek}
                </p>
              )}
            </div>
          </div>
          <button onClick={() => setShowEdit(true)} className={styles.btnUpdateLight}>
            Perbarui
          </button>
        </div>
      </div>

      {showEdit && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)", 
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 9999,
          padding: "20px",
          animation: 'fadeIn 0.2s ease-out'
        }} onClick={() => setShowEdit(false)}>
          <div style={{ 
            width: "100%", maxWidth: "380px", position: "relative", 
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 40px -10px rgba(15,23,42,0.2)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => { setShowEdit(false); setMessage(null); }} 
              style={{ position: "absolute", top: "24px", right: "24px", color: "#64748b", background: "transparent", border: "none", cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <IconClose />
            </button>
            
            <div style={{ padding: '28px 24px 24px' }}>
              {/* Header Area (Like Izin Popup) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '14px', color: '#3b82f6' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                    <line x1="6" y1="15" x2="10" y2="15" />
                    <line x1="14" y1="15" x2="18" y2="15" />
                  </svg>
                </div>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0f172a", margin: 0 }}>Update Rekening</h2>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>Validasi data untuk payroll</p>
                </div>
              </div>

              {/* CRITICAL WARNING BOX */}
              <div style={{ 
                background: '#fef2f2', 
                border: '1px solid #fee2e2', 
                padding: '12px 16px', 
                borderRadius: '12px', 
                marginBottom: '20px',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}>
                <div style={{ color: '#991b1b', marginTop: '2px' }}><IconAlertCircle /></div>
                <div style={{ fontSize: '0.75rem', fontWeight: '500', color: '#991b1b', lineHeight: '1.5', textAlign: 'left' }}>
                  <strong>PERHATIAN:</strong> Kesalahan pengisian adalah tanggung jawab karyawan. Update maksimal tanggal 28.
                </div>
              </div>

              {message && (
                <div style={{ 
                  padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.85rem", textAlign: "center", fontWeight: "600",
                  backgroundColor: message.type === "success" ? "#f0fdf4" : "#fef2f2",
                  color: message.type === "success" ? "#166534" : "#991b1b",
                  border: `1px solid ${message.type === "success" ? "#dcfce7" : "#fee2e2"}`
                }}>
                  {message.text}
                </div>
              )}

              <form action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '8px', letterSpacing: '0.04em' }}>NAMA ENTITAS BANK</label>
                  <input type="text" name="rekeningBank" defaultValue={initialBank} required style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', fontWeight: '600', color: '#0f172a', outline: 'none' }} placeholder="Contoh: Bank Rakyat Indonesia (BRI)" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '8px', letterSpacing: '0.04em' }}>NOMOR REKENING AKTIF</label>
                  <input type="text" name="noRekening" defaultValue={initialNoRek} required style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', outline: 'none', letterSpacing: '0.05em' }} placeholder="Contoh: 0123456789" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '8px', letterSpacing: '0.04em' }}>NAMA LENGKAP PENERIMA</label>
                  <input type="text" name="namaRekening" defaultValue={initialNamaRek} required style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', fontWeight: '600', color: '#0f172a', outline: 'none' }} placeholder="Sesuai buku tabungan" />
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <button type="button" onClick={() => setShowEdit(false)} style={{ flex: 1, padding: '14px', background: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                    Batal
                  </button>
                  <button type="submit" disabled={isPending} style={{ flex: 2, padding: '14px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem', cursor: isPending ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}>
                    {isPending ? "MEMPROSES..." : "Simpan Validasi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
