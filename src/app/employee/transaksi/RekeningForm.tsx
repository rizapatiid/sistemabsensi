"use client"

import { useState } from "react"
import { updateRekeningAction } from "@/actions/employeeUser"
import styles from "@/styles/admin.module.css"

interface RekeningFormProps {
  initialBank: string
  initialNoRek: string
  initialNamaRek: string
}

export default function RekeningForm({ initialBank, initialNoRek, initialNamaRek }: RekeningFormProps) {
  const [loading, setLoading] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)
    
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${styles.section} glass`} style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.5rem" }}>💳</span> Informasi Rekening Bank
        </h2>
        <button 
          onClick={() => setShowEdit(true)} 
          className={styles.btnSm} 
          style={{ 
            backgroundColor: "#4f46e5", 
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Edit Rekening
        </button>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "1.5rem", 
        padding: "1.5rem", 
        background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)", 
        borderRadius: "12px",
        border: "1px solid #edf2f7",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" }}>Nama Bank</label>
          <div style={{ color: "#1e293b", fontWeight: "700", fontSize: "1.1rem" }}>{initialBank || "-"}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" }}>Nomor Rekening</label>
          <div style={{ color: "#1e293b", fontWeight: "700", fontSize: "1.1rem", fontFamily: "monospace", letterSpacing: "0.05rem" }}>{initialNoRek || "-"}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" }}>Nama Pemilik</label>
          <div style={{ color: "#1e293b", fontWeight: "700", fontSize: "1.1rem" }}>{initialNamaRek || "-"}</div>
        </div>
      </div>

      {/* POPUP EDIT MODAL (PREMIUM DESIGN) */}
      {showEdit && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.75)", 
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 9999,
          padding: "1rem"
        }}>
          <div style={{ 
            width: "100%", maxWidth: "450px", 
            backgroundColor: "white",
            padding: "2.5rem 2rem", 
            borderRadius: "20px",
            border: "1px solid #e2e8f0", 
            position: "relative",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
          }}>
            <button 
              onClick={() => { setShowEdit(false); setMessage(null); }} 
              style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "#f1f5f9", border: "none", width: "32px", height: "32px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}
            >
              ×
            </button>

            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🏦</div>
              <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#0f172a" }}>Update Rekening</h2>
              <p style={{ margin: "0.5rem 0 0", color: "#64748b", fontSize: "0.875rem" }}>Pastikan data rekening benar untuk pembayaran gaji.</p>
            </div>

            {message && (
              <div style={{ 
                padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.875rem", textAlign: "center", fontWeight: "600",
                backgroundColor: message.type === "success" ? "#ecfdf5" : "#fef2f2",
                color: message.type === "success" ? "#065f46" : "#991b1b",
                border: `1px solid ${message.type === "success" ? "#10b981" : "#ef4444"}`
              }}>
                {message.text}
              </div>
            )}

            <form action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className={styles.formGroup}>
                <label style={{ color: "#475569", fontWeight: "600", fontSize: "0.875rem" }}>Nama Bank</label>
                <input type="text" name="rekeningBank" defaultValue={initialBank} required style={{ borderRadius: "10px", padding: "0.75rem", border: "1px solid #cbd5e1" }} />
              </div>
              <div className={styles.formGroup}>
                <label style={{ color: "#475569", fontWeight: "600", fontSize: "0.875rem" }}>Nomor Rekening</label>
                <input type="text" name="noRekening" defaultValue={initialNoRek} required style={{ borderRadius: "10px", padding: "0.75rem", border: "1px solid #cbd5e1" }} />
              </div>
              <div className={styles.formGroup}>
                <label style={{ color: "#475569", fontWeight: "600", fontSize: "0.875rem" }}>Nama Pemilik Rekening</label>
                <input type="text" name="namaRekening" defaultValue={initialNamaRek} required style={{ borderRadius: "10px", padding: "0.75rem", border: "1px solid #cbd5e1" }} />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "1rem" }}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    flex: 2, 
                    backgroundColor: "#4f46e5", 
                    color: "white", 
                    border: "none", 
                    padding: "1rem", 
                    borderRadius: "12px", 
                    fontWeight: "600",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)",
                    transition: "all 0.2s"
                  }}
                >
                  {loading ? "Menyimpan..." : "Update Data"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowEdit(false)} 
                  style={{ 
                    flex: 1, 
                    backgroundColor: "white", 
                    color: "#475569", 
                    border: "1px solid #e2e8f0", 
                    padding: "1rem", 
                    borderRadius: "12px", 
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
