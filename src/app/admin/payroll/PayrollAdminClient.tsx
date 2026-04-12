"use client"

import { useState } from "react"
import styles from "@/styles/admin.module.css"
import PayrollForm from "./PayrollForm"
import { togglePayrollStatusAction, deletePayrollAction } from "@/actions/admin"
import Image from "next/image"
import slipStyles from "@/styles/slip_gaji.module.css"

interface User {
  id: string
  nama: string
  jabatan?: string | null
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
  gajiPokok: number
  tunjangan: number
  keteranganTunjangan: string | null
  totalGaji: number
  statusPembayaran: string
  bankSnapshot: string | null
  noRekeningSnapshot: string | null
  namaRekeningSnapshot: string | null
  createdAt: string
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

export default function PayrollAdminClient({ payrolls: initialPayrolls, users }: { payrolls: Payroll[], users: User[] }) {
    const [showModal, setShowModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [payrolls, setPayrolls] = useState(initialPayrolls)
    const [selectedPayrollToView, setSelectedPayrollToView] = useState<Payroll | null>(null)
    const [loading, setLoading] = useState<string | null>(null)

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        setLoading(id)
        try {
            await togglePayrollStatusAction(id, currentStatus)
            setPayrolls(prev => prev.map(p => 
                p.id === id ? { ...p, statusPembayaran: currentStatus === 'DIBAYAR' ? 'DIPROSES' : 'DIBAYAR' } : p
            ))
        } catch (e) {
            console.error("Gagal toggle status:", e)
        } finally {
            setLoading(null)
        }
    }

    const filteredPayrolls = payrolls.filter(p => 
        p.user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.idKaryawan.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalTerbayar = payrolls.filter(p => p.statusPembayaran === 'DIBAYAR').reduce((acc, p) => acc + p.totalGaji, 0)
    const pendingGaji = payrolls.filter(p => p.statusPembayaran !== 'DIBAYAR').reduce((acc, p) => acc + p.totalGaji, 0)

    return (
        <div className={styles.pageContainer} style={{ background: '#f8fafc', padding: '0px', minHeight: '100vh' }}>
            
            {/* 1. TOP COMMAND BAR - DUAL PANE */}
            <div style={{ padding: 'clamp(12px, 2vw, 24px) clamp(16px, 4vw, 32px) 0 clamp(16px, 4vw, 32px)' }}>
                
                <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    marginBottom: '12px'
                }}>
                    <div style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Financial Hub • Payroll System V2.0</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
                    <div style={{ flex: '1 1 300px' }}>
                        <h1 className={styles.pageTitle} style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                            Sistem Payroll
                        </h1>
                        <p style={{ color: '#64748b', fontWeight: 600, fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginTop: '8px', margin: 0 }}>
                            Manajemen penggajian, insentif, dan status pembayaran staf RMP.
                        </p>
                        
                        <div style={{ marginTop: '24px' }}>
                            <button 
                                onClick={() => setShowModal(true)}
                                className={styles.btnAction}
                                style={{ 
                                    padding: '12px 24px', 
                                    borderRadius: '14px', 
                                    background: '#0f172a', 
                                    color: 'white', 
                                    fontWeight: 900,
                                    fontSize: '0.75rem',
                                    boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                            >
                                <IconPlus /> BUAT SLIP GAJI BARU
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '440px', flex: '1 1 auto' }}>
                        <div className={styles.statPill} style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', flex: 1, padding: '12px', minWidth: 0 }}>
                            <div className={styles.statIcon} style={{ background: '#f0fdf4', color: '#16a34a', width: '36px', height: '36px', minWidth: '36px' }}><IconCheckSmall /></div>
                            <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>Rp {totalTerbayar.toLocaleString('id-ID')}</div>
                                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Sudah Dibayar</div>
                            </div>
                        </div>
                        <div className={styles.statPill} style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', flex: 1, padding: '12px', minWidth: 0 }}>
                            <div className={styles.statIcon} style={{ background: '#fff7ed', color: '#ea580c', width: '36px', height: '36px', minWidth: '36px' }}><IconClockSmall /></div>
                            <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>Rp {pendingGaji.toLocaleString('id-ID')}</div>
                                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Sedang Proses</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. DATA SECTION */}
            <div style={{ padding: '0 clamp(16px, 4vw, 32px) clamp(16px, 4vw, 32px)' }}>
                <div className={styles.card} style={{ borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', padding: '0', overflow: 'hidden' }}>
                    
                    {/* ENHANCED TABLE HEADER - PARITY WITH DAFTAR PERSONIL */}
                    <div className={styles.cardHeader} style={{ 
                        padding: '20px 24px', 
                        borderBottom: '1px solid #f1f5f9', 
                        background: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eff6ff', color: '#3b82f6', width: '32px', height: '32px', borderRadius: '10px' }}>
                                <IconCreditCardSmall />
                            </div>
                            <h3 className={styles.cardTitle} style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900 }}>Riwayat Slip Gaji</h3>
                        </div>

                        <div className={styles.searchBox} style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', maxWidth: '300px', flex: '1 1 250px' }}>
                            <div className={styles.searchIcon} style={{ color: '#94a3b8' }}><IconSearch /></div>
                            <input 
                                type="text"
                                placeholder="Cari nama atau ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                                style={{ fontWeight: 600, fontSize: '0.85rem', height: '42px' }}
                            />
                        </div>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th style={{ background: 'transparent', paddingLeft: '24px' }}>PERIODE</th>
                                    <th style={{ background: 'transparent' }}>KARYAWAN</th>
                                    <th style={{ background: 'transparent' }}>DETAIL GAJI</th>
                                    <th style={{ background: 'transparent' }}>PEMBAYARAN</th>
                                    <th style={{ background: 'transparent' }}>STATUS</th>
                                    <th style={{ background: 'transparent', textAlign: 'right', paddingRight: '24px' }}>MANAJEMEN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayrolls.map(p => (
                                    <tr key={p.id}>
                                        <td style={{ paddingLeft: '24px' }}>
                                            <div style={{ fontWeight: 900, color: '#1e3a8a', fontSize: '1rem', letterSpacing: '-0.01em' }}>{p.bulan}/{p.tahun}</div>
                                        </td>
                                        <td>
                                            <div className={styles.userCell}>
                                                <div className={styles.userAvatar} style={{ 
                                                    borderRadius: '12px', 
                                                    width: '40px', 
                                                    height: '40px', 
                                                    background: '#f8fafc', 
                                                    border: '1px solid #e2e8f0',
                                                    color: '#0f172a',
                                                    fontWeight: 900
                                                }}>
                                                    {p.user.nama.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{p.user.nama.toUpperCase()}</div>
                                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>ID: {p.idKaryawan}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '1.05rem' }}>Rp {p.totalGaji.toLocaleString("id-ID")}</div>
                                            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                                                <span style={{ fontSize: '0.55rem', fontWeight: 900, color: '#64748b', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>{p.tipeGaji}</span>
                                                {p.tipeGaji === "HARIAN" && <span style={{ fontSize: '0.55rem', fontWeight: 900, color: '#3b82f6', background: '#eff6ff', padding: '1px 6px', borderRadius: '4px' }}>{p.jumlahAbsen} HARI</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 800, color: '#475569', fontSize: '0.85rem' }}>{p.bankSnapshot || p.user.rekeningBank || '-'}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{p.noRekeningSnapshot || p.user.noRekening || '-'}</div>
                                        </td>
                                        <td>
                                            <div style={{ 
                                                display: 'inline-flex', 
                                                alignItems: 'center', 
                                                gap: '6px', 
                                                padding: '6px 14px', 
                                                borderRadius: '100px',
                                                background: p.statusPembayaran === 'DIBAYAR' ? '#f0fdf4' : '#fff7ed',
                                                border: `1px solid ${p.statusPembayaran === 'DIBAYAR' ? '#dcfce7' : '#ffedd5'}`,
                                                color: p.statusPembayaran === 'DIBAYAR' ? '#16a34a' : '#ea580c',
                                                fontSize: '0.7rem',
                                                fontWeight: 900
                                            }}>
                                                <div style={{ width: '6px', height: '6px', background: 'currentColor', borderRadius: '50%' }}></div>
                                                {p.statusPembayaran === 'DIBAYAR' ? 'TERBAYAR' : 'PROSES'}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button 
                                                    onClick={() => setSelectedPayrollToView(p)}
                                                    className={styles.btnSm} 
                                                    style={{ background: '#f8fafc', color: '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: '8px' }}
                                                    title="Lihat Detail Slip"
                                                >
                                                    <IconEye />
                                                </button>
                                                
                                                <button 
                                                    disabled={loading === p.id}
                                                    onClick={() => handleToggleStatus(p.id, p.statusPembayaran)}
                                                    className={styles.btnSm} 
                                                    style={{ 
                                                        background: p.statusPembayaran === 'DIBAYAR' ? '#f0fdf4' : '#fff7ed', 
                                                        color: p.statusPembayaran === 'DIBAYAR' ? '#16a34a' : '#ea580c', 
                                                        border: 'none', 
                                                        borderRadius: '8px',
                                                        opacity: loading === p.id ? 0.5 : 1
                                                    }}
                                                    title={p.statusPembayaran === 'DIBAYAR' ? 'Batalkan Status Bayar' : 'Tandai Sebagai Terbayar'}
                                                >
                                                    {p.statusPembayaran === 'DIBAYAR' ? <IconCheckSmall /> : <IconClockSmall />}
                                                </button>

                                                <button 
                                                    onClick={async () => {
                                                        if (confirm(`Hapus permanen slip gaji ${p.user.nama} periode ${p.bulan}/${p.tahun}?`)) {
                                                            const res = await deletePayrollAction(p.id)
                                                            if (res.success) {
                                                                setPayrolls(prev => prev.filter(item => item.id !== p.id))
                                                            } else {
                                                                alert(res.error)
                                                            }
                                                        }
                                                    }}
                                                    className={styles.btnSm} 
                                                    style={{ background: '#fff1f2', color: '#e11d48', border: 'none', borderRadius: '8px', cursor: 'pointer', padding: '8px' }}
                                                    title="Hapus Slip Gaji"
                                                >
                                                    <IconTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredPayrolls.length === 0 && (
                            <div style={{ padding: '100px 24px', textAlign: 'center' }}>
                                <div style={{ background: '#f8fafc', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#cbd5e1' }}><IconPayroll /></div>
                                <div style={{ color: '#94a3b8', fontWeight: 700 }}>Tidak ada data slip gaji yang ditemukan.</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. PREMIUM PAYROLL MODAL */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.25)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div style={{ 
                        background: 'white', 
                        width: '100%', 
                        maxWidth: '480px', 
                        borderRadius: '28px', 
                        overflow: 'hidden', 
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column'
                    }} onClick={e => e.stopPropagation()}>
                        
                        {/* MODAL HEADER */}
                        <div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f8fafc', flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ background: '#eff6ff', color: '#3b82f6', padding: '10px', borderRadius: '12px', display: 'flex' }}><IconPlus /></div>
                                <div>
                                    <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.05rem', color: '#0f172a' }}>Input Data Gaji</h3>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>Generate slip gaji digital baru.</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
                                <IconX />
                            </button>
                        </div>

                        {/* MODAL BODY (SCROLLABLE) */}
                        <div style={{ padding: '24px', overflowY: 'auto' }}>
                            <PayrollForm users={users} />
                        </div>
                    </div>
                </div>
            )}

            {/* 4. EXACT COPY OF EMPLOYEE SLIP PREVIEW MODAL */}
            {selectedPayrollToView && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 99999, padding: "16px"
                }} onClick={() => setSelectedPayrollToView(null)}>
                    <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <div className={slipStyles.slipContainer} style={{ margin: 0 }}>
                            <div style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%) rotate(-15deg)', fontSize: '3.5rem', fontWeight: '900', color: 'rgba(30,58,138,0.05)', pointerEvents: 'none', zIndex: 0, whiteSpace: 'nowrap' }} className="no-print">
                                AUTHENTIC
                            </div>

                            <header className={slipStyles.slipHeader}>
                                <div className={slipStyles.brand}>
                                    <Image src="/iconapps.png" alt="Logo" width={32} height={32} className={slipStyles.logo} />
                                    <div>
                                        <div className={slipStyles.brandName}>Riza Media Productions</div>
                                        <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: '600', letterSpacing: '0.01em' }}>OFFICIAL DOCUMENT</div>
                                    </div>
                                </div>
                                <div className={slipStyles.slipTitle}>
                                    <h2>SLIP GAJI</h2>
                                    <div className={slipStyles.slipNumber}>PAY-{String(selectedPayrollToView.bulan).padStart(2, '0')}{selectedPayrollToView.tahun.toString().slice(-2)}</div>
                                </div>
                            </header>

                            <div className={slipStyles.infoGrid}>
                                <div className={slipStyles.infoItem}><label>Nama</label><div className={slipStyles.rowValue}>{selectedPayrollToView.user.nama}</div></div>
                                <div className={slipStyles.infoItem}><label>Posisi</label><div className={slipStyles.rowValue}>{selectedPayrollToView.user.jabatan || "-"}</div></div>
                                <div className={slipStyles.infoItem}><label>Periode</label><div className={slipStyles.rowValue}>{new Intl.DateTimeFormat("id-ID", { month: "long" }).format(new Date(selectedPayrollToView.tahun, selectedPayrollToView.bulan - 1))} {selectedPayrollToView.tahun}</div></div>
                                <div className={slipStyles.infoItem}><label>Status</label><div>
                                    <span className={`${slipStyles.statusBadge} ${selectedPayrollToView.statusPembayaran === 'DIBAYAR' ? slipStyles.statusLunas : slipStyles.statusPending}`}>
                                        {selectedPayrollToView.statusPembayaran === 'DIBAYAR' ? 'LUNAS' : 'PROSES'}
                                    </span>
                                </div></div>
                            </div>

                            <div className={slipStyles.tableSection}>
                                <h4>Rincian Upah</h4>
                                <div className={slipStyles.row}>
                                    <span className={slipStyles.rowLabel}>Gaji Pokok ({selectedPayrollToView.tipeGaji})</span>
                                    <span className={slipStyles.rowValue}>Rp {selectedPayrollToView.gajiPokok.toLocaleString("id-ID")}</span>
                                </div>
                                {selectedPayrollToView.tipeGaji === "HARIAN" && (
                                    <div className={slipStyles.row} style={{ background: '#f8fafc', padding: '4px 6px', borderRadius: '4px' }}>
                                        <span className={slipStyles.rowLabel}>Total Hadir</span>
                                        <span className={slipStyles.rowValue}>{selectedPayrollToView.jumlahAbsen} Hari</span>
                                    </div>
                                )}
                                <div className={slipStyles.row}>
                                    <span className={slipStyles.rowLabel}>
                                        Tunjangan/Bonus
                                        {selectedPayrollToView.keteranganTunjangan && <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{selectedPayrollToView.keteranganTunjangan}</div>}
                                    </span>
                                    <span className={slipStyles.rowValue}>Rp {selectedPayrollToView.tunjangan.toLocaleString("id-ID")}</span>
                                </div>
                            </div>

                            <div className={slipStyles.totalRow}>
                                <div className={slipStyles.totalLabel}>TOTAL DITERIMA (THP)</div>
                                <span className={slipStyles.totalValue}>Rp {selectedPayrollToView.totalGaji.toLocaleString("id-ID")}</span>
                            </div>

                            <div className={slipStyles.bankInfo} style={{ border: '1px solid #e2e8f0', background: '#f8fafc', padding: '0.6rem' }}>
                                <label style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Tujuan Transfer</label>
                                <div style={{ fontWeight: '700', color: '#1e3a8a', fontSize: '0.85rem' }}>{selectedPayrollToView.bankSnapshot || "-"}</div>
                                <div style={{ color: '#0f172a', fontWeight: '800', fontSize: '0.8rem' }}>{selectedPayrollToView.noRekeningSnapshot || "XXXX-XXXX-XXXX"}</div>
                                <div style={{ color: '#64748b', fontSize: '0.7rem' }}>a.n. {selectedPayrollToView.namaRekeningSnapshot || selectedPayrollToView.user.nama}</div>
                            </div>

                            <div className={slipStyles.footer}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                                    <div style={{ textAlign: 'left' }}><p>Diterbitkan:</p><p style={{ fontWeight: '700', color: '#1e293b' }}>{new Intl.DateTimeFormat("id-ID", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(selectedPayrollToView.createdAt))}</p></div>
                                    <div style={{ textAlign: 'center', minWidth: '100px' }}>
                                        <p style={{ marginBottom: '30px' }}>Administrasi,</p>
                                        <div style={{ height: '1px', width: '100%', background: '#1e293b' }}></div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.55rem', color: '#94a3b8', lineHeight: 1.4, borderTop: '1px dashed #e2e8f0', paddingTop: '0.5rem' }}>
                                    &copy; {new Date().getFullYear()} PT. Riza Media Productions.<br/>Dokumen digital sah tanpa tanda tangan basah.
                                </div>
                            </div>
                            
                            <div className={slipStyles.actionButtons} style={{ marginTop: '20px' }}>
                                <button onClick={() => window.print()} className={slipStyles.printBtn}>Cetak PDF</button>
                                <button onClick={() => setSelectedPayrollToView(null)} className={slipStyles.closeBtn}>Tutup</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @media (max-width: 768px) {
                    .dataTable th { font-size: 0.65rem; padding: 12px 16px; }
                    .dataTable td { padding: 16px; }
                }
            `}</style>
        </div>
    )
}

const IconSearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IconCheckSmall = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
const IconClockSmall = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconCreditCardSmall = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IconEye = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IconTrash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
