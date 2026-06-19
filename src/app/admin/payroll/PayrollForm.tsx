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
const IconShieldForm = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
)
const IconSettingsForm = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
)
const IconFileTextForm = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
)
const IconTagForm = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
)
const IconPlusForm = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
)
const IconCopyForm = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
)
const IconCheckForm = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
)

export default function PayrollForm({ users, onCancel }: { users: User[], onCancel?: () => void }) {
  const [tipeGaji, setTipeGaji] = useState("BULANAN")
  const [modeAbsen, setModeAbsen] = useState("AUTO")
  const [loading, setLoading] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState("")
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
  }
  
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
            background: 'white', padding: '40px', borderRadius: '16px', maxWidth: '400px', width: '100%',
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

      <style dangerouslySetInnerHTML={{ __html: `
        /* Hide arrows on number inputs */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] {
          -moz-appearance: textfield;
        }

        /* Premium Form Classes */
        .pf-label {
            font-size: 0.75rem;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
            display: block;
        }
        .pf-input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }
        .pf-input-icon {
            position: absolute;
            left: 12px;
            color: #94a3b8;
            display: flex;
            pointer-events: none;
            transition: color 0.2s;
            transform: scale(0.9);
        }
        .pf-input {
            width: 100%;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 12px;
            font-size: 0.85rem;
            font-weight: 600;
            color: #0f172a;
            outline: none;
            transition: all 0.2s ease;
            box-shadow: 0 1px 2px rgba(0,0,0,0.01) inset;
        }
        .pf-input:hover {
            border-color: #cbd5e1;
            background: #ffffff;
        }
        .pf-input:focus {
            background: #ffffff;
            border-color: #3b82f6;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 1px 2px rgba(0,0,0,0.01) inset;
        }
        .pf-input-wrapper:focus-within .pf-input-icon {
            color: #3b82f6;
        }
        .pf-input.with-icon {
            padding-left: 38px;
        }
        .pf-select {
            appearance: none;
            cursor: pointer;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 10px center;
            padding-right: 32px;
        }
        .pf-bank-card {
            margin-top: 8px;
            padding: 10px;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: white;
            box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.15);
        }
        .pf-divider {
            height: 1px;
            background: linear-gradient(90deg, rgba(226,232,240,0) 0%, #e2e8f0 50%, rgba(226,232,240,0) 100%);
            margin: 16px 0;
            width: 100%;
        }
        .pf-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
      ` }} />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* SCROLLABLE INPUT AREA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '20px' }}>
            
            {/* KARYAWAN */}
            <div>
                <label className="pf-label">Pilih Karyawan</label>
                <div className="pf-input-wrapper">
                    <div className="pf-input-icon"><IconUserForm /></div>
                    <select 
                        className="pf-input pf-select with-icon"
                        name="idKaryawan" required value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}
                    >
                        <option value="">-- Silakan Pilih Karyawan --</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.nama} ({u.id})</option>)}
                    </select>
                </div>
                {activeUser && (
                    <div className="pf-bank-card">
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '8px', display: 'flex' }}><IconCreditCardForm /></div>
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                            {activeUser.rekeningBank && activeUser.noRekening ? (
                                <>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', lineHeight: '1.2' }}>{activeUser.rekeningBank} - {activeUser.noRekening}</div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 500, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '3px' }}>A/N: {activeUser.namaRekening || activeUser.nama}</div>
                                </>
                            ) : (
                                <div style={{ color: '#fca5a5', fontSize: '0.75rem', fontWeight: 700 }}>Rekening belum diatur!</div>
                            )}
                        </div>
                        {activeUser.noRekening && (
                            <button 
                                type="button"
                                onClick={() => handleCopy(activeUser.noRekening!)}
                                style={{
                                    background: copied ? '#10b981' : 'rgba(255,255,255,0.1)',
                                    color: 'white', border: 'none', borderRadius: '6px', padding: '6px',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                                    marginLeft: '4px'
                                }}
                                title="Salin No Rekening"
                            >
                                {copied ? <IconCheckForm /> : <IconCopyForm />}
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="pf-divider" />

            {/* PERIODE */}
            <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                    <label className="pf-label">Bulan</label>
                    <div className="pf-input-wrapper">
                        <div className="pf-input-icon"><IconCalendarForm /></div>
                        <select className="pf-input pf-select with-icon" name="bulan" required defaultValue={new Date().getMonth() + 1}>
                            {bulanList.map(b => <option key={b.v} value={b.v}>{b.l}</option>)}
                        </select>
                    </div>
                </div>
                <div style={{ flex: 1 }}>
                    <label className="pf-label">Tahun</label>
                    <div className="pf-input-wrapper">
                        <div className="pf-input-icon"><IconCalendarForm /></div>
                        <select className="pf-input pf-select with-icon" name="tahun" required defaultValue={currentYear}>
                            {tahunList.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="pf-divider" />

            {/* PERHITUNGAN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                    <label className="pf-label">Skema Gaji</label>
                    <div className="pf-input-wrapper">
                        <div className="pf-input-icon"><IconSettingsForm /></div>
                        <select className="pf-input pf-select with-icon" name="tipeGaji" value={tipeGaji} onChange={(e) => setTipeGaji(e.target.value)} required>
                            <option value="BULANAN">Bulanan (Tetap)</option>
                            <option value="HARIAN">Harian (Pro-rata)</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="pf-label">Gaji Dasar (Rp)</label>
                    <div className="pf-input-wrapper">
                        <div className="pf-input-icon"><IconWalletForm /></div>
                        <input className="pf-input with-icon" type="number" name="gajiPokok" placeholder="Contoh: 4500000" required />
                    </div>
                </div>
            </div>

            {tipeGaji === "HARIAN" && (
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    <label className="pf-label" style={{ marginBottom: '2px', color: '#475569' }}>Kehadiran (Hari Kerja)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div className="pf-input-wrapper" style={{ flex: 1 }}>
                            <div className="pf-input-icon"><IconFileTextForm /></div>
                            <select className="pf-input pf-select with-icon" style={{ background: 'white' }} name="modeAbsen" value={modeAbsen} onChange={(e) => setModeAbsen(e.target.value)}>
                                <option value="AUTO">Otomatis Sistem</option>
                                <option value="MANUAL">Input Manual</option>
                            </select>
                        </div>
                        {modeAbsen === "MANUAL" && (
                            <input className="pf-input" style={{ width: '90px', background: 'white', textAlign: 'center', paddingLeft: '12px', paddingRight: '12px' }} type="number" name="jumlahAbsen" placeholder="Hari" min="0" />
                        )}
                    </div>
                </div>
            )}

            <div className="pf-divider" />

            {/* BONUS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                    <label className="pf-label">Insentif / Tunjangan Tambahan (Rp)</label>
                    <div className="pf-input-wrapper">
                        <div className="pf-input-icon"><IconPlusForm /></div>
                        <input className="pf-input with-icon" type="number" name="tunjangan" placeholder="0" defaultValue="0" />
                    </div>
                </div>
                <div>
                    <label className="pf-label">Keterangan Tambahan</label>
                    <div className="pf-input-wrapper">
                        <div className="pf-input-icon"><IconTagForm /></div>
                        <input className="pf-input with-icon" type="text" name="ketTunjangan" placeholder="Opsional, cth: Bonus Lembur" />
                    </div>
                </div>
            </div>
        </div>
        
        {/* STICKY FOOTER ACTION */}
        <div style={{ 
            position: 'sticky', 
            bottom: '-20px', 
            margin: '0 -20px -20px -20px', 
            padding: '16px 20px', 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(226, 232, 240, 0.8)',
            zIndex: 10,
            display: 'flex',
            gap: '8px'
        }}>
            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    style={{
                        flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', padding: '14px', borderRadius: '8px',
                        fontWeight: 800, fontSize: '0.85rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: loading ? 0.7 : 1
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'}
                    onMouseOut={e => e.currentTarget.style.background = '#f1f5f9'}
                >
                    BATAL
                </button>
            )}
            <button 
                type="submit" 
                disabled={loading} 
                style={{ 
                    flex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center', 
                    padding: '14px', 
                    fontSize: '0.85rem', 
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    color: 'white',
                    fontWeight: 800,
                    boxShadow: '0 8px 16px -4px rgba(15, 23, 42, 0.3)',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.2s transform 0.1s'
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 20px -4px rgba(15, 23, 42, 0.4)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(15, 23, 42, 0.3)'; }}
                onMouseDown={e => e.currentTarget.style.transform = 'translateY(1px)'}
            >
                {loading ? "MEMPROSES..." : "TERBITKAN"}
            </button>
        </div>
      </form>
    </div>
  )
}
