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
            <div className={styles.logoContainer} style={{ justifyContent: 'center' }}>
                {/* BRAND LOGO ONLY - MINIMALIST ELITE LOOK */}
                <img 
                    src="/logositus.png" 
                    alt="RMP Digitals Logo" 
                    style={{ height: '70px', width: 'auto', objectFit: 'contain' }}
                />
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
