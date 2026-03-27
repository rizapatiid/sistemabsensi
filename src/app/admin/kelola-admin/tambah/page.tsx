"use client"

import { useState } from "react"
import { createAdminAction } from "@/actions/employee"
import styles from "@/styles/admin.module.css"
import Link from "next/link"
import { useRouter } from "next/navigation"

const IconAdminPlus = () => (
    <div style={{ background: '#f8fafc', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="12" y1="7" x2="12" y2="15"/></svg>
    </div>
)

const IconId = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 16h10"/><path d="M7 12h10"/><path d="M7 8h10"/></svg>
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconLock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const IconChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>

export default function CreateAdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const res = await createAdminAction(formData)
    
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      router.push("/admin/kelola-admin")
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
            {/* Header Navy Style */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <IconAdminPlus />
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Registrasi Admin</h1>
                        <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem', marginTop: '2px' }}>Berikan hak akses administratif baru.</p>
                    </div>
                </div>
                <Link href="/admin/kelola-admin" className={styles.btnSm} style={{ 
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

            {/* Clean Registration Form */}
            <div className={styles.card} style={{ padding: '32px', border: 'none', boxShadow: '0 4px 25px rgba(0,0,0,0.06)' }}>
                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '14px', borderRadius: '12px', marginBottom: '24px', fontWeight: 700, fontSize: '0.85rem' }}>
                        ⚠️ {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    
                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <div style={{ color: '#1e3a8a' }}><IconId /></div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>Username / ID Admin</label>
                        </div>
                        <input className={styles.filterPill} style={{ width: '100%', background: '#f8fafc' }} type="text" name="id" placeholder="Misal: superadmin_01" required />
                    </div>

                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <div style={{ color: '#1e3a8a' }}><IconUser /></div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 850, color: '#0f172a' }}>Nama Lengkap Administrator</label>
                        </div>
                        <input className={styles.filterPill} style={{ width: '100%', background: '#f8fafc' }} type="text" name="nama" placeholder="Masukkan Nama Lengkap" required />
                    </div>

                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <div style={{ color: '#a16207' }}><IconLock /></div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 850, color: '#854d0e' }}>Kata Sandi Akses</label>
                        </div>
                        <input className={styles.filterPill} style={{ width: '100%', background: '#fffbeb', border: '1px solid #fef08a' }} type="text" name="password" defaultValue="admin123" required />
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
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {loading ? "MENDAFTARKAN ADMIN..." : "KONFIRMASI AKSES ADMIN"}
                        </button>
                        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, marginTop: '24px', lineHeight: '1.5' }}>
                           *Perhatian: Memberikan akses Admin berarti memberikan kontrol penuh terhadap sistem manajemen.
                        </p>
                    </div>
                </form>
            </div>
      </div>
    </div>
  )
}
