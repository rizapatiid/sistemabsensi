"use client"

import { useState } from "react"
import { updateHolidayAction } from "@/actions/admin"
import styles from "@/styles/admin.module.css"
import Link from "next/link"

const IconHoliday = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
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
    <div className={styles.pageContainer} style={{ padding: '16px 0', gap: '16px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0 4px' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '46px', height: '46px', borderRadius: '16px', background: '#eff6ff',
          color: '#2563eb', flexShrink: 0
        }}>
          <IconHoliday />
        </div>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
            Edit Hari Libur
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 8px' }}>
          <div style={{ width: '100%', maxWidth: '800px', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', padding: 'clamp(20px, 4vw, 32px)', borderRadius: '24px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)', marginBottom: '60px' }}>
            

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e3a8a', padding: '14px', borderRadius: '12px', marginBottom: '24px', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px', lineHeight: '1.4' }}>
               <IconInfo /> Pastikan tanggal libur tidak berbenturan dengan hari aktif karyawan.
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Tanggal Libur <span style={{color: '#ef4444'}}>*</span></label>
                        </div>
                        <input 
                            type="date" 
                            name="tanggal" 
                            required 
                            defaultValue={dateValue}
                            style={{ width: "100%", padding: "16px 20px", borderRadius: "12px", background: '#f8fafc', border: '1px solid #e2e8f0', fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.01) inset' }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#ffffff'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Nama Hari / Keterangan <span style={{color: '#ef4444'}}>*</span></label>
                        </div>
                        <input 
                            type="text" 
                            name="keterangan" 
                            placeholder="Contoh: Libur Nasional, Cuti Bersama" 
                            required 
                            defaultValue={holiday.keterangan}
                            style={{ width: "100%", padding: "16px 20px", borderRadius: "12px", background: '#f8fafc', border: '1px solid #e2e8f0', fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.01) inset' }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#ffffff'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Banner / Gambar <span style={{color: '#94a3b8', fontWeight: 600}}>(Opsional)</span></label>
                    </div>
                    
                    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '2px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', transition: 'all 0.2s' }}
                         onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#eff6ff'; }}
                         onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                         onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; if(e.dataTransfer.files[0]) { const input = document.getElementById('image-upload-edit-libur') as HTMLInputElement; input.files = e.dataTransfer.files; const event = new Event('change', { bubbles: true }); input.dispatchEvent(event); } }}
                    >
                        {!imagePreview ? (
                            <>
                                <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '16px', borderRadius: '50%', marginBottom: '4px', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.15)' }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ margin: 0, fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>Tarik & Lepas gambar ke sini</p>
                                    <p style={{ margin: '4px 0 0 0', fontWeight: 500, color: '#64748b', fontSize: '0.8rem' }}>atau klik untuk memilih dari perangkat</p>
                                </div>
                                <label style={{ cursor: 'pointer', background: '#ffffff', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', color: '#0f172a', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                    PILIH FILE
                                    <input id="image-upload-edit-libur" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                </label>
                            </>
                        ) : (
                            <div style={{ position: "relative", width: "100%", borderRadius: "12px", overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <img src={imagePreview} alt="Preview" style={{ width: "100%", maxHeight: "300px", objectFit: 'cover', display: "block" }} />
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%)' }}></div>
                                <button type="button" onClick={handleRemoveImage} style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: "rgba(255,255,255,0.9)", color: "#ef4444", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backdropFilter: 'blur(4px)' }} onMouseOver={(e) => e.currentTarget.style.background = '#ffffff'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    HAPUS GAMBAR
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '16px', borderTop: '2px solid rgba(226, 232, 240, 0.6)', paddingTop: '32px' }}>
                    <Link href="/admin/kalender" style={{ 
                        flex: 1,
                        background: '#f8fafc', 
                        color: '#475569', 
                        border: '1px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px',
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        letterSpacing: '0.02em',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }} onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#94a3b8'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}>
                      BATAL
                    </Link>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            flex: 2, padding: '12px', fontSize: '0.85rem', borderRadius: '12px', fontWeight: 800, border: 'none', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(15, 23, 42, 0.1)', transition: 'all 0.3s ease', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                        }}
                        onMouseOver={(e) => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(15, 23, 42, 0.4)'; } }}
                        onMouseOut={(e) => { if(!loading) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(15, 23, 42, 0.1)'; } }}
                    >
                        {loading ? (
                            <>
                                <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
                                MEMPROSES...
                            </>
                        ) : "SIMPAN"}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}
