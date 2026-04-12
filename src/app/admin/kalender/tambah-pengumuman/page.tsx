"use client"

import { useState } from "react"
import { createAnnouncementAction } from "@/actions/admin"
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

export default function CreateAnnouncementPage() {
  const router = useRouter()
  const insertText = (before: string, after: string) => {
    const textarea = document.getElementById('announcement-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const result = text.substring(0, start) + before + selected + after + text.substring(end);
    
    textarea.value = result;
    textarea.focus();
    // Reset selection
    const newCursorPos = start + before.length + selected.length + after.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
  };

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
    <div className={styles.pageContainer} style={{ background: '#f8fafc', padding: '0px', minHeight: '100vh' }}>
      
      {/* 1. STATUS LINE - PROFESSIONAL */}
      <div style={{ padding: 'clamp(12px, 2vw, 24px) clamp(16px, 4vw, 32px) 0 clamp(16px, 4vw, 32px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
              <div>
                  <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      marginBottom: '12px'
                  }}>
                      <div style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }}></div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Broadcasting Center • Create Content</span>
                  </div>
                  <h1 className={styles.pageTitle} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Buat Pengumuman
                  </h1>
                  <p style={{ color: '#64748b', fontWeight: 600, fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginTop: '8px', margin: 0 }}>
                    Susun materi informasi penting untuk disiarkan kepada seluruh staf.
                  </p>
              </div>
          </div>
      </div>

      <div style={{ padding: '0 clamp(16px, 4vw, 32px) clamp(16px, 4vw, 32px)' }}>
            <div className={styles.card} style={{ maxWidth: '900px', padding: 'clamp(20px, 4vw, 40px)', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    <div className={styles.formGroup}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Judul Publikasi</label>
                        <div className={styles.searchBox} style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                            <div className={styles.searchIcon}><IconGlobe /></div>
                            <input style={{ background: 'transparent', border: 'none', fontWeight: 700 }} className={styles.searchInput} type="text" name="judul" placeholder="Masukkan Judul Pengumuman" required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
                        <div className={styles.formGroup}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Banner / Gambar (Opsional)</label>
                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }} />
                                {imagePreview && (
                                    <div style={{ marginTop: "16px", position: "relative", width: "100%", maxHeight: "200px", overflow: "hidden", borderRadius: "14px", border: '1px solid #e2e8f0' }}>
                                        <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "auto", display: "block" }} />
                                        <button type="button" onClick={() => setImagePreview(null)} style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontWeight: 800, fontSize: '0.7rem' }}>HAPUS</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Jadwalkan Tampil</label>
                            <div className={styles.searchBox} style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                                <div className={styles.searchIcon}><IconClock /></div>
                                <input style={{ background: 'transparent', border: 'none', fontWeight: 700, appearance: 'auto' }} className={styles.searchInput} type="datetime-local" name="scheduleDate" />
                            </div>
                            <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, marginTop: '8px' }}>*Kosongkan jika ingin langsung tayang saat ini.</p>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Konten / Isi Pengumuman</label>
                            
                            {/* TEXT STYLING TOOLBAR */}
                            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                <button type="button" onClick={() => insertText('<b>', '</b>')} title="Bold" style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: '#0f172a' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
                                </button>
                                <button type="button" onClick={() => insertText('<i>', '</i>')} title="Italic" style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: '#0f172a' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
                                </button>
                                <button type="button" onClick={() => insertText('<u>', '</u>')} title="Underline" style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: '#0f172a' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
                                </button>
                                <div style={{ width: '1px', background: '#e2e8f0', margin: '4px 2px' }}></div>
                                <button type="button" onClick={() => insertText('<li>', '</li>')} title="Bullet List" style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: '#0f172a' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                                </button>
                            </div>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '16px', left: '20px', color: '#94a3b8' }}><IconFileText /></div>
                            <textarea 
                                id="announcement-content"
                                name="konten" 
                                rows={10} 
                                placeholder="Tuliskan isi pengumuman secara mendetail di sini..." 
                                required 
                                style={{ 
                                    width: "100%", 
                                    padding: "16px 20px 16px 50px", 
                                    borderRadius: "16px", 
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    color: '#1e293b',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    resize: 'none',
                                    boxSizing: 'border-box',
                                    lineHeight: '1.6'
                                }}
                            ></textarea>
                        </div>
                        <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, marginTop: '8px' }}>*Gunakan toolbar di atas untuk mengatur gaya teks (Tebal, Miring, List).</p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                        <Link href="/admin/kalender" className={styles.btnAction} style={{ 
                            flex: 1,
                            background: '#f1f5f9', 
                            color: '#64748b', 
                            border: '1px solid #e2e8f0',
                            justifyContent: 'center',
                            padding: '16px 12px',
                            borderRadius: '16px',
                            fontWeight: 900,
                            fontSize: '0.85rem',
                            boxShadow: 'none'
                        }}>
                          BATAL
                        </Link>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            style={{ 
                                flex: 2,
                                padding: '16px 12px', 
                                fontSize: '0.85rem', 
                                borderRadius: '16px',
                                fontWeight: 900,
                                border: 'none',
                                color: 'white',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                background: '#0f172a',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1)'
                            }}
                        >
                            {loading ? "MEMPROSES..." : "PUBLIKASIKAN SEKARANG"}
                        </button>
                    </div>
                </form>
            </div>
      </div>
    </div>
  )
}
