"use client"

import { useState } from "react"
import { loginAction } from "@/actions/auth"
import styles from "./login.module.css"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleAction(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await loginAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Sisi Kiri: Ilustrasi */}
        <div className={styles.illustrationSection}>
          <img 
            src="/login_illustration.png" 
            alt="Presensi & Payroll Illustration" 
            className={styles.illustration}
          />
        </div>

        {/* Sisi Kanan: Form Login */}
        <div className={styles.loginSection}>
          <div className={styles.logoContainer}>
            <h1 className={styles.logoTitle}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: '#1a567e'}}>
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              RMP DIGITALS
            </h1>
            <p className={styles.logoSubtitle}>Sistem Pegawai Profesional</p>
          </div>

          <div className={styles.divider}></div>

          <h2 className={styles.halamanTitle}>Login Masuk</h2>

          {error && <div className={styles.error}>{error}</div>}

          <form action={handleAction} className={styles.form}>
            <input 
              name="idKaryawan" 
              type="text" 
              placeholder="Username / ID" 
              className={styles.inputField}
              required 
            />
            
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              className={styles.inputField}
              required 
            />

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "MEMPROSES..." : "LOGIN"}
            </button>
          </form>


          <div style={{ marginTop: 'auto', paddingTop: '40px', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', fontWeight: '500' }}>
            &copy; {new Date().getFullYear()} RMP DIGITALS. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  )
}
