"use client"

import { useState } from "react"
import { updateProfileKaryawanAction } from "@/actions/employeeUser"
import styles from "@/styles/admin.module.css"

export default function ProfileForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{type: "error"|"success", text: string} | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMsg(null)
    const res = await updateProfileKaryawanAction(formData)
    if (res?.error) {
      setMsg({ type: "error", text: res.error })
    } else {
      setMsg({ type: "success", text: "Profil berhasil diperbarui!" })
    }
    setLoading(false)
  }

  return (
    <div className={`${styles.section} glass`} style={{ maxWidth: "600px" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Informasi Pribadi</h2>
      
      {msg && (
        <div className={msg.type === "success" ? styles.success : styles.error} style={{ 
          marginBottom: "1rem",
          padding: "10px",
          borderRadius: "6px",
          backgroundColor: msg.type === "success" ? "#d1fae5" : "#fee2e2",
          color: msg.type === "success" ? "#065f46" : "#991b1b"
        }}>
          {msg.text}
        </div>
      )}

      <form action={handleSubmit} className="flex flex-col gap-4">
        <div className={styles.formGroup}>
          <label>Nama Lengkap</label>
          <input type="text" name="nama" defaultValue={user.nama} required />
        </div>
        
        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="email" name="email" defaultValue={user.email || ""} />
        </div>

        <div className={styles.formGroup}>
          <label>Nomor HP</label>
          <input type="text" name="phone" defaultValue={user.phone || ""} />
        </div>

        <div className={styles.formGroup}>
          <label>Alamat Domisili</label>
          <textarea name="alamat" defaultValue={user.alamat || ""} rows={3} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)" }}></textarea>
        </div>

        <div className={styles.formGroup}>
          <label>Ubah Password</label>
          <input type="text" name="password" defaultValue={user.password} required />
        </div>

        <button 
          type="submit" 
          className={styles.actionBtn} 
          disabled={loading}
          style={{ marginTop: "1rem" }}
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  )
}
