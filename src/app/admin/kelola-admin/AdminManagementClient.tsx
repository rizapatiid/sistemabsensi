"use client"

import { useState } from "react"
import { deleteAdminAction } from "@/actions/employee"
import styles from "@/styles/admin.module.css"
import Link from "next/link"

const IconAdminShield = () => (
    <div style={{ background: '#f8fafc', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="3"/><path d="M7 18.5c0-2.5 2.5-3.5 5-3.5s5 1 5 3.5"/></svg>
    </div>
)

const IconPlus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconKey = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zM12 2l7 7-9 9"/></svg>
const IconStar = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const IconTrash = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
const IconId = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 16h10"/><path d="M7 12h10"/><path d="M7 8h10"/></svg>

export default function AdminManagementClient({ admins, currentUserId }: { admins: any[], currentUserId: string }) {
  const [loading, setLoading] = useState(false)

  const countTotal = admins.length
  const countRoot = admins.filter(a => a.id === 'ADMIN_ROOT' || a.nama.toLowerCase().includes('owner')).length

  async function handleDelete(id: string) {
    if (id === currentUserId) {
        alert("Tidak dapat menghapus akun Anda sendiri!")
        return
    }
    if (confirm("Ingin menghapus akses Admin ini? Karyawan yang terkait tidak akan terpengaruh.")) {
      setLoading(true)
      await deleteAdminAction(id)
      setLoading(false)
    }
  }

  return (
    <div className={styles.pageContainer}>
      {/* 1. Header & Quick Controls (Fluid & Stable) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px', marginBottom: '40px' }}>
        <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <IconAdminShield />
                <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.03em', lineHeight: '1.2' }}>Pengaturan Otoritas</h1>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600, marginTop: '12px', marginLeft: '2px', lineHeight: '1.6', maxWidth: '600px' }}>
                Manajemen hirarki hak akses dan kontrol panel administratif sistem RMP Digital.
            </p>
            
            <div style={{ marginTop: '28px' }}>
                <Link href="/admin/kelola-admin/tambah" className={styles.btnAction} style={{ padding: '14px 28px', borderRadius: '14px', background: '#1e3a8a', width: 'fit-content' }}>
                    <IconPlus /> TAMBAH ADMIN BARU
                </Link>
            </div>
        </div>

        {/* Stats Pill with Adaptive Flex */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', flex: '1 1 350px' }}>
            <div className={styles.statPill} style={{ borderColor: '#e0e7ff', flex: '1 1 160px', padding: '16px 20px' }}>
                <div className={styles.statIcon} style={{ background: '#e0e7ff', color: '#3730a3' }}><IconKey /></div>
                <div>
                    <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a' }}>{countTotal}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Total Admin</div>
                </div>
            </div>
            
            <div className={styles.statPill} style={{ borderColor: '#ecfdf5', flex: '1 1 160px', padding: '16px 20px' }}>
                <div className={styles.statIcon} style={{ background: '#ecfdf5', color: '#059669' }}><IconStar /></div>
                <div>
                    <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a' }}>{countRoot}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Root Access</div>
                </div>
            </div>
        </div>
      </div>

      {/* 2. Admin Identity Grid (Desktop View) */}
      <div className={`${styles.card} hidden-mobile`} style={{ border: 'none', boxShadow: '0 4px 30px rgba(0,0,0,0.03)', padding: '24px' }}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ background: '#fcfcfd', width: '40%' }}>IDENTITAS ADMINISTRATOR</th>
                <th style={{ background: '#fcfcfd', width: '30%' }}>KONTAK DINAS</th>
                <th style={{ background: '#fcfcfd', textAlign: 'right', width: '30%' }}>KONTROL AKSES</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id}>
                  <td>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '45px', height: '45px', minWidth: '45px', borderRadius: '14px', background: '#1e3a8a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.1rem' }}>
                        {admin.nama.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 850, color: '#0f172a', fontSize: '1rem', letterSpacing: '-0.01em' }}>
                            {admin.nama.toUpperCase()} 
                            {admin.id === currentUserId && (
                                <span style={{ fontSize: '0.6rem', background: '#e0e7ff', color: '#3730a3', padding: '3px 8px', borderRadius: '6px', marginLeft: '8px', verticalAlign: 'middle' }}>PERSONAL</span>
                            )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 750, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <IconId /> ID: {admin.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 750, color: '#475569', fontSize: '0.9rem' }}>
                    {admin.phone || <span style={{ color: '#cbd5e1' }}>Tidak terdaftar</span>}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Link href={`/admin/kelola-admin/edit/${admin.id}`} className={styles.btnSm} style={{ background: '#f1f5f9', color: '#64748b', textDecoration: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 850, transition: 'all 0.2s' }}>EDIT</Link>
                        {admin.id !== currentUserId && (
                            <button 
                                onClick={() => handleDelete(admin.id)} 
                                disabled={loading}
                                className={styles.btnSm} 
                                style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 850, display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                            >
                                <IconTrash /> HAPUS
                            </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Mobile Fluid View (Cards) */}
      <div className="show-only-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
         {admins.map(admin => (
            <div key={admin.id} style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
                    <div style={{ width: '55px', height: '55px', borderRadius: '16px', background: '#1e3a8a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.4rem' }}>
                        {admin.nama.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', lineHeight: '1.3' }}>
                            {admin.nama.toUpperCase()}
                            {admin.id === currentUserId && <div style={{ fontSize: '0.6rem', color: '#3b82f6', fontWeight: 900, marginTop: '4px' }}>AKUN PERSONAL ANDA</div>}
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginTop: '4px' }}>Akses Full Administrator</div>
                    </div>
                </div>
                
                <div style={{ marginBottom: '24px', padding: '12px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 850, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID Administrator</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#475569', marginTop: '4px' }}>{admin.id}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <Link href={`/admin/kelola-admin/edit/${admin.id}`} style={{ flex: 1, padding: '14px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '14px', fontWeight: 850, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>EDIT AKSES</Link>
                    {admin.id !== currentUserId && (
                        <button onClick={() => handleDelete(admin.id)} style={{ padding: '14px 18px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '14px', fontWeight: 850, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconTrash /></button>
                    )}
                </div>
            </div>
         ))}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-only-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}
