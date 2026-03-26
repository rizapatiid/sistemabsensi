"use client"

import { useState } from "react"
import { createAdminAction, deleteAdminAction } from "@/actions/employee"
import styles from "@/styles/admin.module.css"

export default function AdminManagementClient({ admins, currentUserId }: { admins: any[], currentUserId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const res = await createAdminAction(formData)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      alert("Admin baru berhasil ditambahkan!")
      setLoading(false)
      // Reset form if possible or page will revalidate
    }
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Kelola Admin</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Form Tambah Admin */}
        <div className={`${styles.section} glass`}>
          <h2>Tambah Admin Baru</h2>
          {error && <div className={styles.error} style={{ marginBottom: "1rem" }}>{error}</div>}
          <form action={handleSubmit} className="flex flex-col gap-4">
            <div className={styles.formGroup}>
              <label>ID Admin (Username)</label>
              <input type="text" name="id" required />
            </div>
            <div className={styles.formGroup}>
              <label>Nama Lengkap</label>
              <input type="text" name="nama" required />
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <input type="password" name="password" required />
            </div>
            <button type="submit" disabled={loading} className={styles.actionBtn}>
              {loading ? "Menyimpan..." : "Simpan Admin"}
            </button>
          </form>
        </div>

        {/* Tabel Daftar Admin */}
        <div className={`${styles.section} glass`}>
          <h2>Daftar Admin Sistem</h2>
          <table className={styles.dataGrid}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.nama}</td>
                  <td>
                    {a.id !== currentUserId ? (
                      <button 
                        onClick={async () => {
                          if (confirm("Hapus admin ini?")) {
                            await deleteAdminAction(a.id)
                          }
                        }}
                        className={styles.btnDelete}
                      >
                        Hapus
                      </button>
                    ) : (
                      <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Akun Anda</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
