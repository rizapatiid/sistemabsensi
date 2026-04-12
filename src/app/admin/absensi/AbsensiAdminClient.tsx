"use client"

import { useState } from "react"
import styles from "@/styles/admin.module.css"
import { formatIndonesianDate, formatWIBTime } from "@/lib/date"

interface Absensi {
  id: string
  tanggal: Date
  waktuMasuk: Date
  idKaryawan: string
  status: string
  foto: string | null
  buktiApp: string | null
  alasan: string | null
  user: {
    nama: string
  }
}

const IconCalendarHeader = () => (
  <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
  </div>
)

const IconFilter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
)

const IconUserCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></svg>
)

const IconUserX = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="18" y1="8" x2="23" y2="13" /><line x1="23" y1="8" x2="18" y2="13" /></svg>
)

const IconCalendarTable = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
)

export default function AbsensiAdminClient({ absensi }: { absensi: Absensi[] }) {
  const [modalImage, setModalImage] = useState<string | null>(null)

  // Filter States
  const [tempHari, setTempHari] = useState<string>("")
  const [tempBulan, setTempBulan] = useState<string>(new Date().getMonth().toString())
  const [tempTahun, setTempTahun] = useState<string>(new Date().getFullYear().toString())

  const [filterHari, setFilterHari] = useState<string>("")
  const [filterBulan, setFilterBulan] = useState<string>(new Date().getMonth().toString())
  const [filterTahun, setFilterTahun] = useState<string>(new Date().getFullYear().toString())

  const openModal = (src: string) => setModalImage(src)
  const closeModal = () => setModalImage(null)

  const listHari = Array.from({ length: 31 }, (_, i) => (i + 1).toString())
  const listBulan = [
    { v: "0", l: "Januari" }, { v: "1", l: "Februari" }, { v: "2", l: "Maret" },
    { v: "3", l: "April" }, { v: "4", l: "Mei" }, { v: "5", l: "Juni" },
    { v: "6", l: "Juli" }, { v: "7", l: "Agustus" }, { v: "8", l: "September" },
    { v: "9", l: "Oktober" }, { v: "10", l: "November" }, { v: "11", l: "Desember" }
  ]
  const listTahun = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString())

  // Apply Filter
  const filteredAbsensi = absensi.filter(a => {
    const d = new Date(a.tanggal)
    const matchHari = filterHari === "" || d.getDate().toString() === filterHari
    const matchBulan = filterBulan === "" || d.getMonth().toString() === filterBulan
    const matchTahun = filterTahun === "" || d.getFullYear().toString() === filterTahun
    return matchHari && matchBulan && matchTahun
  })

  return (
    <>
      {/* 1. FILTER HEADER - SYNCED WITH KARYAWAN */}
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            </div>
            <h3 className={styles.cardTitle} style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900 }}>Log Kehadiran</h3>
        </div>

        <div style={{ 
            display: 'flex', 
            gap: '8px', 
            flexWrap: 'nowrap', 
            alignItems: 'center', 
            background: '#f8fafc', 
            padding: '4px 8px', 
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            width: 'fit-content',
            maxWidth: '100%',
            overflowX: 'auto',
            scrollbarWidth: 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <select
                className={styles.filterPill}
                style={{ padding: '8px 4px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, border: 'none', background: 'transparent', outline: 'none', color: '#0f172a', cursor: 'pointer', width: 'auto' }}
                value={tempHari}
                onChange={(e) => setTempHari(e.target.value)}
              >
                <option value="">Tgl</option>
                {listHari.map(h => <option key={h} value={h}>{h}</option>)}
              </select>

              <select
                className={styles.filterPill}
                style={{ padding: '8px 4px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, border: 'none', background: 'transparent', outline: 'none', color: '#0f172a', cursor: 'pointer', width: 'auto' }}
                value={tempBulan}
                onChange={(e) => setTempBulan(e.target.value)}
              >
                {listBulan.map(b => <option key={b.v} value={b.v}>{b.l.substring(0,3)}</option>)}
              </select>

              <select
                className={styles.filterPill}
                style={{ padding: '8px 4px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, border: 'none', background: 'transparent', outline: 'none', color: '#0f172a', cursor: 'pointer', width: 'auto' }}
                value={tempTahun}
                onChange={(e) => setTempTahun(e.target.value)}
              >
                {listTahun.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <div style={{ width: '1px', height: '20px', background: '#e2e8f0', margin: '0 4px' }}></div>
          </div>

          <button
            onClick={() => { setFilterHari(tempHari); setFilterBulan(tempBulan); setFilterTahun(tempTahun); }}
            style={{ 
                background: '#0f172a', 
                color: 'white', 
                border: 'none', 
                borderRadius: '10px', 
                padding: '8px 14px', 
                fontSize: '0.65rem', 
                fontWeight: 900, 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                letterSpacing: '0.04em',
                flexShrink: 0
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <IconFilter />
            FILTER
          </button>
        </div>
      </div>

      {/* 2. TABLE DATA - SYNCED WITH KARYAWAN */}
      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Waktu Presensi</th>
              <th>Informasi Karyawan</th>
              <th>Status</th>
              <th>Berkas Bukti</th>
              <th style={{ textAlign: 'right' }}>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {filteredAbsensi.map((a) => (
              <tr key={a.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ color: '#3b82f6' }}><IconCalendarTable /></div>
                    <div>
                      <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {formatIndonesianDate(a.tanggal, false).toUpperCase()}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: '700' }}>
                        {formatWIBTime(a.waktuMasuk)} WIB
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.userCell}>
                    <div className={styles.userAvatar} style={{ background: '#f1f5f9', color: '#1e3a8a', fontWeight: 800, width: '34px', height: '34px', fontSize: '0.85rem' }}>{a.user.nama.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '0.85rem' }}>{a.user.nama.toUpperCase()}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600' }}>{a.idKaryawan}</div>
                    </div>
                  </div>
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                    <div 
                        className={`${styles.badge}`} 
                        style={{ 
                            background: a.status === 'HADIR' ? '#f0fdf4' : '#fef2f2', 
                            color: a.status === 'HADIR' ? '#16a34a' : '#ef4444',
                            border: 'none',
                            fontSize: '0.65rem',
                            fontWeight: 900,
                            padding: '6px 12px',
                            borderRadius: '100px',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <div style={{ display: 'flex' }}>
                            {a.status === 'HADIR' ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            ) : (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            )}
                        </div>
                        {a.status}
                    </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {a.foto ? (
                      <div className={styles.evidenceThumbnail} onClick={() => openModal(a.foto!)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <img src={a.foto} alt="Selfie" style={{ objectFit: 'cover' }} />
                      </div>
                    ) : null}
                    {a.buktiApp ? (
                      <div className={styles.evidenceThumbnail} onClick={() => openModal(a.buktiApp!)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <img src={a.buktiApp} alt="App" style={{ objectFit: 'cover' }} />
                      </div>
                    ) : null}
                  </div>
                </td>
                <td style={{ textAlign: 'right', fontSize: '0.75rem', color: '#475569', fontWeight: '600' }}>
                  {a.alasan ? a.alasan.toUpperCase() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAbsensi.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px 20px", color: "#94a3b8", fontWeight: "600", fontSize: '0.85rem' }}>
            <div style={{ marginBottom: '16px', opacity: 0.3 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            </div>
            Belum ada data rekaman absensi untuk periode ini.
          </div>
        )}
      </div>

      {modalImage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={closeModal}>
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', background: 'white', padding: '10px', borderRadius: '24px' }} onClick={e => e.stopPropagation()}>
            <img src={modalImage} alt="Preview Full" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '16px', display: 'block' }} />
            <button onClick={closeModal} style={{ position: 'absolute', top: '-15px', right: '-15px', width: '36px', height: '36px', borderRadius: '50%', background: '#0f172a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: '1.2rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)' }}>×</button>
          </div>
        </div>
      )}
    </>
  )
}
