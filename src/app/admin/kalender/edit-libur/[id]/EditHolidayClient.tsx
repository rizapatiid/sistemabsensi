"use client"

import { useState } from "react"
import { updateHolidayAction } from "@/actions/admin"
import styles from "@/styles/admin.module.css"
import Link from "next/link"

const IconHoliday = () => (
    <div style={{ background: '#f8fafc', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    </div>
)

const IconCalendar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IconInfo = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
const IconChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>

export default function EditHolidayClient({ holiday }: { holiday: any }) {
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(holiday.image || null)
  const [imageAction, setImageAction] = useState<"KEEP" | "REMOVE" | "UPDATE">("KEEP")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setImageAction("UPDATE")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageAction("REMOVE")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    if (imageAction === "UPDATE" && imagePreview) {
      formData.set("image", imagePreview)
    } else if (imageAction === "REMOVE") {
      formData.set("image", "REMOVE")
    }

    const res = await updateHolidayAction(holiday.id, formData)
    if (res?.error) {
      alert(res.error)
      setLoading(false)
    }
  }

  // Format date to YYYY-MM-DD for input value
  const dateValue = new Date(holiday.tanggal).toISOString().split('T')[0]

  return (
    <div className={styles.pageContainer}>
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <IconHoliday />
                    <div>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Edit Hari Libur</h1>
                        <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.85rem', marginTop: '2px' }}>Perbarui data hari libur yang sudah ada.</p>
                    </div>
                </div>
                <Link href="/admin/kalender" className={styles.btnSm} style={{ 
                    background: '#f1f5f9', 
                    color: '#64748b', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: 800,
                    fontSize: '0.8rem'
                }}>
                <IconChevronLeft /> KEMBALI
                </Link>
            </div>

            <div className={styles.card} style={{ padding: '28px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e3a8a', padding: '14px', borderRadius: '12px', marginBottom: '24px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px', lineHeight: '1.4' }}>
                   <IconInfo /> Pastikan tanggal libur tidak berbenturan dengan hari aktif karyawan.
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <div style={{ color: '#1e3a8a' }}><IconCalendar /></div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>Pilih Tanggal Libur</label>
                        </div>
                        <input className={styles.filterPill} style={{ width: '100%', background: '#f8fafc', appearance: 'auto' }} type="date" name="tanggal" required defaultValue={dateValue} />
                    </div>

                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <div style={{ color: '#1e3a8a' }}><IconInfo /></div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>Nama Hari / Keterangan</label>
                        </div>
                        <input className={styles.filterPill} style={{ width: '100%', background: '#f8fafc' }} type="text" name="keterangan" placeholder="Contoh: Libur Nasional, Cuti Bersama" required defaultValue={holiday.keterangan} />
                    </div>

                    <div className={styles.formGroup}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 850, color: '#0f172a', marginBottom: '10px' }}>Banner / Gambar (Opsional)</label>
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                            <input type="file" accept="image/*" onChange={handleFileChange} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }} />
                            {imagePreview && (
                                <div style={{ marginTop: "16px", position: "relative", width: "100%", maxHeight: "200px", overflow: "hidden", borderRadius: "14px", border: '1px solid #e2e8f0' }}>
                                    <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "auto", display: "block" }} />
                                    <button type="button" onClick={handleRemoveImage} style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontWeight: 800, fontSize: '0.7rem' }}>HAPUS</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '8px' }}>
                        <button 
                            type="submit" 
                            style={{ 
                                width: '100%',
                                padding: '16px', 
                                fontSize: '0.95rem', 
                                borderRadius: '12px',
                                fontWeight: 850,
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                background: '#1e3a8a',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {loading ? "MEMPROSES..." : "SIMPAN PERUBAHAN"}
                        </button>
                    </div>
                </form>
            </div>
      </div>
    </div>
  )
}
