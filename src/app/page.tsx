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
        
        {/* SISI KIRI: ILUSTRASI (DESKTOP) */}
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
                {/* ICON DENGAN BOX MODERN */}
                <div className={styles.logoIconBox}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                </div>
                
                {/* DIVIDER VERTIKAL */}
                <div className={styles.logoVerticalDivider}></div>

                {/* TEXT BRANDING */}
                <div style={{ textAlign: 'left' }}>
                    <h1 className={styles.logoTitle}>RMP DIGITALS</h1>
                    <p className={styles.logoSubtitle}>Corporate Personnel System</p>
                </div>
            </div>

            <div className={styles.divider}></div>

            <h2 className={styles.halamanTitle}>Masuk Akun</h2>

            {error && <div className={styles.error}>{error}</div>}

            <form action={handleAction} className={styles.form}>
                <div style={{ width: '100%' }}>
                    <label className={styles.inputLabel}>USERNAME / ID KARYAWAN</label>
                    <input 
                        name="idKaryawan" 
                        type="text" 
                        placeholder="Masukkan ID Anda" 
                        className={styles.inputField}
                        required 
                    />
                </div>
                
                <div style={{ width: '100%' }}>
                    <label className={styles.inputLabel}>PASSWORD KEAMANAN</label>
                    <input 
                        name="password" 
                        type="password" 
                        placeholder="Masukkan Kata Sandi" 
                        className={styles.inputField}
                        required 
                    />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? "MEMPROSES..." : "MASUK KE DASHBOARD"}
                </button>
            </form>

            <div className={styles.footer}>
                &copy; {new Date().getFullYear()} PT RIZA MEDIA PRODUCTIONS · VERSI 1.0.0 <br /> SYSTEM BY RMP DEVELOPMENT
            </div>
        </div>

      </div>
    </div>
  )
}
