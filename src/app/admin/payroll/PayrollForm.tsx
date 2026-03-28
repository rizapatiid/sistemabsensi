"use client"

import { useState } from "react"
import styles from "@/styles/admin.module.css"
import { generatePayrollAction } from "@/actions/admin"

type User = { id: string; nama: string; rekeningBank?: string | null; noRekening?: string | null; namaRekening?: string | null }

const IconUserForm = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)

const IconCalendarForm = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
)

const IconWalletForm = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>
)

const IconCreditCardForm = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
)

const IconSettingsForm = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
)

const IconFileTextForm = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
)

const IconShieldForm = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
)

export default function PayrollForm({ users }: { users: User[] }) {
  const [tipeGaji, setTipeGaji] = useState("BULANAN")
  const [modeAbsen, setModeAbsen] = useState("AUTO")
  const [loading, setLoading] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState("")
  
  const activeUser = users.find(u => u.id === selectedUserId)
  const bulanList = [
    { v: 1, l: "Januari" }, { v: 2, l: "Februari" }, { v: 3, l: "Maret" },
    { v: 4, l: "April" }, { v: 5, l: "Mei" }, { v: 6, l: "Juni" },
    { v: 7, l: "Juli" }, { v: 8, l: "Agustus" }, { v: 9, l: "September" },
    { v: 10, l: "Oktober" }, { v: 11, l: "November" }, { v: 12, l: "Desember" }
  ]
  const currentYear = new Date().getFullYear()
  const tahunList = [currentYear - 1, currentYear, currentYear + 1]

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      const res = await generatePayrollAction(formData)
      if (res?.error) {
        setStatusMsg({ type: 'error', text: res.error })
      } else {
        setStatusMsg({ type: 'success', text: "Slip Gaji digital berhasil terbit & email terkirim!" })
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: "Terjadi kesalahan sistem yang tidak terduga." })
    }
    setLoading(false)
  }

  const handleCloseStatus = () => {
    if (statusMsg?.type === 'success') {
      window.location.reload()
    } else {
      setStatusMsg(null)
    }
  }

  return (
    <div style={{ width: "100%" }}>
      {/* PRESTIGOUS STATUS MODAL */}
      {statusMsg && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            background: 'white', padding: '40px', borderRadius: '24px', maxWidth: '400px', width: '100%',
            textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid #f1f5f9',
            animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{
              width: '80px', height: '80px', background: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
            }}>
              {statusMsg.type === 'success' ? (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              )}
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 12px' }}>
              {statusMsg.type === 'success' ? 'Berhasil!' : 'Terjadi Kesalahan'}
            </h3>
            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
              {statusMsg.text}
            </p>
            <button onClick={handleCloseStatus} style={{
              width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: '#1e3a8a',
              color: 'white', fontWeight: 850, fontSize: '1rem', cursor: 'pointer', transition: 'transform 0.2s ease',
              boxShadow: '0 10px 15px -3px rgba(30, 58, 138, 0.3)'
            }}>
              {statusMsg.type === 'success' ? 'LANJUTKAN' : 'COBA LAGI'}
            </button>
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes modalSlideUp {
              from { opacity: 0; transform: translateY(30px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          ` }} />
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Section: Penerima */}
        <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ color: '#1e3a8a', display: 'flex' }}><IconUserForm /></div>
                <label style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0f172a' }}>Filter Nama Karyawan</label>
            </div>
            <select 
                className={styles.filterPill} 
                style={{ width: '100%', appearance: 'none', background: 'white', padding: '10px 16px' }}
                name="idKaryawan" 
                required 
                value={selectedUserId} 
                onChange={e => setSelectedUserId(e.target.value)}
            >
                <option value="">-- Cari Nama Staff --</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.nama} ({u.id})</option>)}
            </select>

            {activeUser && (
            <div style={{ marginTop: '10px', padding: '10px 14px', background: 'white', borderRadius: '10px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#e0e7ff', padding: '8px', borderRadius: '8px', color: '#1e3a8a', display: 'flex' }}><IconCreditCardForm /></div>
                <div>
                {activeUser.rekeningBank && activeUser.noRekening ? (
                    <>
                        <div style={{ fontSize: '0.85rem', fontWeight: 850, color: '#1e3a8a' }}>{activeUser.rekeningBank} - {activeUser.noRekening}</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>A/N: {activeUser.namaRekening || activeUser.nama}</div>
                    </>
                ) : (
                    <div style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 800 }}>Peringatan: Rekening Bank Belum Diatur!</div>
                )}
                </div>
            </div>
            )}
        </div>

        {/* Section: Periode & Gaji */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#fff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ color: '#1e3a8a', display: 'flex' }}><IconCalendarForm /></div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 850, color: '#0f172a' }}>Bulan</label>
                </div>
                <select className={styles.filterPill} style={{ width: '100%', appearance: 'none', padding: '10px 16px' }} name="bulan" required defaultValue={new Date().getMonth() + 1}>
                    {bulanList.map(b => <option key={b.v} value={b.v}>{b.l}</option>)}
                </select>
            </div>
            <div style={{ background: '#fff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ color: '#1e3a8a', display: 'flex' }}><IconShieldForm /></div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 850, color: '#0f172a' }}>Tahun</label>
                </div>
                <select className={styles.filterPill} style={{ width: '100%', appearance: 'none', padding: '10px 16px' }} name="tahun" required defaultValue={currentYear}>
                    {tahunList.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#fff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ color: '#1e3a8a', display: 'flex' }}><IconSettingsForm /></div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 850, color: '#0f172a' }}>Tipe</label>
                </div>
                <select className={styles.filterPill} style={{ width: '100%', appearance: 'none', padding: '10px 16px' }} name="tipeGaji" value={tipeGaji} onChange={(e) => setTipeGaji(e.target.value)} required>
                    <option value="BULANAN">BULANAN (FIX)</option>
                    <option value="HARIAN">HARIAN (PRO)</option>
                </select>
            </div>
            <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ color: '#16a34a', display: 'flex' }}><IconWalletForm /></div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 850, color: '#166534' }}>Gapok (Rp)</label>
                </div>
                <input className={styles.filterPill} style={{ width: '100%', border: '1px solid #86efac', background: '#fff', padding: '10px 16px' }} type="number" name="gajiPokok" placeholder="Contoh: 4500000" required />
            </div>
        </div>

        {/* Conditional: Harian Mode Compact */}
        {tipeGaji === "HARIAN" && (
          <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '12px', border: '1px solid #fde68a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ color: '#d97706', display: 'flex' }}><IconFileTextForm /></div>
                <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#92400e' }}>Kehadiran</label>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
               <select className={styles.filterPill} style={{ flex: 2, appearance: 'none', background: 'white', padding: '10px' }} name="modeAbsen" value={modeAbsen} onChange={(e) => setModeAbsen(e.target.value)}>
                    <option value="AUTO">OTOMATIS</option>
                    <option value="MANUAL">MANUAL</option>
                </select>
                {modeAbsen === "MANUAL" && (
                    <input className={styles.filterPill} style={{ flex: 1, background: 'white', padding: '10px' }} type="number" name="jumlahAbsen" placeholder="Hari" min="0" />
                )}
            </div>
          </div>
        )}

        {/* Section: Bonus Compact */}
        <div style={{ display: 'flex', gap: '14px', background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 120px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'block' }}>Insentif (Rp)</label>
            <input className={styles.filterPill} style={{ width: '100%', background: 'white', padding: '10px 16px' }} type="number" name="tunjangan" placeholder="Rp" defaultValue="0" />
          </div>
          <div style={{ flex: '2 1 180px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'block' }}>Keterangan</label>
            <input className={styles.filterPill} style={{ width: '100%', background: 'white', padding: '10px 16px' }} type="text" name="ketTunjangan" placeholder="Contoh: Bonus Target" />
          </div>
        </div>
        
        <button 
            type="submit" 
            disabled={loading} 
            className={styles.btnAction} 
            style={{ 
                marginTop: "10px", 
                justifyContent: 'center', 
                padding: '14px', 
                fontSize: '1rem', 
                borderRadius: '12px',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 8px 16px -4px rgba(30, 58, 138, 0.4)',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
            }}
        >
          {loading ? "MENGHITUNG..." : "GENERATE PAYROLL"}
        </button>
      </form>
    </div>
  )
}
