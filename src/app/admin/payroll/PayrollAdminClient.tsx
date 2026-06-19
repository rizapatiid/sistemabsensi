"use client"

import { useState } from "react"
import styles from "@/styles/admin.module.css"
import employeeStyles from "@/styles/employee_home.module.css"
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* ── DARK HERO HEADER ── */}
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                borderRadius: 'clamp(12px, 3vw, 16px)',
                padding: 'clamp(20px, 5vw, 32px)',
                color: '#ffffff',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)'
            }}>
                {/* Geometric accents */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>

                <div className={styles.pengumumanHeaderFlex}>
                    <div className={styles.pengumumanHeaderLeft}>
                        <div className={styles.pengumumanHeaderIcon}>
                            <svg width="clamp(24px, 6vw, 32px)" height="clamp(24px, 6vw, 32px)" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="7" y1="15" x2="7" y2="15"/><line x1="12" y1="15" x2="12" y2="15"/></svg>
                        </div>
                        <div>
                            <h1 className={styles.pengumumanHeaderTitle}>Sistem Payroll</h1>
                            <p className={styles.pengumumanHeaderDesc}>Manajemen penggajian, insentif, dan status pembayaran staf RMP.</p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={() => setShowModal(true)}
                        className={styles.pengumumanHeaderBtn}
                    >
                        <IconPlus /> BUAT SLIP GAJI BARU
                    </button>
                </div>
            </div>

            {/* ── SEARCH & STATS BAR ── */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.02)'
            }}>
                {/* Search input */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <div style={{ position: 'absolute', left: '16px', top: 0, bottom: 0, display: 'flex', alignItems: 'center', color: '#64748b', pointerEvents: 'none' }}>
                        <IconSearch />
                    </div>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Cari nama karyawan atau ID..."
                        style={{
                            width: '100%',
                            padding: '14px 20px 14px 48px',
                            borderRadius: '12px',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: '#0f172a',
                            boxSizing: 'border-box'
                        }}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingLeft: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sudah Dibayar</span>
                        <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 900, border: '1px solid #dcfce7' }}>
                            Rp {totalTerbayar.toLocaleString('id-ID')}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sedang Proses</span>
                        <span style={{ background: '#fff7ed', color: '#ea580c', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 900, border: '1px solid #ffedd5' }}>
                            Rp {pendingGaji.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── PAYROLL LIST ── */}
            <div>
                {filteredPayrolls.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px 40px', background: 'white', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.2 }}>💳</div>
                        <p style={{ color: '#94a3b8', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Data slip gaji tidak ditemukan.</p>
                    </div>
                ) : (
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: 'clamp(16px, 4vw, 24px)',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                    }}>
                        <div className={employeeStyles.announceList}>
                            {filteredPayrolls.map(p => (
                                <div
                                    key={p.id}
                                    className={`${employeeStyles.announceItem} ${styles.adminAnnounceItem}`}
                                    style={{ position: 'relative' }}
                                >
                                    <div className={employeeStyles.announceImageWrapper} style={{ background: '#f8fafc', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                                        {p.user.nama.charAt(0).toUpperCase()}
                                    </div>
                                    <div className={employeeStyles.announceContent}>
                                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                            <span className={employeeStyles.announceDateText}>
                                                Periode {p.bulan}/{p.tahun}
                                            </span>
                                            <span style={{ 
                                                display: 'inline-flex', 
                                                alignItems: 'center', 
                                                padding: '2px 8px', 
                                                borderRadius: '100px',
                                                background: p.statusPembayaran === 'DIBAYAR' ? '#f0fdf4' : '#fff7ed',
                                                border: `1px solid ${p.statusPembayaran === 'DIBAYAR' ? '#dcfce7' : '#ffedd5'}`,
                                                color: p.statusPembayaran === 'DIBAYAR' ? '#16a34a' : '#ea580c',
                                                fontSize: '0.65rem',
                                                fontWeight: 900
                                            }}>
                                                {p.statusPembayaran === 'DIBAYAR' ? 'LUNAS' : 'PROSES'}
                                            </span>
                                        </div>
                                        <h4 className={employeeStyles.announceTitle} style={{ marginBottom: '2px' }}>{p.user.nama.toUpperCase()}</h4>
                                        <p className={employeeStyles.announcePreview} style={{ margin: 0 }}>
                                            <span style={{ fontWeight: 800, color: '#0f172a' }}>Rp {p.totalGaji.toLocaleString("id-ID")}</span> ({p.tipeGaji}) • {(() => {
                                                const bank = p.bankSnapshot || p.user.rekeningBank || '-';
                                                const rek = p.noRekeningSnapshot || p.user.noRekening;
                                                if (rek && rek.length > 5) {
                                                    return `${bank} (${rek.slice(0,3)}...${rek.slice(-3)})`;
                                                }
                                                return rek ? `${bank} (${rek})` : bank;
                                            })()}
                                        </p>
                                    </div>

                                    {/* Admin action buttons */}
                                    <div className={styles.adminAnnounceActions}>
                                        <button
                                            onClick={() => setSelectedPayrollToView(p)}
                                            className={styles.pengumumanActionEdit}
                                            title="Lihat Slip"
                                        >
                                            <IconFileText /> Slip
                                        </button>
                                        <button
                                            disabled={loading === p.id}
                                            onClick={() => handleToggleStatus(p.id, p.statusPembayaran)}
                                            className={styles.pengumumanActionEdit}
                                            style={{ color: p.statusPembayaran === 'DIBAYAR' ? '#16a34a' : '#ea580c', opacity: loading === p.id ? 0.5 : 1 }}
                                            title="Ubah Status"
                                        >
                                            {p.statusPembayaran === 'DIBAYAR' ? <IconClockSmall /> : <IconCheckSmall />} Status
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
                                            className={styles.pengumumanActionDelete}
                                            title="Hapus"
                                        >
                                            <IconTrash /> Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 3. PREMIUM PAYROLL MODAL */}
            {showModal && (
                <div style={{ 
                    position: 'fixed', inset: 0, 
                    background: 'rgba(15, 23, 42, 0.4)', 
                    backdropFilter: 'blur(4px)', 
                    zIndex: 9999, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    padding: '16px',
                    animation: 'fadeIn 0.2s ease-out'
                }} onClick={() => setShowModal(false)}>
                    <div style={{ 
                        background: '#ffffff',
                        width: '100%',
                        maxWidth: '360px',
                        borderRadius: '16px',
                        boxShadow: '0 30px 60px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.05)',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} onClick={e => e.stopPropagation()}>
                        
                        {/* SLEEK TOP ACCENT LINE */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #3b82f6, #1e3a8a)' }} />

                        {/* MINIMALIST HEADER */}
                        <div style={{ padding: '20px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #e2e8f0', flexShrink: 0 }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <IconFileText /> Form Gaji
                                </h3>
                                <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>Penerbitan slip digital otomatis.</p>
                            </div>
                        </div>

                        {/* MODAL BODY (SCROLLABLE) */}
                        <div style={{ overflowY: 'auto', padding: '16px 20px' }}>
                            <PayrollForm users={users} onCancel={() => setShowModal(false)} />
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
                            <div style={{ 
                              position: 'absolute', 
                              top: '50%', 
                              left: '50%', 
                              transform: 'translate(-50%, -50%) rotate(-15deg)', 
                              fontSize: '3.5rem', 
                              fontWeight: '900', 
                              color: 'rgba(30,58,138,0.08)', 
                              pointerEvents: 'none',
                              zIndex: 999,
                              whiteSpace: 'nowrap'
                            }} className="no-print">
                              AUTHENTIC
                            </div>

                            <header className={slipStyles.slipHeader} style={{ position: 'relative', zIndex: 1 }}>
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

                            <div className={slipStyles.infoGrid} style={{ position: 'relative', zIndex: 1 }}>
                                <div className={slipStyles.infoItem}>
                                  <label>Nama</label>
                                  <div className={slipStyles.rowValue}>{selectedPayrollToView.user.nama}</div>
                                </div>
                                <div className={slipStyles.infoItem}>
                                  <label>Posisi</label>
                                  <div className={slipStyles.rowValue}>{selectedPayrollToView.user.jabatan || "-"}</div>
                                </div>
                                <div className={slipStyles.infoItem}>
                                  <label>Periode</label>
                                  <div className={slipStyles.rowValue}>{new Intl.DateTimeFormat("id-ID", { month: "long" }).format(new Date(selectedPayrollToView.tahun, selectedPayrollToView.bulan - 1))} {selectedPayrollToView.tahun}</div>
                                </div>
                                <div className={slipStyles.infoItem}>
                                  <label>Status</label>
                                  <div className={slipStyles.rowValue} style={{ color: selectedPayrollToView.statusPembayaran === 'DIBAYAR' ? '#047857' : '#be123c' }}>
                                    {selectedPayrollToView.statusPembayaran === 'DIBAYAR' ? 'LUNAS' : 'PROSES'}
                                  </div>
                                </div>
                            </div>

                            <div className={slipStyles.tableSection} style={{ position: 'relative', zIndex: 1 }}>
                                <h4>Rincian Upah</h4>
                                <div className={slipStyles.row}>
                                    <span className={slipStyles.rowLabel}>Gaji Pokok ({selectedPayrollToView.tipeGaji})</span>
                                    <span className={slipStyles.rowValue}>Rp {selectedPayrollToView.gajiPokok.toLocaleString("id-ID")}</span>
                                </div>
                                {selectedPayrollToView.tipeGaji === "HARIAN" && (
                                    <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #e2e8f0' }}>
                                      <div className={slipStyles.row} style={{ marginBottom: '4px', borderBottom: 'none', padding: '0 0 4px 0' }}>
                                        <span className={slipStyles.rowLabel} style={{ fontSize: '0.75rem' }}>Total Hadir</span>
                                        <span className={slipStyles.rowValue} style={{ fontSize: '0.75rem' }}>{selectedPayrollToView.jumlahAbsen} Hari</span>
                                      </div>
                                      <div className={slipStyles.row} style={{ borderBottom: 'none', padding: 0 }}>
                                        <span className={slipStyles.rowLabel} style={{ fontWeight: '600' }}>Total Harian</span>
                                        <span className={slipStyles.rowValue} style={{ fontWeight: '600', color: '#1e3a8a' }}>Rp {(selectedPayrollToView.gajiPokok * selectedPayrollToView.jumlahAbsen).toLocaleString("id-ID")}</span>
                                      </div>
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

                            <div className={slipStyles.totalRow} style={{ position: 'relative', zIndex: 1 }}>
                                <div className={slipStyles.totalLabel}>TOTAL DITERIMA (THP)</div>
                                <span className={slipStyles.totalValue}>Rp {selectedPayrollToView.totalGaji.toLocaleString("id-ID")}</span>
                            </div>

                            <div className={slipStyles.bankInfo} style={{ border: '1px solid #e2e8f0', background: '#f8fafc', position: 'relative', zIndex: 1, padding: '0.6rem' }}>
                                <label style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Tujuan Transfer</label>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                    <div style={{ fontWeight: '700', color: '#1e3a8a', fontSize: '0.85rem' }}>{selectedPayrollToView.bankSnapshot || "-"}</div>
                                    <div style={{ color: '#0f172a', fontWeight: '800', fontSize: '0.8rem' }}>{selectedPayrollToView.noRekeningSnapshot || "XXXX-XXXX-XXXX"}</div>
                                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>a.n. {selectedPayrollToView.namaRekeningSnapshot || selectedPayrollToView.user.nama}</div>
                                  </div>
                                </div>
                            </div>

                            <div className={slipStyles.footer} style={{ position: 'relative', zIndex: 1 }}>
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
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    )
}

const IconSearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IconCheckSmall = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
const IconClockSmall = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IconCreditCardSmall = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IconFileText = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
const IconTrash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
