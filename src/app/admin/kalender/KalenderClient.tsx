"use client"

import { deleteHolidayAction, deleteAnnouncementAction } from "@/actions/admin"
import Link from "next/link"
import styles from "@/styles/admin.module.css"

export default function KalenderClient({ holidays, announcements }: { holidays: any[], announcements: any[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
      
      {/* Kolom Hari Libur */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div className={`${styles.section} glass`}>
          <h2>Daftar Hari Libur (Portal Ditutup)</h2>
          <div style={{ overflowX: "auto" }}>
            <table className={styles.dataGrid}>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map(h => (
                  <tr key={h.id}>
                    <td style={{ fontWeight: "600" }}>{new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(h.tanggal))}</td>
                    <td>{h.keterangan}</td>
                    <td>
                      <button 
                        onClick={async () => {
                          if (confirm("Hapus hari libur ini? Portal absensi akan dibuka kembali pada tanggal tersebut.")) {
                            await deleteHolidayAction(h.id)
                          }
                        }}
                        className={styles.btnDelete}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {holidays.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: "center", padding: "2rem" }}>Belum ada hari libur</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Kolom Pengumuman */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div className={`${styles.section} glass`}>
          <h2>Riwayat Pengumuman Karyawan</h2>
          <div style={{ overflowX: "auto" }}>
            <table className={styles.dataGrid}>
              <thead>
                  <tr>
                    <th>Tanggal/Jadwal</th>
                    <th>Judul</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map(a => (
                    <tr key={a.id}>
                      <td>
                        <div style={{ fontSize: "0.85rem" }}>
                          {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(a.tanggal))}
                        </div>
                        {a.scheduleDate && (
                          <div style={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: "600" }}>
                            🕒 Jadwal: {new Intl.DateTimeFormat("id-ID", { dateStyle: "short", timeStyle: "short" }).format(new Date(a.scheduleDate))}
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: "600" }}>{a.judul}</td>
                      <td className={styles.actions}>
                        <Link href={`/admin/kalender/edit-pengumuman/${a.id}`} className={styles.btnSm} style={{ textDecoration: "none", backgroundColor: "#3b82f6", color: "white" }}>
                          Edit
                        </Link>
                        <button 
                          onClick={async () => {
                            if (confirm("Hapus pengumuman ini?")) {
                              await deleteAnnouncementAction(a.id)
                            }
                          }}
                          className={styles.btnDelete}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                {announcements.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: "center", padding: "2rem" }}>Belum ada pengumuman</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}
