"use client"

import { useState } from "react"
import { updateAnnouncementAction } from "@/actions/admin"
import styles from "@/styles/admin.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import RichTextEditor from "@/components/RichTextEditor"

const IconGlobe = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
const IconClock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconFileText = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>

export default function EditAnnouncementForm({ ann }: { ann: any }) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(ann.image || null)
  const [konten, setKonten] = useState(ann.konten || "")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => { setImagePreview(reader.result as string) }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    if (imagePreview) formData.set("image", imagePreview)
    formData.set("konten", konten)
    const res = await updateAnnouncementAction(formData)
    if (res?.error) {
      alert(res.error)
      setLoading(false)
    } else {
      router.push("/admin/pengumuman")
    }
  }

  return (
    <div className={styles.pageContainer} style={{ padding: '16px 0', gap: '16px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0 4px' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: '46px', height: '46px', borderRadius: '16px', background: '#eff6ff',
          color: '#2563eb', flexShrink: 0
        }}>
          <IconGlobe />
        </div>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
            Edit Pengumuman
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 8px' }}>
          <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', padding: 'clamp(20px, 4vw, 32px)', borderRadius: '24px', border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)', marginBottom: '60px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <input type="hidden" name="id" value={ann.id} />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '6px', color: '#475569' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></div>
                            Informasi Publikasi
                        </h3>
                        <div className={styles.formGroup}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '8px', letterSpacing: '0.02em' }}>JUDUL PENGUMUMAN <span style={{color: '#ef4444'}}>*</span></label>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px 16px', gap: '12px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.01) inset', transition: 'all 0.2s' }}>
                                <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M3 15h6"/><path d="M3 18h6"/></svg></div>
                                <input style={{ flex: 1, background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', outline: 'none' }} type="text" name="judul" defaultValue={ann.judul} required />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '6px', color: '#475569' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                            Media & Penjadwalan
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
                            <div className={styles.formGroup}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '8px', letterSpacing: '0.02em' }}>PERBARUI BANNER (OPSIONAL)</label>
                                
                                {!imagePreview ? (
                                    <label style={{ 
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        background: 'linear-gradient(145deg, #f8fafc, #f1f5f9)', padding: '32px 16px', borderRadius: '16px', 
                                        border: '2px dashed #cbd5e1', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
                                    }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = 'linear-gradient(145deg, #f8fafc, #f1f5f9)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                        <div style={{ background: 'white', color: '#3b82f6', padding: '16px', borderRadius: '20px', marginBottom: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)' }}>
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                        </div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Pilih Gambar Baru</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginTop: '6px' }}>Format: PNG, JPG, GIF (Maks. 2MB)</span>
                                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                    </label>
                                ) : (
                                    <div style={{ position: "relative", width: "100%", borderRadius: "16px", border: '2px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden', background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img src={imagePreview} alt="Preview" style={{ width: "100%", maxHeight: "400px", height: "auto", objectFit: 'contain', display: "block" }} />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 30%)', pointerEvents: 'none' }}></div>
                                        <button type="button" onClick={() => setImagePreview(null)} style={{ 
                                            position: "absolute", top: "12px", right: "12px", 
                                            backgroundColor: "rgba(15, 23, 42, 0.7)", backdropFilter: 'blur(4px)', color: "white", 
                                            border: "none", borderRadius: "50%", width: '36px', height: '36px', 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: "pointer", transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                        }} title="Hapus Gambar" onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.backgroundColor = '#ef4444'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.7)'; }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                        </button>
                                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                    </div>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '8px', letterSpacing: '0.02em' }}>JADWAL PENAYANGAN (OPSIONAL)</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px 16px', gap: '12px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.01) inset', transition: 'all 0.2s' }}>
                                    <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                                    <input 
                                        style={{ flex: 1, background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', outline: 'none' }} 
                                        type="datetime-local" 
                                        name="scheduleDate" 
                                        defaultValue={ann.scheduleDate ? new Date(ann.scheduleDate).toISOString().slice(0, 16) : ""}
                                    />
                                </div>
                                <p style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, marginTop: '6px' }}>*Hapus jadwal jika ingin langsung ditayangkan sekarang.</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '6px', color: '#475569' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                            Konten Pengumuman
                        </h3>
                        <div className={styles.formGroup}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', letterSpacing: '0.02em', textTransform: 'uppercase' }}>ISI LENGKAP <span style={{color: '#ef4444'}}>*</span></label>
                            </div>

                            <RichTextEditor 
                                value={konten} 
                                onChange={setKonten} 
                                placeholder="Revisi atau perbarui isi pengumuman di sini..." 
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px', borderTop: '2px solid rgba(226, 232, 240, 0.6)', paddingTop: '32px' }}>
                        <Link href="/admin/pengumuman" style={{ 
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
                        <button type="submit" disabled={loading} style={{ 
                            flex: 2,
                            padding: '12px', 
                            fontSize: '0.85rem', 
                            borderRadius: '12px',
                            fontWeight: 800,
                            letterSpacing: '0.02em',
                            border: 'none',
                            color: 'white',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.3)'
                        }} onMouseOver={(e) => { if(!loading) e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 25px -5px rgba(15, 23, 42, 0.4)'; }} onMouseOut={(e) => { if(!loading) e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(15, 23, 42, 0.3)'; }}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <svg className={styles.spinner} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
                                    MEMPROSES...
                                </span>
                            ) : "SIMPAN"}
                        </button>
                    </div>
                </form>
            </div>
      </div>
    </div>
  )
}
