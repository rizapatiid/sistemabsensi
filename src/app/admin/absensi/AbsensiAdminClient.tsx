"use client"

import { useState } from "react"
import styles from "@/styles/admin.module.css"

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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    </div>
)

const IconFilter = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
)

const IconUserCheck = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
)

const IconUserX = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>
)

const IconCalendarTable = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
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

  const countHadir = filteredAbsensi.filter(a => a.status === 'HADIR').length
  const countIzin = filteredAbsensi.filter(a => a.status === 'IZIN').length
  const currentMonthLabel = listBulan.find(b => b.v === filterBulan)?.l || "Semua"

  return (
    <div className={styles.pageContainer} style={{ padding: '0px' }}>
      {/* HEADER & STATS SECTION (RESPONSIVE) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <IconCalendarHeader />
              <h1 className={styles.pageTitle} style={{ fontSize: '1.8rem' }}>Rekap Absensi</h1>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500', marginTop: '10px' }}>
              Laporan presensi periode {filterHari ? `${filterHari} ` : ""}{currentMonthLabel} {filterTahun}.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '380px' }}>
              <div className={styles.statPill} style={{ flex: 1, padding: '12px' }}>
                  <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a', width: '38px', height: '38px' }}><IconUserCheck /></div>
                  <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a' }}>{countHadir}</div>
                      <div style={{ fontSize: '0.6rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Hadir</div>
                  </div>
              </div>
              
              <div className={styles.statPill} style={{ flex: 1, padding: '12px' }}>
                  <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#2563eb', width: '38px', height: '38px' }}><IconUserX /></div>
                  <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0f172a' }}>{countIzin}</div>
                      <div style={{ fontSize: '0.6rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Izin</div>
                  </div>
              </div>
          </div>
        </div>

        {/* FILTER BAR BOX (RESPONSIVE) */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select 
                className={styles.filterPill}
                style={{ flex: '1 1 120px' }}
                value={tempHari}
                onChange={(e) => setTempHari(e.target.value)}
            >
                <option value="">Semua Tanggal</option>
                {listHari.map(h => <option key={h} value={h}>{h}</option>)}
            </select>

            <select 
                className={styles.filterPill}
                style={{ flex: '1 1 140px' }}
                value={tempBulan}
                onChange={(e) => setTempBulan(e.target.value)}
            >
                <option value="">Semua Bulan</option>
                {listBulan.map(b => <option key={b.v} value={b.v}>{b.l}</option>)}
            </select>

            <select 
                className={styles.filterPill}
                style={{ flex: '1 1 120px' }}
                value={tempTahun}
                onChange={(e) => setTempTahun(e.target.value)}
            >
                <option value="">Semua Tahun</option>
                {listTahun.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <button 
                className={styles.filterBtn}
                style={{ flex: '1 1 100%', justifyContent: 'center', marginTop: '4px' }}
                onClick={() => { setFilterHari(tempHari); setFilterBulan(tempBulan); setFilterTahun(tempTahun); }}
            >
                <IconFilter />
                Filter Data
            </button>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className={styles.card}>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <IconCalendarTable />
                          <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                          {new Intl.DateTimeFormat("id-ID", { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(a.tanggal))}
                          </div>
                      </div>
                      <div style={{ paddingLeft: '22px', color: '#64748b', fontSize: '0.75rem', fontWeight: '700', marginTop: '1px' }}>
                          Pukul: {new Intl.DateTimeFormat("id-ID", { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(a.waktuMasuk))}
                      </div>
                    </td>
                    <td>
                    <div className={styles.userCell}>
                        <div className={styles.userAvatar} style={{ borderRadius: '50%', width: '38px', height: '38px', flexShrink: 0 }}>{a.user.nama.charAt(0)}</div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.user.nama.toUpperCase()}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>{a.idKaryawan}</div>
                        </div>
                    </div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${a.status === 'HADIR' ? styles.badgeHadir : styles.badgeIzin}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {a.foto ? (
                        <div className={styles.evidenceThumbnail} onClick={() => openModal(a.foto!)} style={{ width: '42px', height: '42px' }}>
                            <img src={a.foto} alt="Selfie" />
                        </div>
                        ) : null}
                        {a.buktiApp ? (
                        <div className={styles.evidenceThumbnail} onClick={() => openModal(a.buktiApp!)} style={{ width: '42px', height: '42px' }}>
                            <img src={a.buktiApp} alt="App" />
                        </div>
                        ) : null}
                    </div>
                    </td>
                    <td style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b', fontWeight: '500', minWidth: '150px' }}>
                        {a.alasan ? a.alasan.toUpperCase() : "-"}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            {filteredAbsensi.length === 0 && (
                <div style={{ textAlign: "center", padding: "80px", color: "#94a3b8", fontWeight: "600" }}>
                    Belum ada data rekaman absensi.
                </div>
            )}
        </div>
      </div>

      {modalImage && (
        <div className={styles.imageModal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <img src={modalImage} alt="Preview Full" className={styles.fullImage} />
            <button className={styles.closeModal} onClick={closeModal}>×</button>
          </div>
        </div>
      )}
    </div>
  )
}
