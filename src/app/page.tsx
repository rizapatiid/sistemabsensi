"use client"

import { useState, useEffect } from "react"
import { loginAction, requestPasswordResetAction, verifyOtpAction, resetPasswordAction } from "@/actions/auth"
import { useRouter } from "next/navigation"
import styles from "./login.module.css"

const IconMail = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
)
const IconKey = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zM12 7l.34 2.66 2.66.34-.66 2 3-1 2 2 .66-2 1-1-2-2-4 .66z"/></svg>
)
const IconLock = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
)
const IconAlertCircle = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
)

const IconCheck = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
)

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [forgotMode, setForgotMode] = useState<null | "FORGOT" | "OTP" | "RESET" | "SUCCESS">(null)
  const [resetEmail, setResetEmail] = useState("")
  const [otp, setOtp] = useState("")

  useEffect(() => {
    // Prefetch dashboards to make redirect feel instant
    router.prefetch("/admin/home")
    router.prefetch("/employee/home")
  }, [router])

  async function handleAction(formData: FormData) {
    setLoading(true)
    setError(null)

    if (forgotMode === "RESET") {
      const res = await resetPasswordAction(formData)
      setLoading(false)
      if (res.success) {
        setForgotMode("SUCCESS")
        setError(null)
      } else {
        setError(res.error || "Gagal reset password")
      }
      return
    }

    const result = await loginAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // If successful, loginAction will redirect, 
    // but we stay in loading state until page unmounts
  }

  async function handleRequestReset() {
    if (!resetEmail) { setError("Masukkan email Anda"); return }
    setLoading(true)
    const res = await requestPasswordResetAction(resetEmail)
    setLoading(false)
    if (res.success) {
      setForgotMode("OTP")
      setError(null)
    } else {
      setError(res.error || "Gagal meminta reset")
    }
  }

  async function handleVerifyOTP() {
    if (!otp) { setError("Masukkan kode OTP"); return }
    setLoading(true)
    const res = await verifyOtpAction(resetEmail, otp)
    setLoading(false)
    if (res.success) {
      setForgotMode("RESET")
      setError(null)
    } else {
      setError(res.error || "OTP salah")
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
                {/* BRAND LOGO - SCALE CONTROLLED BY CSS FOR PERFECT FIT */}
                <img 
                    src="/logositus.png" 
                    alt="RMP Digitals Logo" 
                    height="95"
                    className={styles.brandLogo}
                />
            </div>

            <div className={styles.divider}></div>

            <div style={{ textAlign: 'left', marginBottom: '8px' }}>
                <h2 className={styles.halamanTitle}>Selamat Datang</h2>
                <p className={styles.halamanSubtitle}>Silakan masuk untuk mengakses panel operasional Anda.</p>
            </div>

            {error && (
              <div className={styles.error}>
                <IconAlertCircle size={20} />
                {error}
              </div>
            )}

            <form 
              onSubmit={async (e) => {
                e.preventDefault()
                if (loading) return
                const formData = new FormData(e.currentTarget)
                await handleAction(formData)
              }} 
              className={styles.form}
            >
                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>EMAIL / ID KARYAWAN</label>
                    <input 
                        name="idKaryawan" 
                        type="text" 
                        placeholder="Contoh: k001 atau email@anda.com" 
                        className={styles.inputField}
                        autoComplete="username"
                        autoFocus
                        required 
                    />
                </div>
                
                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>PASSWORD KEAMANAN</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                          name="password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Entri Kata Sandi" 
                          className={styles.inputField}
                          autoComplete="current-password"
                          required 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                      >
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                </div>

                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                  <button type="button" onClick={() => { setForgotMode("FORGOT"); setError(null); }} style={{ background: 'none', border: 'none', color: '#1e3a8a', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}>
                    Lupa Password?
                  </button>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? (
                      "Memproses Data..."
                    ) : ( 
                      <>
                        LOGIN
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

      {/* MODAL LUPA PASSWORD */}
      {forgotMode && (
        <div 
          onClick={() => { if(!loading) setForgotMode(null); }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div 
            className={styles.modal} 
            onClick={e => e.stopPropagation()} 
            style={{ 
              maxWidth: '400px', 
              background: 'white', 
              padding: '32px', 
              borderRadius: '24px', 
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }}
          >
             <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '50%', color: '#1e3a8a', display: 'inline-flex', marginBottom: '12px' }}>
                  {forgotMode === "FORGOT" && <IconMail size={24} />}
                  {forgotMode === "OTP" && <IconKey size={24} />}
                  {forgotMode === "RESET" && <IconLock size={24} />}
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                  {forgotMode === "FORGOT" && "Lupa Password"}
                  {forgotMode === "OTP" && "Verifikasi OTP"}
                  {forgotMode === "RESET" && "Setting Password Baru"}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  {forgotMode === "FORGOT" && "Masukkan email terdaftar untuk menerima kode OTP."}
                  {forgotMode === "OTP" && `Kode OTP telah dikirim ke ${resetEmail}`}
                  {forgotMode === "RESET" && "Masukkan password baru yang aman."}
                </p>
             </div>

             {/* MODAL-SPECIFIC ERROR */}
             {error && (
              <div className={styles.error} style={{ marginBottom: '15px', fontSize: '0.75rem' }}>
                <IconAlertCircle size={16} />
                <span style={{ marginLeft: '8px' }}>{error}</span>
              </div>
            )}

            {forgotMode === "FORGOT" && (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>EMAIL TERDAFTAR</label>
                <input 
                  type="email" 
                  value={resetEmail} 
                  onChange={e => setResetEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className={styles.inputField} 
                />
                <button className={styles.primaryBtn} style={{ marginTop: '20px' }} onClick={handleRequestReset} disabled={loading}>
                  {loading ? "MENGIRIM..." : "KIRIM KODE OTP"}
                </button>
              </div>
            )}

            {forgotMode === "OTP" && (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>KODE OTP (6 DIGIT)</label>
                <input 
                  type="text" 
                  maxLength={6}
                  value={otp} 
                  onChange={e => setOtp(e.target.value)}
                  placeholder="123456" 
                  className={styles.inputField} 
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em', fontWeight: '800' }}
                />
                <button className={styles.primaryBtn} style={{ marginTop: '20px' }} onClick={handleVerifyOTP} disabled={loading}>
                  {loading ? "VERIFIKASI..." : "VERIFIKASI KODE"}
                </button>
              </div>
            )}

            {forgotMode === "RESET" && (
              <form action={handleAction} className={styles.form}>
                <input type="hidden" name="email" value={resetEmail} />
                <input type="hidden" name="otp" value={otp} />
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>PASSWORD BARU</label>
                  <input 
                    name="newPassword" 
                    type="password" 
                    required 
                    className={styles.inputField}
                    placeholder="Minimal 6 karakter"
                  />
                </div>
                <button type="submit" className={styles.primaryBtn} style={{ marginTop: '10px' }} disabled={loading}>
                   {loading ? "MEMPROSES..." : "UPDATE PASSWORD"}
                </button>
              </form>
            )}

            {forgotMode === "SUCCESS" && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#10b981', marginBottom: '15px' }}><IconCheck size={48} /></div>
                <p style={{ fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>Password Berhasil Diperbarui!</p>
                <button 
                  className={styles.primaryBtn} 
                  onClick={() => { setForgotMode(null); setError(null); }}
                >
                  LOGIN SEKARANG
                </button>
              </div>
            )}

            {!loading && (
              <button 
                type="button"
                onClick={() => { setForgotMode(null); setError(null); }} 
                style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Kembali ke Login
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
