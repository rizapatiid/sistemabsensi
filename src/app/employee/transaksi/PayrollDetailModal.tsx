"use client"

import { useState } from "react"
import Image from "next/image"
import styles from "@/styles/slip_gaji.module.css"

interface PayrollDetail {
  id: string
  bulan: number
  tahun: number
  tipeGaji: string
  jumlahAbsen: number
  gajiPokok: number
  tunjangan: number
  keteranganTunjangan: string | null
  totalGaji: number
  statusPembayaran: string
  nama: string
  jabatan: string | null
  namaRekening: string | null
  bankSnapshot: string | null
  noRekeningSnapshot: string | null
  namaRekeningSnapshot: string | null
  createdAt?: Date | string
}

const IconEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
)

export default function PayrollDetailModal({ p, autoOpen = false, children }: { p: PayrollDetail, autoOpen?: boolean, children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(autoOpen)

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  const monthName = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(new Date(p.tahun, p.bulan - 1));
  
  // Format creation date properly
  const createdDate = p.createdAt ? new Intl.DateTimeFormat("id-ID", { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  }).format(new Date(p.createdAt)) + " " + new Intl.DateTimeFormat("id-ID", {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(p.createdAt)) : "N/A";

  return (
    <>
      {children ? (
        <div onClick={openModal} style={{ cursor: "pointer" }}>
          {children}
        </div>
      ) : (
        <button 
          onClick={openModal}
          className={styles.viewBtn} 
          style={{ 
            backgroundColor: "#0f172a", 
            color: "white", 
            border: "none", 
            padding: "6px 14px", 
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.75rem",
            fontWeight: "700",
            boxShadow: "0 2px 4px rgba(15, 23, 42, 0.2)",
            transition: "all 0.2s",
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <IconEye />
          Lihat Slip
        </button>
      )}

      {isOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "0.5rem"
        }} onClick={closeModal} className="no-print-bg print-modal-overlay">
          <div className={`${styles.slipContainer} print-modal-content`} onClick={e => e.stopPropagation()}>
            
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

            {/* Header */}
            <header className={styles.slipHeader} style={{ position: 'relative', zIndex: 1 }}>
              <div className={styles.brand}>
                <Image src="/iconapps.png" alt="Logo" width={32} height={32} className={styles.logo} />
                <div>
                  <div className={styles.brandName}>Riza Media Productions</div>
                  <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: '600', letterSpacing: '0.01em' }}>OFFICIAL DOCUMENT</div>
                </div>
              </div>
              <div className={styles.slipTitle}>
                <h2>SLIP GAJI</h2>
                <div className={styles.slipNumber}>PAY-{String(p.bulan).padStart(2, '0')}{p.tahun.toString().slice(-2)}</div>
              </div>
            </header>

            {/* Employee Info Section */}
            <div className={styles.infoGrid} style={{ position: 'relative', zIndex: 1 }}>
              <div className={styles.infoItem}>
                <label>Nama</label>
                <div className={styles.rowValue}>{p.nama}</div>
              </div>
              <div className={styles.infoItem}>
                <label>Posisi</label>
                <div className={styles.rowValue}>{p.jabatan || "Karyawan"}</div>
              </div>
              <div className={styles.infoItem}>
                <label>Periode</label>
                <div className={styles.rowValue}>{monthName} {p.tahun}</div>
              </div>
              <div className={styles.infoItem}>
                <label>Status</label>
                <div className={styles.rowValue} style={{ color: p.statusPembayaran === 'DIBAYAR' ? '#047857' : '#be123c' }}>
                  {p.statusPembayaran === 'DIBAYAR' ? 'LUNAS' : 'PROSES'}
                </div>
              </div>
            </div>

            {/* Income Details */}
            <div className={styles.tableSection} style={{ position: 'relative', zIndex: 1 }}>
              <h4>Rincian Upah</h4>
              
              <div className={styles.row}>
                <span className={styles.rowLabel}>Gaji Pokok ({p.tipeGaji})</span>
                <span className={styles.rowValue}>Rp {p.gajiPokok.toLocaleString("id-ID")}</span>
              </div>
              
              {p.tipeGaji === "HARIAN" && (
                <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #e2e8f0' }}>
                  <div className={styles.row} style={{ marginBottom: '4px', borderBottom: 'none', padding: '0 0 4px 0' }}>
                    <span className={styles.rowLabel} style={{ fontSize: '0.75rem' }}>Total Hadir</span>
                    <span className={styles.rowValue} style={{ fontSize: '0.75rem' }}>{p.jumlahAbsen} Hari</span>
                  </div>
                  <div className={styles.row} style={{ borderBottom: 'none', padding: 0 }}>
                    <span className={styles.rowLabel} style={{ fontWeight: '600' }}>Total Harian</span>
                    <span className={styles.rowValue} style={{ fontWeight: '600', color: '#1e3a8a' }}>Rp {(p.gajiPokok * p.jumlahAbsen).toLocaleString("id-ID")}</span>
                  </div>
                </div>
              )}

              <div className={styles.row}>
                <span className={styles.rowLabel}>
                  Tunjangan/Bonus
                  {p.keteranganTunjangan && <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{p.keteranganTunjangan}</div>}
                </span>
                <span className={styles.rowValue}>Rp {p.tunjangan.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Total Section */}
            <div className={styles.totalRow} style={{ position: 'relative', zIndex: 1 }}>
              <div className={styles.totalLabel}>TOTAL DITERIMA (THP)</div>
              <span className={styles.totalValue}>Rp {p.totalGaji.toLocaleString("id-ID")}</span>
            </div>

            {/* Bank Snapshot */}
            <div className={styles.bankInfo} style={{ border: '1px solid #e2e8f0', background: '#f8fafc', position: 'relative', zIndex: 1, padding: '0.6rem' }}>
              <label style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '800', display: 'block', marginBottom: '4px' }}>Tujuan Transfer</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '700', color: '#1e3a8a', fontSize: '0.85rem' }}>{p.bankSnapshot || "N/A"}</div>
                  <div style={{ color: '#0f172a', fontWeight: '800', fontSize: '0.8rem' }}>{p.noRekeningSnapshot || "XXXX-XXXX-XXXX"}</div>
                  <div style={{ color: '#64748b', fontSize: '0.7rem' }}>a.n. {p.namaRekeningSnapshot || p.nama}</div>
                </div>
              </div>
            </div>

            {/* Footer / Signature Area */}
            <div className={styles.footer} style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'left' }}>
                  <p>Diterbitkan:</p>
                  <p style={{ fontWeight: '700', color: '#1e293b' }}>{createdDate}</p>
                </div>
                <div style={{ textAlign: 'center', minWidth: '100px' }}>
                  <p style={{ marginBottom: '30px' }}>Administrasi,</p>
                  <div style={{ position: 'relative' }}>
                     <div style={{ 
                       position: 'absolute', 
                       top: '-30px', 
                       left: '50%', 
                       transform: 'translateX(-50%) rotate(-5deg)', 
                       opacity: 0.8,
                       fontSize: '0.5rem',
                       color: '#1e3a8a',
                       border: '1.5px solid #1e3a8a',
                       padding: '2px 6px',
                       borderRadius: '2px',
                       fontWeight: '900'
                     }}>
                       E-CERTIFIED
                     </div>
                     <div style={{ height: '1px', width: '100%', background: '#1e293b' }}></div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.55rem', color: '#94a3b8', lineHeight: 1.4, borderTop: '1px dashed #e2e8f0', paddingTop: '0.5rem' }}>
                &copy; {new Date().getFullYear()} PT. Riza Media Productions.<br/>
                Dokumen digital sah tanpa tanda tangan basah.
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actionButtons}>
              <button onClick={() => window.print()} className={styles.printBtn}>
                Cetak / PDF
              </button>
              <button onClick={closeModal} className={styles.closeBtn}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
