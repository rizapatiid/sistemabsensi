"use client"

import { useState } from "react"
import styles from "@/styles/admin.module.css"
import employeeStyles from "@/styles/employee_home.module.css"
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

const IconFileText = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
const IconTrashBtn = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
const IconRefreshBtn = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
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

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleReject = (id: string) => {
    setConfirmDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!confirmDeleteId) return
    setIsDeleting(confirmDeleteId)
    const res = await rejectAttendanceAction(confirmDeleteId)
    if (res?.error) {
        alert(res.error)
    }
    setIsDeleting(null)
    setConfirmDeleteId(null)
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

    const countHadir = filteredAbsensi.filter(a => a.status === 'HADIR').length
  const countIzin = filteredAbsensi.filter(a => a.status !== 'HADIR').length

  return (
    <>
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
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>

            <div className={styles.pengumumanHeaderFlex}>
                <div className={styles.pengumumanHeaderLeft}>
                    <div className={styles.pengumumanHeaderIcon}>
                      <svg width="clamp(24px, 6vw, 32px)" height="clamp(24px, 6vw, 32px)" viewBox="-2 -2 28 28" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 11a2 2 0 1 0-2 2"/><path d="M12 15a6 6 0 1 0-6-6"/><path d="M12 19a10 10 0 1 0-10-10"/><path d="M22 10a10.08 10.08 0 0 0-2-6"/><path d="M2 14c.22 1.63.8 3.16 1.66 4.5"/><path d="M5.34 20.66a10.05 10.05 0 0 0 5.16 2.34"/><path d="M14 22.8c1.33.16 2.67.1 3.96-.16"/><path d="M19.45 20.17a10.15 10.15 0 0 0 2.22-3.1"/></svg>
                    </div>
                    <div>
                        <h1 className={styles.pengumumanHeaderTitle}>Monitor Absensi</h1>
                        <p className={styles.pengumumanHeaderDesc}>Ringkasan kehadiran personil dan log absensi harian RMP.</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowManualModal(true)}
                    className={styles.pengumumanHeaderBtn}
                >
                    <IconPlus /> INPUT PRESENSI
                </button>
            </div>
        </div>

        {/* ── STATS & FILTERS BAR ── */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div className={styles.adminStatsContainer} style={{ display: 'flex', gap: '16px' }}>
                    <div className={styles.adminStatCard} style={{ background: '#f0fdf4', border: '1px solid #dcfce7', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ color: '#16a34a' }}>
                            <IconCheckCircle />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#16a34a', lineHeight: 1 }}>{countHadir}</div>
                            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>Hadir</div>
                        </div>
                    </div>
                    <div className={styles.adminStatCard} style={{ background: '#eff6ff', border: '1px solid #dbeafe', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ color: '#3b82f6' }}>
                            <IconClock />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#3b82f6', lineHeight: 1 }}>{countIzin}</div>
                            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>Izin / Sakit</div>
                        </div>
                    </div>
                </div>

                {/* Dropdown Filters */}
                <div className={styles.adminFilterContainer} style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    alignItems: 'center',
                    background: '#f8fafc',
                    padding: '8px',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    flexWrap: 'wrap'
                }}>
                    <select className={styles.filterPill} style={{ height: '38px', padding: '0 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #e2e8f0', background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', outline: 'none', color: '#0f172a', cursor: 'pointer' }} value={tempHari} onChange={(e) => setTempHari(e.target.value)}>
                        <option value="">Tgl</option>
                        {listHari.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <select className={styles.filterPill} style={{ height: '38px', padding: '0 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #e2e8f0', background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', outline: 'none', color: '#0f172a', cursor: 'pointer' }} value={tempBulan} onChange={(e) => setTempBulan(e.target.value)}>
                        {listBulan.map(b => <option key={b.v} value={b.v}>{b.l.substring(0,3)}</option>)}
                    </select>
                    <select className={styles.filterPill} style={{ height: '38px', padding: '0 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #e2e8f0', background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', outline: 'none', color: '#0f172a', cursor: 'pointer' }} value={tempTahun} onChange={(e) => setTempTahun(e.target.value)}>
                        {listTahun.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div style={{ width: '1px', height: '20px', background: '#e2e8f0', margin: '0 4px', display: 'none' }} className="mobile-hide"></div>
                    <button onClick={() => { setFilterHari(tempHari); setFilterBulan(tempBulan); setFilterTahun(tempTahun); }} style={{ height: '38px', padding: '0 16px', background: '#0f172a', color: 'white', border: '1px solid #0f172a', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <IconFilter /> FILTER
                    </button>
                </div>
            </div>
        </div>

        {/* ── CARD LIST ── */}
        {filteredAbsensi.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '16px', padding: '40px 20px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <p style={{ color: '#94a3b8', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Belum ada rekaman absensi ditemukan.</p>
            </div>
        ) : (
            <div style={{ background: 'white', borderRadius: '16px', padding: 'clamp(16px, 4vw, 24px)', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                <div className={employeeStyles.announceList}>
                    {filteredAbsensi.map(a => (
                        <div key={a.id} className={`${employeeStyles.announceItem} ${styles.adminAnnounceItem} ${styles.absensiItemGrid}`} style={{ position: 'relative' }}>
                            <div className={employeeStyles.announceImageContainer}>
                                {a.foto && (
                                    <div className={employeeStyles.announceImageWrapper} onClick={() => openModal(a.foto!)} style={{ background: '#f8fafc', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', flexShrink: 0, border: '1px solid #e2e8f0', overflow: 'hidden', padding: 0, cursor: 'pointer' }} title="Selfie">
                                        <img src={a.foto} alt="Selfie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                                {a.buktiApp && (
                                    <div className={employeeStyles.announceImageWrapper} onClick={() => openModal(a.buktiApp!)} style={{ background: '#f8fafc', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', flexShrink: 0, border: '1px solid #e2e8f0', overflow: 'hidden', padding: 0, cursor: 'pointer' }} title="Bukti App">
                                        <img src={a.buktiApp} alt="Bukti" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                                {(!a.foto && !a.buktiApp) && (
                                    <div className={employeeStyles.announceImageWrapper} style={{ background: '#f8fafc', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                                        {a.user.nama.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className={employeeStyles.announceContent}>
                                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                    <span className={employeeStyles.announceDateText}>
                                        {formatIndonesianDate(a.tanggal, false).toUpperCase()} • {formatWIBTime(a.waktuMasuk)}
                                    </span>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '100px', background: a.status === 'HADIR' ? '#f0fdf4' : '#fff7ed', border: `1px solid ${a.status === 'HADIR' ? '#dcfce7' : '#ffedd5'}`, color: a.status === 'HADIR' ? '#16a34a' : '#ea580c', fontSize: '0.65rem', fontWeight: 900 }}>
                                        {a.status}
                                    </span>
                                </div>
                                <h4 className={employeeStyles.announceTitle} style={{ marginBottom: '2px' }}>{a.user.nama.toUpperCase()}</h4>
                                <p className={employeeStyles.announcePreview} style={{ margin: 0 }}>
                                    <span style={{ fontWeight: 800, color: '#0f172a' }}>{a.idKaryawan}</span> {a.alasan ? ` • ${a.alasan}` : ''}
                                </p>
                            </div>

                            <div className={styles.adminAnnounceActions}>

                                <button onClick={() => handleReject(a.id)} disabled={isDeleting === a.id} className={styles.pengumumanActionDelete} title="Ulangi Absensi">
                                    {isDeleting === a.id ? '...' : <><IconRefreshBtn /> Ulangi Absensi</>}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* MODAL IMAGE PREVIEW */}      {/* MODAL IMAGE PREVIEW */}
      {modalImage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={closeModal}>
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', background: 'white', padding: '10px', borderRadius: '16px' }} onClick={e => e.stopPropagation()}>
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

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
              <div style={{ background: 'white', padding: '32px', borderRadius: '24px', width: 'min(400px, 100%)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '12px' }}>Ulangi Absensi?</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '24px', lineHeight: 1.5 }}>Apakah Anda yakin ingin menghapus riwayat ini? Karyawan bersangkutan akan diwajibkan untuk melakukan absensi ulang.</p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => setConfirmDeleteId(null)} disabled={isDeleting !== null} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: 800, cursor: 'pointer' }}>Batal</button>
                      <button onClick={confirmDelete} disabled={isDeleting !== null} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 800, cursor: isDeleting ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          {isDeleting ? 'Memproses...' : 'Ya, Ulangi'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      </>
  )
}
