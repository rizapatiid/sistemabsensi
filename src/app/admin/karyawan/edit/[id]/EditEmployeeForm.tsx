"use client"

import { useState } from "react"
import { updateEmployeeAction } from "@/actions/employee"
import styles from "@/styles/admin.module.css"
import Link from "next/link"

const IconEditUser = () => (
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
const IconChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>

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
      <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
            {/* Header Navy Style */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <IconEditUser />
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Edit Profil Karyawan</h1>
                        <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem', marginTop: '2px' }}>Modifikasi data personil dan akses staf RMP.</p>
                    </div>
                </div>
                <Link href="/admin/karyawan" className={styles.btnSm} style={{ 
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

            {/* Clean Functional Card */}
            <div className={styles.card} style={{ padding: '32px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '14px', borderRadius: '12px', marginBottom: '24px', fontWeight: 700, fontSize: '0.9rem' }}>
                        ⚠️ {error}
                    </div>
                )}
                
                <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <input type="hidden" name="idOriginal" value={user.id} />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        <div className={styles.formGroup}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ color: '#1e3a8a' }}><IconId /></div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>ID Karyawan</label>
                            </div>
                            <input className={styles.filterPill} style={{ width: '100%', background: '#f8fafc' }} type="text" name="id" defaultValue={user.id} required />
                        </div>
                        <div className={styles.formGroup}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ color: '#1e3a8a' }}><IconUser /></div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>Nama Lengkap</label>
                            </div>
                            <input className={styles.filterPill} style={{ width: '100%', background: '#f8fafc' }} type="text" name="nama" defaultValue={user.nama} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        <div className={styles.formGroup}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ color: '#1e3a8a' }}><IconBriefcase /></div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>Jabatan / Posisi</label>
                            </div>
                            <input className={styles.filterPill} style={{ width: '100%', background: '#f8fafc' }} type="text" name="jabatan" defaultValue={user.jabatan || ""} required />
                        </div>
                        <div className={styles.formGroup}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ color: '#a16207' }}><IconLock /></div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 850, color: '#854d0e' }}>Perbarui Password</label>
                            </div>
                            <input className={styles.filterPill} style={{ width: '100%', background: '#fffbeb', border: '1px solid #fef08a' }} type="text" name="password" defaultValue={user.password} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        <div className={styles.formGroup}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ color: '#1e3a8a' }}><IconPhone /></div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>No. WhatsApp</label>
                            </div>
                            <input className={styles.filterPill} style={{ width: '100%', background: '#f8fafc' }} type="text" name="phone" defaultValue={user.phone || ""} />
                        </div>
                        <div className={styles.formGroup}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ color: '#1e3a8a' }}><IconMail /></div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>Email Aktif</label>
                            </div>
                            <input className={styles.filterPill} style={{ width: '100%', background: '#f8fafc' }} type="email" name="email" defaultValue={user.email || ""} />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <div style={{ color: '#1e3a8a' }}><IconMapPin /></div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>Alamat Domisili Lengkap</label>
                        </div>
                        <textarea 
                            name="alamat" 
                            defaultValue={user.alamat || ""} 
                            rows={3} 
                            className={styles.filterPill}
                            style={{ width: "100%", borderRadius: "14px", padding: '14px 18px', appearance: 'none', resize: 'none', background: '#f8fafc' }}
                        ></textarea>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            style={{ 
                                width: '100%',
                                padding: '18px', 
                                fontSize: '1rem', 
                                borderRadius: '16px',
                                fontWeight: 850,
                                border: 'none',
                                color: 'white',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                background: '#1e3a8a',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {loading ? "MENYIMPAN PERUBAHAN..." : "SIMPAN PERUBAHAN DATA"}
                        </button>
                    </div>
                </form>
            </div>
      </div>
    </div>
  )
}
