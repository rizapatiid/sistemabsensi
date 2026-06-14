"use client"

import { useState, useMemo } from "react"
import styles from "@/styles/admin.module.css"
import employeeStyles from "@/styles/employee_home.module.css"
import Link from "next/link"
import { deleteHolidayAction } from "@/actions/admin"
import { formatIndonesianDate } from "@/lib/date"

interface Holiday {
  id: string
  tanggal: string
  keterangan: string
  image?: string | null
}

const IconPlus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IconCalendar = () => <svg width="clamp(24px, 6vw, 32px)" height="clamp(24px, 6vw, 32px)" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IconCalendarSmall = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IconTrash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
const IconEdit = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>

export default function KalenderClient({ holidays }: { holidays: Holiday[] }) {
  const handleDeleteHoliday = async (id: string) => {
    if (confirm("Hapus hari libur ini?")) {
      await deleteHolidayAction(id)
    }
  }

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
              <IconCalendar />
            </div>
            <div>
              <h1 className={styles.pengumumanHeaderTitle}>Kalender Operasional</h1>
              <p className={styles.pengumumanHeaderDesc}>Kelola jadwal hari libur dan agenda operasional perusahaan.</p>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/admin/kalender/tambah-libur"
            className={styles.pengumumanHeaderBtn}
          >
            <IconPlus /> SET HARI LIBUR
          </Link>
        </div>
      </div>


      {/* ── HOLIDAY LIST ── */}
      <div>
        {holidays.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 40px', background: 'white', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.2 }}>🗓️</div>
            <p style={{ color: '#94a3b8', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Data agenda operasional tidak ditemukan.</p>
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
              {holidays.map(h => (
                <div
                  key={h.id}
                  className={`${employeeStyles.announceItem} ${styles.adminAnnounceItem}`}
                  style={{ position: 'relative' }}
                >
                  {h.image && (
                    <div className={employeeStyles.announceImageWrapper}>
                      <img src={h.image} alt={h.keterangan} className={employeeStyles.announceThumbnail} />
                    </div>
                  )}
                  <div className={employeeStyles.announceContent}>
                    <span className={employeeStyles.announceDateText} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IconCalendarSmall />
                      {formatIndonesianDate(h.tanggal)}
                    </span>
                    <h4 className={employeeStyles.announceTitle}>{h.keterangan}</h4>
                  </div>

                  {/* Admin action buttons */}
                  <div
                    className={styles.adminAnnounceActions}
                  >
                    <Link
                      href={`/admin/kalender/edit-libur/${h.id}`}
                      title="Edit"
                      className={styles.pengumumanActionEdit}
                    >
                      <IconEdit /> Edit
                    </Link>
                    <button
                      title="Hapus"
                      onClick={() => handleDeleteHoliday(h.id)}
                      className={styles.pengumumanActionDelete}
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
    </div>
  )
}
