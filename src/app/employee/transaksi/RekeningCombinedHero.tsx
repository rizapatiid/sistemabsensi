"use client"

import { useState, useTransition } from "react"
import { updateRekeningAction } from "@/actions/employeeUser"
import styles from "@/styles/transaksi_karyawan.module.css"

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <div style={{ color: '#1e3a8a' }}><IconWallet /></div>
          <h1>Transaksi & Payroll</h1>
        </div>
        <p>Pantau laporan penghasilan dan kelola data verifikasi rekening payroll Anda.</p>
        
        <div className={styles.bankDetails}>
          <div className={styles.bankItem}>
            <span className={styles.bankLabel}>BANK ENTITY</span>
            <div className={styles.bankValue} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconBank />
              {initialBank || "-"}
            </div>
          </div>
          <div className={styles.bankItem}>
            <span className={styles.bankLabel}>ACCOUNT NUMBER</span>
            <div className={styles.bankValue} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconNumber />
              {initialNoRek ? initialNoRek.replace(/(\d{4})/g, '$1 ') : "-"}
            </div>
          </div>
          <div className={styles.bankItem}>
            <span className={styles.bankLabel}>BENEFICIARY NAME</span>
            <div className={styles.bankValue} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconUser />
              {initialNamaRek || "-"}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
            <button onClick={() => setShowEdit(true)} className={styles.btnSecondary} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}>
              <IconEdit />
              PERBARUI DATA
            </button>
          </div>
        </div>
      </div>

      {showEdit && (
        <div className={styles.modalOverlay} onClick={() => setShowEdit(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowEdit(false)} 
              style={{ position: 'absolute', top: '24px', right: '24px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <IconClose />
            </button>

            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ display: 'inline-flex', padding: '16px', background: '#f8fafc', borderRadius: '16px', color: '#1e3a8a', marginBottom: '16px' }}>
                <IconBank />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: "#0f172a", letterSpacing: '-0.03em' }}>Update Validasi Rekening</h2>
              <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: "0.85rem", fontWeight: '500' }}>Pastikan data valid untuk kelancaran distribusi payroll.</p>
            </div>

            {/* CRITICAL WARNING BOX */}
            <div style={{ 
              background: '#fef2f2', 
              border: '1px solid #fee2e2', 
              padding: '16px', 
              borderRadius: '12px', 
              marginBottom: '24px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <div style={{ color: '#991b1b', marginTop: '2px' }}><IconAlertCircle /></div>
              <div style={{ fontSize: '0.75rem', fontWeight: '500', color: '#991b1b', lineHeight: '1.5', textAlign: 'justify' }}>
                PERHATIAN: Pastikan data benar. Kesalahan pengisian adalah tanggung jawab penuh karyawan. 
                Mohon update paling lambat tanggal 28 setiap bulannya.
              </div>
            </div>

            {message && (
              <div style={{ 
                padding: "12px", borderRadius: "10px", marginBottom: "20px", fontSize: "0.85rem", textAlign: "center", fontWeight: "700",
                backgroundColor: message.type === "success" ? "#f0fdf4" : "#fef2f2",
                color: message.type === "success" ? "#166534" : "#991b1b",
                border: `1px solid ${message.type === "success" ? "#dcfce7" : "#fee2e2"}`
              }}>
                {message.text}
              </div>
            )}

            <form action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className={styles.inputGroup}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ color: '#94a3b8' }}><IconBank /></div>
                  <label>NAMA ENTITAS BANK</label>
                </div>
                <input type="text" name="rekeningBank" defaultValue={initialBank} placeholder="Contoh: Bank Rakyat Indonesia (BRI)" required className={styles.input} />
              </div>
              
              <div className={styles.inputGroup}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ color: '#94a3b8' }}><IconNumber /></div>
                  <label>NOMOR REKENING AKTIF</label>
                </div>
                <input type="text" name="noRekening" defaultValue={initialNoRek} placeholder="Contoh: 0123456789" required className={styles.input} />
              </div>
              
              <div className={styles.inputGroup}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div style={{ color: '#94a3b8' }}><IconUser /></div>
                  <label>NAMA LENGKAP PENERIMA</label>
                </div>
                <input type="text" name="namaRekening" defaultValue={initialNamaRek} placeholder="Sesuai buku tabungan" required className={styles.input} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: '2fr 1fr', gap: "12px", marginTop: "12px" }}>
                <button type="submit" disabled={isPending} className={styles.submitBtn}>
                  {isPending ? "MEMPROSES..." : "SIMPAN VALIDASI"}
                </button>
                <button type="button" onClick={() => setShowEdit(false)} className={styles.btnSecondary}>
                  BATAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
