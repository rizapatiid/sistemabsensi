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
        
        {/* SISI KIRI: ILUSTRASI (AUTO-HIDDEN ON MOBILE) */}
        <div className={styles.illustrationSection}>
           <img 
               src="/login_illustration.png" 
               alt="RMP Digitals Illustration" 
               className={styles.illustration}
           />
        </div>

        {/* SISI KANAN: LOGIN SECTION */}
        <div className={styles.loginSection}>
            <div className={styles.logoContainer}>
                {/* BRAND LOGO ONLY - ELITE MINIMALIST */}
                <img 
                    src="/logositus.png" 
                    alt="RMP Digitals Logo" 
                    style={{ height: '80px', width: 'auto', objectFit: 'contain' }}
                />
            </div>

            <div className={styles.divider}></div>

            <div style={{ textAlign: 'left', marginBottom: '8px' }}>
                <h2 className={styles.halamanTitle}>Selamat Datang</h2>
                <p className={styles.halamanSubtitle}>Silakan masuk untuk mengakses panel operasional Anda.</p>
            </div>

            {error && (
              <div className={styles.error}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <form action={handleAction} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>USERNAME / ID KARYAWAN</label>
                    <input 
                        name="idKaryawan" 
                        type="text" 
                        placeholder="Masukkan ID Personil" 
                        className={styles.inputField}
                        autoComplete="username"
                        required 
                    />
                </div>
                
                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>PASSWORD KEAMANAN</label>
                    <input 
                        name="password" 
                        type="password" 
                        placeholder="Entri Kata Sandi" 
                        className={styles.inputField}
                        autoComplete="current-password"
                        required 
                    />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? (
                      "Memproses Data..."
                    ) : ( 
                      <>
                        MASUK KE DASHBOARD
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </>
                    )}
                </button>
            </form>

            <div className={styles.footer}>
                &copy; {new Date().getFullYear()} PT RIZA MEDIA PRODUCTIONS <br /> 
                <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>SYNERGY & TECHNOLOGY FOR EXCELLENCE</span>
            </div>
        </div>

      </div>
    </div>
  )
}
