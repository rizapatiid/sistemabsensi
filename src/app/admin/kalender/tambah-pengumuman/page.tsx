"use client"

import { useState } from "react"
import { createAnnouncementAction } from "@/actions/admin"
import styles from "@/styles/admin.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateAnnouncementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    // Jika ada preview image, masukkan ke formData sebagai string
    if (imagePreview) {
      formData.set("image", imagePreview)
    }

    const res = await createAnnouncementAction(formData)
    if (res?.error) {
      alert(res.error)
      setLoading(false)
    } else {
      router.push("/admin/kalender")
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className={styles.pageTitle}>Buat Pengumuman Baru</h1>
        <Link href="/admin/kalender" className={styles.logoutBtn} style={{ backgroundColor: "#374151" }}> Kembali </Link>
      </div>

      <div className={`${styles.section} glass`} style={{ maxWidth: "800px" }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className={styles.formGroup}>
            <label>Judul Pengumuman</label>
            <input type="text" name="judul" placeholder="Judul Pengumuman" required />
          </div>

          <div className={styles.formGroup}>
            <label>Gambar Pengumuman (Opsional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: "1rem" }} />
            {imagePreview && (
              <div style={{ marginTop: "1rem", position: "relative", width: "100%", maxHeight: "300px", overflow: "hidden", borderRadius: "8px", border: "1px solid #ddd" }}>
                <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "auto", display: "block" }} />
                <button type="button" onClick={() => setImagePreview(null)} style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "rgba(255,0,0,0.8)", color: "white", border: "none", borderRadius: "4px", padding: "4px 8px", cursor: "pointer" }}>Hapus</button>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Jadwalkan Publikasi (Kosongkan jika langsung tampil)</label>
            <input type="datetime-local" name="scheduleDate" />
          </div>

          <div className={styles.formGroup}>
            <label>Isi Pengumuman</label>
            <textarea name="konten" rows={8} placeholder="Tuliskan isi pengumuman di sini..." required style={{ width: "100%", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border)" }}></textarea>
          </div>

          <button type="submit" className={styles.actionBtn} disabled={loading}>
            {loading ? "Mempublikasikan..." : "Publikasikan Pengumuman"}
          </button>
        </form>
      </div>
    </div>
  )
}
