"use client"

import { useState, useTransition } from "react"
import { updateRekeningAction } from "@/actions/employeeUser"
import styles from "@/styles/transaksi_karyawan.module.css"

interface RekeningFormProps {
  initialBank: string
  initialNoRek: string
  initialNamaRek: string
}

// Minimalist SVGs
const IconBank = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg>
)
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
)

export default function RekeningForm({ initialBank, initialNoRek, initialNamaRek }: RekeningFormProps) {
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
    <div className={styles.rekeningContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '40px', flex: 1, flexWrap: 'wrap' }}>
          <div className={styles.inputGroup}>
            <label>NAMA BANK</label>
            <div style={{ fontVariantNumeric: 'tabular-nums', fontWeight: '900', fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconBank />
              {initialBank || "-"}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>NOMOR REKENING</label>
            <div style={{ fontWeight: '900', fontSize: '1.25rem', color: '#0f172a', letterSpacing: '0.05em' }}>
              {initialNoRek ? initialNoRek.replace(/(\d{4})/g, '$1 ') : "-"}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>NAMA PEMILIK</label>
            <div style={{ fontWeight: '900', fontSize: '1.25rem', color: '#0f172a' }}>{initialNamaRek || "-"}</div>
          </div>
        </div>
        <button onClick={() => setShowEdit(true)} className={styles.submitBtn} style={{ background: '#f8fafc', color: '#1a567e', border: '1px solid #eef2f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconEdit />
          PERBARUI DATA
        </button>
      </div>

      {showEdit && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.7)", 
          backdropFilter: "blur(12px)",
          display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 9999,
          padding: "20px",
          animation: 'fadeIn 0.3s ease'
        }}>
          <div className={styles.card} style={{ width: "100%", maxWidth: "480px", position: "relative", padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}>
            <button 
              onClick={() => { setShowEdit(false); setMessage(null); }} 
              style={{ position: "absolute", top: "24px", right: "24px", background: "#f8fafc", border: "none", width: "32px", height: "32px", borderRadius: "10px", cursor: "pointer", color: "#64748b", fontWeight: 'bold' }}
            >
              ×
            </button>

            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#1a567e' }}>
                <IconBank />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: "#0f172a", letterSpacing: '-0.03em' }}>Update Rekening</h2>
              <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: "0.85rem", lineHeight: '1.5' }}>Gunakan data rekening yang valid untuk kelancaran pembayaran payroll Anda.</p>
            </div>

            {message && (
              <div style={{ 
                padding: "14px", borderRadius: "12px", marginBottom: "24px", fontSize: "0.85rem", textAlign: "center", fontWeight: "900",
                backgroundColor: message.type === "success" ? "#f0fdf4" : "#fef2f2",
                color: message.type === "success" ? "#166534" : "#991b1b",
                border: `1px solid ${message.type === "success" ? "#dcfce7" : "#fee2e2"}`
              }}>
                {message.text}
              </div>
            )}

            <form action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className={styles.inputGroup}>
                <label>NAMA BANK</label>
                <input type="text" name="rekeningBank" defaultValue={initialBank} required className={styles.input} placeholder="Contoh: BCA / MANDIRI / BNI" />
              </div>
              <div className={styles.inputGroup}>
                <label>NOMOR REKENING</label>
                <input type="text" name="noRekening" defaultValue={initialNoRek} required className={styles.input} placeholder="000123456789" />
              </div>
              <div className={styles.inputGroup}>
                <label>NAMA PEMILIK REKENING</label>
                <input type="text" name="namaRekening" defaultValue={initialNamaRek} required className={styles.input} placeholder="Sesuai buku tabungan" />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button type="submit" disabled={isPending} className={styles.submitBtn} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {isPending ? "MEMPROSES..." : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                      SIMPAN VALIDASI
                    </>
                  )}
                </button>
                <button type="button" onClick={() => setShowEdit(false)} className={styles.submitBtn} style={{ flex: 1, background: 'white', color: '#64748b', border: '1px solid #e2e8f0' }}>
                  BATAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
