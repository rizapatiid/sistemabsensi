"use client"

import { useState } from "react"
import styles from "@/styles/admin.module.css"
import PayrollForm from "./PayrollForm"
import { togglePayrollStatusAction } from "@/actions/admin"

interface User {
  id: string
  nama: string
  rekeningBank?: string | null
  noRekening?: string | null
  namaRekening?: string | null
}

interface Payroll {
  id: string
  bulan: number
  tahun: number
  idKaryawan: string
  tipeGaji: string
  jumlahAbsen: number
  tunjangan: number
  totalGaji: number
  statusPembayaran: string
  user: User
}

const IconPayroll = () => (
    <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="7" y1="15" x2="7" y2="15"/><line x1="12" y1="15" x2="12" y2="15"/></svg>
    </div>
)

const IconCheck = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
)

const IconClock = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
)

const IconPlus = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
)

export default function PayrollAdminClient({ payrolls, users }: { payrolls: Payroll[], users: User[] }) {
  const [showModal, setShowModal] = useState(false)

  const totalTerbayar = payrolls.filter(p => p.statusPembayaran === 'LUNAS').reduce((acc, p) => acc + p.totalGaji, 0)
  const pendingGaji = payrolls.filter(p => p.statusPembayaran !== 'LUNAS').reduce((acc, p) => acc + p.totalGaji, 0)

  return (
    <div style={{ padding: '0px' }}>
      {/* HEADER & STATS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <IconPayroll />
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.04em' }}>Sistem Payroll</h1>
          </div>
          <p style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600, marginTop: '12px', marginLeft: '2px' }}>
            Manajemen penggajian, insentif, dan status pembayaran staf RMP.
          </p>
          
          <div style={{ marginTop: '24px' }}>
              <button 
                onClick={() => setShowModal(true)}
                className={styles.btnAction}
                style={{ padding: '12px 24px', borderRadius: '14px', boxShadow: '0 10px 15px -3px rgba(30, 58, 138, 0.2)' }}
              >
                  <IconPlus />
                  Buat Slip Gaji Baru
              </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', width: '100%', maxWidth: '500px' }}>
            <div className={styles.statPill} style={{ flex: 1, borderColor: '#dcfce7', minWidth: '220px' }}>
                <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}><IconCheck /></div>
                <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a' }}>Rp {totalTerbayar.toLocaleString('id-ID')}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Lunas Terbayar</div>
                </div>
            </div>
            
            <div className={styles.statPill} style={{ flex: 1, borderColor: '#fff7ed', minWidth: '220px' }}>
                <div className={styles.statIcon} style={{ background: '#fff7ed', color: '#ea580c' }}><IconClock /></div>
                <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a' }}>Rp {pendingGaji.toLocaleString('id-ID')}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginTop: '4px' }}>Menunggu Bayar</div>
                </div>
            </div>
        </div>
      </div>

      {/* TABLE DATA */}
      <h3 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 800, paddingLeft: '8px' }}>Riwayat Slip Gaji</h3>
      <div className={styles.card} style={{ border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ background: '#fcfcfd' }}>PERIODE</th>
                <th style={{ background: '#fcfcfd' }}>INFORMASI KARYAWAN</th>
                <th style={{ background: '#fcfcfd' }}>DETAIL GAJI</th>
                <th style={{ background: '#fcfcfd' }}>REKENING BANK</th>
                <th style={{ background: '#fcfcfd' }}>STATUS</th>
                <th style={{ background: '#fcfcfd', textAlign: 'right' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 850, color: '#0f172a', fontSize: '1rem' }}>
                    {p.bulan}/{p.tahun}
                  </td>
                  <td>
                    <div className={styles.userCell}>
                        <div className={styles.userAvatar} style={{ borderRadius: '50%', width: '42px', height: '42px', border: '2px solid #f8fafc' }}>{p.user.nama.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.95rem' }}>{p.user.nama.toUpperCase()}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700' }}>{p.idKaryawan}</div>
                        </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 900, color: '#16a34a', fontSize: '1.1rem' }}>Rp {p.totalGaji.toLocaleString("id-ID")}</div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>{p.tipeGaji}</span>
                        {p.tipeGaji === "HARIAN" && <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#1e3a8a', background: '#e0e7ff', padding: '2px 8px', borderRadius: '4px' }}>{p.jumlahAbsen} HARI</span>}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem' }}>{p.user.rekeningBank || '-'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>{p.user.noRekening || '-'}</div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${p.statusPembayaran === 'LUNAS' ? styles.badgeHadir : styles.badgeIzin}`} style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '0.75rem' }}>
                      {p.statusPembayaran}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <form action={togglePayrollStatusAction.bind(null, p.id, p.statusPembayaran)}>
                      <button type="submit" className={styles.btnSm} style={{ 
                        background: p.statusPembayaran === 'LUNAS' ? '#f1f5f9' : '#1e3a8a',
                        color: p.statusPembayaran === 'LUNAS' ? '#64748b' : 'white',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        fontWeight: 850
                      }}>
                        {p.statusPembayaran === "LUNAS" ? "BELUM LUNAS" : "SET LUNAS"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {payrolls.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "120px", color: "#94a3b8", fontWeight: "700", fontSize: '1rem' }}>
                    Belum ada rekaman data payroll yang tersimpan dalam sistem.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL POPUP (COMPACT & SCROLLABLE) */}
      {showModal && (
        <div className={styles.imageModal} style={{ alignItems: 'center' }} onClick={() => setShowModal(false)}>
            <div className={styles.card} style={{ 
                maxWidth: '600px', 
                width: '95%', 
                maxHeight: '90vh', 
                overflowY: 'auto', 
                padding: '28px', 
                position: 'relative' 
            }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#94a3b8' }}>×</button>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Input Data Gaji</h2>
                    <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.85rem', marginTop: '6px' }}>Lengkapi formulir untuk mencetak slip baru.</p>
                </div>
                <PayrollForm users={users} />
            </div>
        </div>
      )}
    </div>
  )
}
