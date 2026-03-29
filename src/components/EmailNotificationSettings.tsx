"use client"

import { useState } from "react"
import { updateEmailNotifAction } from "@/actions/userSettings"
import styles from "@/styles/profil_karyawan.module.css"

export default function EmailNotificationSettings({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    if (loading) return
    const newValue = !enabled
    setLoading(true)
    try {
      const res = await updateEmailNotifAction(newValue)
      if (res?.success) {
        setEnabled(newValue)
      } else {
        alert("Gagal memperbarui pengaturan email.")
      }
    } catch (error) {
      alert("Gagal memperbarui pengaturan email.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.notifCard}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'inherit', flex: 1 }}>
        <div className={styles.notifIcon} style={{ 
          background: enabled 
            ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' 
            : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
          color: enabled ? '#2563eb' : '#94a3b8',
          boxShadow: enabled ? '0 4px 12px rgba(37, 99, 235, 0.1)' : 'none',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <div className={styles.notifContent}>
          <h3>Notifikasi Email</h3>
          <p>Terima slip gaji dan bukti pembayaran via email.</p>
        </div>
      </div>
      
      <div 
        onClick={handleToggle}
        className={styles.switch}
        style={{
          backgroundColor: enabled ? '#2563eb' : '#cbd5e1',
          boxShadow: enabled ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'inset 0 2px 4px rgba(0,0,0,0.05)',
          opacity: loading ? 0.7 : 1,
        }}
      >
        <div 
          className={styles.switchKnob}
          style={{
            transform: `translateX(${enabled ? 'calc(100% + 4px)' : '0px'})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {loading && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}
