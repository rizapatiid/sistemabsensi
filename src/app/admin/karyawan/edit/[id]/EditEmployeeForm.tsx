"use client"

import { useState } from "react"
import { updateEmployeeAction } from "@/actions/employee"
import styles from "@/styles/admin.module.css"
import Link from "next/link"
import Image from "next/image"

const IconPlusUser = () => (
    <div style={{ background: '#f8fafc', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    </div>
)

const IconId = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 16h10"/><path d="M7 12h10"/><path d="M7 8h10"/></svg>
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconBriefcase = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect x="2" y="7" width="20" height="14" rx="2"/><line x1="2" y1="14" x2="22" y2="14"/></svg>
const IconLock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const IconPhone = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const IconMail = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>
const IconMapPin = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IconCreditCard = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IconImagePlus = () => <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/><circle cx="9" cy="9" r="2"/><path d="M16 5h6"/><path d="M19 2v6"/></svg>
const IconUpload = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>

export default function EditEmployeeForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [fotoProfilBase64, setFotoProfilBase64] = useState<string>(user.fotoProfil || "")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file maksimal 2MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotoProfilBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")
    
    try {
      if (fotoProfilBase64 && fotoProfilBase64 !== user.fotoProfil) {
        formData.set("fotoProfil", fotoProfilBase64)
      } else if (user.fotoProfil) {
        formData.set("fotoProfil", user.fotoProfil)
      }
      const result = await updateEmployeeAction(formData)
      if (result?.error) {
        setError(result.error as string)
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      console.error(err);
      setError("Terjadi kesalahan sistem: " + err.message)
    }
    
    setLoading(false)
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/><path d="M16 19h6"/><path d="M19 16v6"/></svg>
        </div>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
            Edit Karyawan
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className={styles.card} style={{ width: '100%', padding: 'clamp(16px, 4vw, 24px)', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', marginBottom: '60px' }}>
              
              {error && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', background: 'linear-gradient(to right, #fef2f2, #ffffff)', border: '1px solid #fecaca', borderLeft: '4px solid #ef4444', color: '#dc2626', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.08)' }}>
                  <div style={{ background: '#fee2e2', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '2px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '-0.01em', color: '#991b1b' }}>Gagal Menyimpan Data</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#b91c1c', opacity: 0.9, lineHeight: 1.4 }}>{error}</span>
                  </div>
                </div>
              )}
              
              {success && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f0fdf4', border: '1px solid #dcfce7', color: '#16a34a', padding: '16px', borderRadius: '14px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.05)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Berhasil!</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '2px', opacity: 0.9 }}>Data karyawan telah diperbarui. <Link href="/admin/karyawan" style={{ textDecoration: 'underline' }}>Kembali ke tabel</Link></span>
                  </div>
                </div>
              )}

              <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <input type="hidden" name="idOriginal" value={user.id} />
                  
                  {/* Baris Pertama: Foto Profil & Akses Login */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '24px', alignItems: 'start' }}>
                      
                      {/* Foto Profil */}
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px', padding: '20px', background: 'linear-gradient(to right, #f8fafc, #ffffff)', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.01)', height: '100%' }}>
                          <div style={{ 
                              flexShrink: 0, 
                              display: 'flex', justifyContent: 'center', alignItems: 'center', 
                              width: '84px', height: '84px', borderRadius: '16px', background: '#ffffff', border: '2px dashed #cbd5e1', 
                              overflow: 'hidden', position: 'relative' 
                          }}>
                              {fotoProfilBase64 ? (
                                  <Image src={fotoProfilBase64} alt="Profil" fill style={{ objectFit: 'cover' }} />
                              ) : (
                                  <div style={{ color: '#94a3b8' }}>
                                      <IconImagePlus />
                                  </div>
                              )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Unggah Foto Profil</span>
                              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, lineHeight: 1.4 }}>Format: JPG/PNG, maksimal 2MB.</span>
                              <label 
                                  htmlFor="fotoProfilUpload" 
                                  style={{ 
                                      marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#ffffff', border: '1px solid #cbd5e1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                      color: '#0f172a', fontSize: '0.75rem', fontWeight: 700, borderRadius: '8px', cursor: 'pointer',
                                      width: 'fit-content', transition: 'all 0.2s'
                                  }}
                              >
                                  <IconUpload /> Ganti Foto
                              </label>
                          </div>
                          <input type="file" id="fotoProfilUpload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                      </div>

                      {/* Akses Login */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', background: 'linear-gradient(to left, #f8fafc, #ffffff)', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.01)', height: '100%' }}>
                          <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #f1f5f9', paddingBottom: '6px' }}>
                              Akses Login
                          </h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <div className={styles.formGroup}>
                                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>ID KARYAWAN <span style={{color: '#ef4444'}}>*</span></label>
                                  <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '10px 16px', gap: '12px', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
                                      <div style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}><IconId /></div>
                                      <input style={{ flex: 1, background: 'transparent', border: 'none', fontWeight: 900, fontSize: '0.85rem', color: '#10b981', outline: 'none', cursor: 'not-allowed' }} type="text" name="id" value={user.id} readOnly />
                                  </div>
                              </div>
                              <div className={styles.formGroup}>
                                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>PASSWORD LOGIN</label>
                                  <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '10px 16px', gap: '12px', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
                                      <div style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}><IconLock /></div>
                                      <input style={{ flex: 1, background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', outline: 'none' }} type="text" name="password" placeholder="Kosongkan jika tidak diubah" />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #f1f5f9', paddingBottom: '6px' }}>
                          Profil Karyawan
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '16px' }}>
                          <div className={styles.formGroup}>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>NAMA LENGKAP <span style={{color: '#ef4444'}}>*</span></label>
                              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '10px 16px', gap: '12px', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
                                  <div style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}><IconUser /></div>
                                  <input style={{ flex: 1, background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', outline: 'none' }} type="text" name="nama" defaultValue={user.nama} required />
                              </div>
                          </div>
                          <div className={styles.formGroup}>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>JABATAN / POSISI <span style={{color: '#ef4444'}}>*</span></label>
                              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '10px 16px', gap: '12px', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
                                  <div style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}><IconBriefcase /></div>
                                  <input style={{ flex: 1, background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', outline: 'none' }} type="text" name="jabatan" defaultValue={user.jabatan || ""} required />
                              </div>
                          </div>
                      </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #f1f5f9', paddingBottom: '6px' }}>
                          Kontak & Domisili
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '16px' }}>
                          <div className={styles.formGroup}>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>NO. WHATSAPP (OPSIONAL)</label>
                              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '10px 16px', gap: '12px', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
                                  <div style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}><IconPhone /></div>
                                  <input style={{ flex: 1, background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', outline: 'none' }} type="text" name="phone" defaultValue={user.phone || ""} />
                              </div>
                          </div>
                          <div className={styles.formGroup}>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>EMAIL AKTIF (OPSIONAL)</label>
                              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '10px 16px', gap: '12px', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
                                  <div style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}><IconMail /></div>
                                  <input style={{ flex: 1, background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', outline: 'none' }} type="email" name="email" defaultValue={user.email || ""} />
                              </div>
                          </div>
                      </div>

                      <div className={styles.formGroup}>
                          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>ALAMAT DOMISILI LENGKAP (OPSIONAL)</label>
                          <textarea 
                              name="alamat" 
                              defaultValue={user.alamat || ""} 
                              rows={2} 
                              style={{ 
                                  width: "100%", 
                                  borderRadius: "10px", 
                                  padding: '12px 14px', 
                                  background: '#f8fafc',
                                  border: '1px solid #e2e8f0',
                                  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
                                  fontWeight: 600,
                                  fontSize: '0.85rem',
                                  color: '#0f172a',
                                  outline: 'none',
                                  transition: 'border-color 0.2s',
                                  resize: 'vertical',
                                  boxSizing: 'border-box'
                              }}
                          ></textarea>
                      </div>
                  </div>

                  <div style={{ display: 'none', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #f1f5f9', paddingBottom: '6px' }}>
                          Data Rekening Bank (Opsional)
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px' }}>
                          <div className={styles.formGroup}>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>NAMA BANK</label>
                              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '10px 16px', gap: '12px', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
                                  <div style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}><IconBriefcase /></div>
                                  <input style={{ flex: 1, background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', outline: 'none' }} type="text" name="rekeningBank" defaultValue={user.rekeningBank || ""} />
                              </div>
                          </div>
                          <div className={styles.formGroup}>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>NOMOR REKENING</label>
                              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '10px 16px', gap: '12px', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
                                  <div style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}><IconCreditCard /></div>
                                  <input style={{ flex: 1, background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', outline: 'none' }} type="text" name="noRekening" defaultValue={user.noRekening || ""} />
                              </div>
                          </div>
                          <div className={styles.formGroup}>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>PEMILIK REKENING</label>
                              <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '10px 16px', gap: '12px', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)' }}>
                                  <div style={{ color: '#64748b', display: 'flex', alignItems: 'center' }}><IconUser /></div>
                                  <input style={{ flex: 1, background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', outline: 'none' }} type="text" name="namaRekening" defaultValue={user.namaRekening || ""} />
                              </div>
                          </div>
                      </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px', borderTop: '2px solid #f1f5f9', paddingTop: '24px' }}>
                      <Link href="/admin/karyawan" style={{ 
                          flex: 1,
                          background: '#f8fafc', 
                          color: '#64748b', 
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '12px',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          textDecoration: 'none',
                          transition: 'all 0.2s'
                      }}>
                        BATAL
                      </Link>

                      <button 
                          type="submit" 
                          disabled={loading} 
                          style={{ 
                              flex: 2,
                              padding: '12px', 
                              fontSize: '0.8rem', 
                              borderRadius: '10px',
                              fontWeight: 800,
                              border: 'none',
                              color: 'white',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              opacity: loading ? 0.7 : 1,
                              background: '#0f172a',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px'
                          }}
                      >
                          {loading ? "MENYIMPAN..." : "SIMPAN"}
                      </button>
                  </div>
              </form>
          </div>
      </div>
    </div>
  )
}
