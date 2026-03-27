"use client"

import { useState } from "react"
import { updateAnnouncementAction } from "@/actions/admin"
import styles from "@/styles/admin.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"

const IconMegaphone = () => (
    <div style={{ background: '#f8fafc', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11.6 16.8l2.6 3.1c.5.6 1.4.6 1.9 0l3-3.6c.5-.6.5-1.5 0-2.1l-2.6-3.1"/><path d="M18.3 12.1l-10-8.6c-1-.8-2.5-.1-2.5 1.2v14.6c0 1.3 1.5 2 2.5 1.2l10-8.6c.8-.7.8-2 0-2.8z"/></svg>
    </div>
)

const IconGlobe = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
const IconImage = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
const IconClock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconFileText = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const IconChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>

export default function EditAnnouncementForm({ ann }: { ann: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(ann.image || null)

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
    if (imagePreview) {
      formData.set("image", imagePreview)
    }

    const res = await updateAnnouncementAction(formData)
    if (res?.error) {
      alert(res.error)
      setLoading(false)
    } else {
      router.push("/admin/kalender")
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
            {/* Header Navy Style */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <IconMegaphone />
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Edit Pengumuman</h1>
                        <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem', marginTop: '2px' }}>Modifikasi informasi publikasi yang sudah ada.</p>
                    </div>
                </div>
                <Link href="/admin/kalender" className={styles.btnSm} style={{ 
                    background: '#f1f5f9', 
                    color: '#64748b', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 800,
                    fontSize: '0.85rem'
                }}>
                <IconChevronLeft /> BATAL
                </Link>
            </div>

            <div className={styles.card} style={{ padding: '32px', border: 'none', boxShadow: '0 4px 25px rgba(0,0,0,0.06)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    <input type="hidden" name="id" value={ann.id} />

                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <div style={{ color: '#1e3a8a' }}><IconGlobe /></div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>Judul Publikasi</label>
                        </div>
                        <input className={styles.filterPill} style={{ width: '100%', background: '#f8fafc' }} type="text" name="judul" defaultValue={ann.judul} required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        <div className={styles.formGroup}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <div style={{ color: '#1e3a8a' }}><IconImage /></div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>Perbarui Banner (Opsional)</label>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }} />
                                {imagePreview && (
                                    <div style={{ marginTop: "16px", position: "relative", width: "100%", maxHeight: "220px", overflow: "hidden", borderRadius: "12px", border: '1px solid #e2e8f0' }}>
                                        <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "auto", display: "block" }} />
                                        <button type="button" onClick={() => setImagePreview(null)} style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "10px", padding: "8px 16px", cursor: "pointer", fontWeight: 850, fontSize: '0.75rem', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>HAPUS BANNER</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <div style={{ color: '#1e3a8a' }}><IconClock /></div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>Jadwal Penayangan</label>
                            </div>
                            <input 
                              className={styles.filterPill} 
                              style={{ width: '100%', background: '#f8fafc', appearance: 'auto' }} 
                              type="datetime-local" 
                              name="scheduleDate" 
                              defaultValue={ann.scheduleDate ? new Date(ann.scheduleDate).toISOString().slice(0, 16) : ""}
                            />
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginTop: '10px', lineHeight: '1.4' }}>*Anda dapat menjadwalkan ulang atau mengosongkan untuk tayang segera.</p>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <div style={{ color: '#1e3a8a' }}><IconFileText /></div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>Isi Pengumuman Lengkap</label>
                        </div>
                        <textarea 
                            name="konten" 
                            rows={12} 
                            className={styles.filterPill}
                            defaultValue={ann.konten}
                            placeholder="Revisi atau perbarui isi pengumuman di sini..." 
                            required 
                            style={{ 
                                width: "100%", 
                                padding: "20px", 
                                borderRadius: "18px", 
                                appearance: 'none',
                                resize: 'none',
                                background: '#f8fafc',
                                lineHeight: '1.6'
                            }}
                        ></textarea>
                    </div>

                    <div style={{ marginTop: '8px' }}>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            style={{ 
                                width: '100%',
                                padding: '20px', 
                                fontSize: '1rem', 
                                borderRadius: '16px',
                                fontWeight: 850,
                                border: 'none',
                                color: 'white',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                background: '#1e3a8a',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 10px 20px rgba(30, 58, 138, 0.15)'
                            }}
                        >
                            {loading ? "MENYIMPAN PERUBAHAN..." : "SIMPAN PERUBAHAN PUBLIKASI"}
                        </button>
                    </div>
                </form>
            </div>
      </div>
    </div>
  )
}
