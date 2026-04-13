"use client"

import { useState } from "react"
import styles from "@/styles/admin.module.css"
import { formatIndonesianDate, formatWIBTime } from "@/lib/date"
import { rejectAttendanceAction, manualAttendanceAction } from "../../../actions/admin"

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

interface Employee {
  id: string
  nama: string
}

const IconFilter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
)

const IconCalendarTable = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
)

const IconRotateCcw = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></svg>
)

const IconPlus = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
)

const IconUser = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)

const IconClock = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
)

const IconCheckCircle = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
)

export default function AbsensiAdminClient({ absensi, initialEmployees }: { absensi: Absensi[], initialEmployees: Employee[] }) {
  const [modalImage, setModalImage] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [showManualModal, setShowManualModal] = useState(false)
  const [isSavingManual, setIsSavingManual] = useState(false)

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

  const handleReject = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin MENGHAPUS riwayat absensi ini? Karyawan bersangkutan akan diwajibkan untuk melakukan absensi ulang hari ini.")) return
    
    setIsDeleting(id)
    const res = await rejectAttendanceAction(id)
    if (res?.error) {
        alert(res.error)
    }
    setIsDeleting(null)
  }

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSavingManual(true)
    const formData = new FormData(e.currentTarget)
    const res = await manualAttendanceAction(formData)
    
    if (res?.success) {
        setShowManualModal(false)
        alert("Berhasil menginput presensi manual")
    } else {
        alert(res?.error || "Gagal menginput presensi manual")
    }
    setIsSavingManual(false)
  }

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
      <div className={styles.cardHeader} style={{ 
        padding: '24px', 
        borderBottom: '1px solid #f1f5f9', 
        background: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eff6ff', color: '#3b82f6', width: '38px', height: '38px', borderRadius: '12px', border: '1px solid #dbeafe' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            </div>
            <div>
                <h3 className={styles.cardTitle} style={{ margin: 0, fontSize: '1rem', fontWeight: 950, color: '#0f172a' }}>Log Kehadiran</h3>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Total {filteredAbsensi.length} rekaman ditemukan</p>
            </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
                onClick={() => setShowManualModal(true)}
                style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 18px',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                    letterSpacing: '0.02em'
                }}
            >
                <IconPlus />
                INPUT PRESENSI
            </button>

            <div style={{ 
                display: 'flex', 
                gap: '8px', 
                alignItems: 'center', 
                background: '#f8fafc', 
                padding: '4px 8px', 
                borderRadius: '14px',
                border: '1px solid #e2e8f0'
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                    gap: '6px'
                }}
            >
                <IconFilter />
                FILTER
            </button>
            </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Waktu Presensi</th>
              <th>Informasi Karyawan</th>
              <th>Status</th>
              <th>Berkas Bukti</th>
              <th style={{ textAlign: 'right' }}>Keterangan</th>
              <th style={{ textAlign: 'right' }}>Aksi</th>
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
                    <div className={`${styles.badge}`} style={{ background: a.status === 'HADIR' ? '#f0fdf4' : '#fef2f2', color: a.status === 'HADIR' ? '#16a34a' : '#ef4444', border: 'none', fontSize: '0.65rem', fontWeight: 900, padding: '6px 12px', borderRadius: '100px', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '6px' }} >
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
                <td style={{ textAlign: 'right' }}>
                    <button 
                        onClick={() => handleReject(a.id)}
                        disabled={isDeleting === a.id}
                        style={{ 
                            background: '#fef2f2', 
                            color: '#ef4444', 
                            border: '1px solid #fee2e2', 
                            borderRadius: '10px', 
                            padding: '8px 12px', 
                            fontSize: '0.65rem', 
                            fontWeight: 900, 
                            cursor: isDeleting === a.id ? 'wait' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            opacity: isDeleting === a.id ? 0.6 : 1
                        }}
                    >
                        {isDeleting === a.id ? (
                            <div style={{ width: '12px', height: '12px', border: '2px solid #ef4444', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
                        ) : (
                            <IconRotateCcw />
                        )}
                        {isDeleting === a.id ? 'HAPUS...' : 'HAPUS RIWAYAT'}
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAbsensi.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px 20px", color: "#94a3b8", fontWeight: "600", fontSize: '0.85rem' }}>
            Belum ada data rekaman absensi untuk periode ini.
          </div>
        )}
      </div>

      {/* MODAL IMAGE PREVIEW */}
      {modalImage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={closeModal}>
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', background: 'white', padding: '10px', borderRadius: '24px' }} onClick={e => e.stopPropagation()}>
            <img src={modalImage} alt="Preview Full" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '16px', display: 'block' }} />
            <button onClick={closeModal} style={{ position: 'absolute', top: '-15px', right: '-15px', width: '36px', height: '36px', borderRadius: '50%', background: '#0f172a', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: '1.2rem' }}>×</button>
          </div>
        </div>
      )}

      {/* MODAL MANUAL INPUT */}
      {showManualModal && (
          <div style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(15, 23, 42, 0.4)', 
              backdropFilter: 'blur(12px)', 
              zIndex: 99998, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '20px' 
          }}>
              <div style={{ 
                  background: 'white', 
                  padding: 'clamp(24px, 5vw, 40px)', 
                  borderRadius: '32px', 
                  width: 'min(500px, 95vw)', 
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', 
                  position: 'relative' 
              }}>
                  <button onClick={() => setShowManualModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#f8fafc', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 900, width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  
                  <div style={{ marginBottom: '28px' }}>
                    <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 950, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.02em', lineHeight: '1.2' }}>Input Presensi Manual</h2>
                    <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>Input data kehadiran personil secara administratif.</p>
                  </div>

                  <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              <IconUser /> PILIH KARYAWAN
                          </label>
                          <select name="idKaryawan" required style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.9rem', fontWeight: 700, outline: 'none', color: '#0f172a' }}>
                             <option value="">-- Pilih Karyawan --</option>
                             {initialEmployees.map(emp => (
                                 <option key={emp.id} value={emp.id}>{emp.nama.toUpperCase()} ({emp.id})</option>
                             ))}
                          </select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <IconCalendarTable /> TANGGAL
                            </label>
                            <input type="date" name="tanggal" required defaultValue={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.9rem', fontWeight: 700, outline: 'none', color: '#0f172a', appearance: 'none' }} />
                          </div>
                          <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <IconClock /> WAKTU
                            </label>
                            <input type="time" name="waktu" required defaultValue="08:00" style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.9rem', fontWeight: 700, outline: 'none', color: '#0f172a', appearance: 'none' }} />
                          </div>
                      </div>

                      <div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              <IconCheckCircle /> STATUS KEHADIRAN
                          </label>
                          <div style={{ display: 'flex', gap: '10px' }}>
                              <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
                                  <input type="radio" name="status" value="HADIR" defaultChecked style={{ accentColor: '#0f172a' }} /> HADIR
                              </label>
                              <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
                                  <input type="radio" name="status" value="IZIN" style={{ accentColor: '#0f172a' }} /> IZIN
                              </label>
                          </div>
                      </div>

                      <button type="submit" disabled={isSavingManual} style={{ 
                          marginTop: '10px',
                          padding: '16px', 
                          borderRadius: '16px', 
                          border: 'none', 
                          background: '#0f172a', 
                          color: 'white', 
                          fontWeight: 900, 
                          fontSize: '0.9rem',
                          cursor: isSavingManual ? 'wait' : 'pointer',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          transition: 'all 0.2s ease',
                          opacity: isSavingManual ? 0.7 : 1
                      }}>
                          {isSavingManual ? 'MEMPROSES...' : 'SIMPAN PRESENSI'}
                      </button>
                  </form>
              </div>
          </div>
      )}

      <style jsx>{`
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
      `}</style>
    </>
  )
}
