"use client"

import { useState } from "react"
import { createEmployeeAction } from "@/actions/employee"
import styles from "@/styles/admin.module.css"
import Link from "next/link"

export default function CreateEmployeeForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const res = await createEmployeeAction(formData)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
    // Jika sukses, action akan meredirect otomatis
  }

  return (
    <div className={styles.pageContainer}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className={styles.pageTitle}>Tambah Karyawan Baru</h1>
        <Link href="/admin/karyawan" className={styles.logoutBtn} style={{ backgroundColor: "#374151" }}> Kembali </Link>
      </div>

      <div className={`${styles.section} glass`} style={{ maxWidth: "800px" }}>
        {error && <div className={styles.error} style={{ marginBottom: "1rem" }}>{error}</div>}
        
        <form action={handleSubmit} className="flex flex-col gap-6">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className={styles.formGroup}>
              <label>ID Karyawan</label>
              <input type="text" name="id" placeholder="Misal: K001" required />
            </div>
            <div className={styles.formGroup}>
              <label>Nama Lengkap</label>
              <input type="text" name="nama" placeholder="Nama Lengkap Karyawan" required />
            </div>
            <div className={styles.formGroup}>
              <label>Jabatan</label>
              <input type="text" name="jabatan" placeholder="Contoh: Staff IT" required />
            </div>
            <div className={styles.formGroup}>
              <label>Password Login</label>
              <input type="text" name="password" defaultValue="12345" required />
            </div>
            <div className={styles.formGroup}>
              <label>Nomor HP (WhatsApp)</label>
              <input type="text" name="phone" placeholder="0812..." />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" name="email" placeholder="karyawan@email.com" />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Alamat Lengkap</label>
            <textarea name="alamat" placeholder="Alamat Domisili Sekarang" rows={3} style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)" }}></textarea>
          </div>

          <button 
            type="submit" 
            className={styles.actionBtn} 
            disabled={loading}
            style={{ padding: "1rem", fontSize: "1rem" }}
          >
            {loading ? "Menyimpan..." : "Simpan Data Karyawan"}
          </button>
        </form>
      </div>
    </div>
  )
}
