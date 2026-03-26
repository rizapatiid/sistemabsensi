"use client"

import { useState } from "react"
import { updateEmployeeAction } from "@/actions/employee"
import styles from "@/styles/admin.module.css"
import Link from "next/link"

export default function EditEmployeeForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const res = await updateEmployeeAction(formData)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className={styles.pageTitle}>Edit Data Karyawan</h1>
        <Link href="/admin/karyawan" className={styles.logoutBtn} style={{ backgroundColor: "#374151" }}> Kembali </Link>
      </div>

      <div className={`${styles.section} glass`} style={{ maxWidth: "800px" }}>
        {error && <div className={styles.error} style={{ marginBottom: "1rem" }}>{error}</div>}
        
        <form action={handleSubmit} className="flex flex-col gap-6">
          {/* Untuk identifikasi saat update */}
          <input type="hidden" name="idOriginal" value={user.id} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className={styles.formGroup}>
              <label>ID Karyawan</label>
              <input type="text" name="id" defaultValue={user.id} required />
            </div>
            <div className={styles.formGroup}>
              <label>Nama Lengkap</label>
              <input type="text" name="nama" defaultValue={user.nama} required />
            </div>
            <div className={styles.formGroup}>
              <label>Jabatan</label>
              <input type="text" name="jabatan" defaultValue={user.jabatan || ""} required />
            </div>
            <div className={styles.formGroup}>
              <label>Password Login</label>
              <input type="text" name="password" defaultValue={user.password} required />
            </div>
            <div className={styles.formGroup}>
              <label>Nomor HP</label>
              <input type="text" name="phone" defaultValue={user.phone || ""} />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" name="email" defaultValue={user.email || ""} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Alamat Lengkap</label>
            <textarea name="alamat" defaultValue={user.alamat || ""} rows={3} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)" }}></textarea>
          </div>

          <button 
            type="submit" 
            className={styles.actionBtn} 
            disabled={loading}
            style={{ padding: "1rem", fontSize: "1rem" }}
          >
            {loading ? "Menyimpan Perubahan..." : "Update Data Karyawan"}
          </button>
        </form>
      </div>
    </div>
  )
}
