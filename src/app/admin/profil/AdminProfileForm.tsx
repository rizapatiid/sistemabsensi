"use client"

import { useState } from "react"
import { updateProfileAdminAction } from "@/actions/employee"
import styles from "@/styles/admin.module.css"

export default function AdminProfileForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{type: "error"|"success", text: string} | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMsg(null)
    const res = await updateProfileAdminAction(formData)
    if (res?.error) {
      setMsg({ type: "error", text: res.error })
    } else {
      setMsg({ type: "success", text: "Profil admin berhasil diperbarui!" })
    }
    setLoading(false)
  }

  return (
    <div className={`${styles.section} glass`} style={{ maxWidth: "500px" }}>
      <h2>Informasi Pribadi Admin</h2>
      
      {msg && (
        <div style={{ 
          margin: "1rem 0", padding: "10px", borderRadius: "6px",
          backgroundColor: msg.type === "success" ? "#d1fae5" : "#fee2e2",
          color: msg.type === "success" ? "#065f46" : "#991b1b",
          fontSize: "0.85rem"
        }}>
          {msg.text}
        </div>
      )}

      <form action={handleSubmit} className="flex flex-col gap-4">
        <div className={styles.formGroup}>
          <label>Nama Lengkap Admin</label>
          <input type="text" name="nama" defaultValue={user.nama} required />
        </div>
        
        <div className={styles.formGroup}>
          <label>ID Admin (Username)</label>
          <input type="text" value={user.id} disabled style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }} />
          <small style={{ color: "#6b7280" }}>ID Admin tidak dapat diubah.</small>
        </div>

        <div className={styles.formGroup}>
          <label>Password Akun</label>
          <input type="text" name="password" defaultValue={user.password} required />
        </div>

        <button 
          type="submit" 
          className={styles.actionBtn} 
          disabled={loading}
          style={{ marginTop: "1rem" }}
        >
          {loading ? "Menyimpan..." : "Update Profil Admin"}
        </button>
      </form>
    </div>
  )
}
