"use client"

import { useState, useRef, useEffect } from "react"
import { submitKehadiranAction } from "@/actions/employeeUser"
import styles from "@/styles/absensi_karyawan.module.css"

const IconFaceId = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8V6a2 2 0 0 1 2-2h2"/><path d="M4 16v2a2 2 0 0 0 2 2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M16 20h2a2 2 0 0 0 2-2v-2"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M10 14a2 2 0 0 0 4 0"/></svg>
)
const IconCloudUpload = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 16 4-4 4 4"/></svg>
)
const IconCamera = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
)
const IconUpload = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
)
const IconCheck = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
)
const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
)
const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
)
const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
)
const IconAlert = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
)
const IconFileText = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
    <rect x="7" y="13" width="10" height="3" rx="1.5" fill="currentColor" stroke="none" />
    <rect x="7" y="17" width="10" height="3" rx="1.5" fill="currentColor" stroke="none" />
    <rect x="7" y="9" width="4" height="3" rx="1.5" fill="currentColor" stroke="none" />
  </svg>
)
const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
)

export default function AbsensiClient({ 
  isClosed, 
  message, 
  hasAttendance,
  existingStatus,
  holidayImage
}: { 
  isClosed: boolean, 
  message: string, 
  hasAttendance: boolean,
  existingStatus?: string,
  holidayImage?: string | null
}) {
  const compressImage = (dataUrl: string, maxWidth = 800, maxHeight = 800): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        if (width > height) {
          if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
        } else {
          if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; }
        }
        canvas.width = width; canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.src = dataUrl
    })
  }

  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{type: "error"|"success", text: string} | null>(null)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [capturedScreenshot, setCapturedScreenshot] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [showIzinModal, setShowIzinModal] = useState(false)
  const [alasan, setAlasan] = useState("")
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [izinSubtype, setIzinSubtype] = useState<"IZIN" | "LAINNYA">("IZIN")
  const [capturedIzinPhoto, setCapturedIzinPhoto] = useState<string | null>(null)
  const [izinCameraActive, setIzinCameraActive] = useState(false)
  const [showFixModal, setShowFixModal] = useState(false)
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [tempPhoto, setTempPhoto] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const activeStatus = submittedStatus || existingStatus
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setCurrentTime(new Date())
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isClosed && !activeStatus) {
      const checkPermission = async () => {
        try {
          const res = await navigator.permissions.query({ name: 'camera' as any })
          if (res.state !== 'granted') {
            setMsg({ type: "error", text: "Gagal mengakses kamera. Pastikan izin diberikan." })
          }
          res.addEventListener('change', () => {
            if (res.state === 'granted') {
              setMsg(null)
            } else {
              setMsg({ type: "error", text: "Gagal mengakses kamera. Pastikan izin diberikan." })
            }
          })
        } catch (err) {
          console.log("Permissions API not supported for camera.")
        }
      }
      checkPermission()
    }
  }, [isClosed, activeStatus])

  const handleScreenshot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 1200, 1200)
        setCapturedScreenshot(compressed)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    setCameraActive(true)
    setShowCameraModal(true)
    setMsg(null)
    setTempPhoto(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
         setShowFixModal(true)
      } else {
         setMsg({ type: "error", text: "Gagal mengakses kamera. Pastikan izin diberikan." })
      }
      setCameraActive(false)
      setShowCameraModal(false)
    }
  }

  const takePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current; const canvas = canvasRef.current
      canvas.width = video.videoWidth; canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0); const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
        const compressed = await compressImage(dataUrl, 800, 800)
        setTempPhoto(compressed)
      }
    }
  }

  const savePhoto = () => {
    setCapturedPhoto(tempPhoto)
    closeCameraModal()
  }

  const closeCameraModal = () => {
    setTempPhoto(null)
    setShowCameraModal(false)
    setCameraActive(false)
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(t => t.stop())
    }
  }

  async function handleAbsen(status: "HADIR" | "IZIN") {
    if (status === "HADIR") {
      if (!capturedPhoto || !capturedScreenshot) {
        setMsg({ type: "error", text: "Lengkapi bukti selfie dan screenshot terlebih dahulu!" }); return
      }
    } else if (status === "IZIN") {
      if (izinSubtype === "IZIN" && !capturedIzinPhoto) {
        setMsg({ type: "error", text: "Wajib melampirkan foto/upload surat izin!" }); return
      }
      if (!alasan || !alasan.trim()) {
        setMsg({ type: "error", text: "Keterangan wajib diisi!" }); return
      }
    }

    setLoading(true); setMsg(null); setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) { clearInterval(interval); return 95; }
        return prev + 5
      })
    }, 150)

    const res = await submitKehadiranAction(
      izinSubtype === "LAINNYA" ? "LAINNYA" as any : status, 
      status === "HADIR" ? capturedPhoto || undefined : capturedIzinPhoto || undefined, 
      capturedScreenshot || undefined, 
      alasan || undefined
    )
    
    clearInterval(interval)
    setUploadProgress(100)

    if (res?.error) {
      setMsg({ type: "error", text: res.error })
      setUploadProgress(0)
    } else {
      setMsg({ type: "success", text: "Data kehadiran berhasil dikirim!" })
      setSubmittedStatus(status); setShowIzinModal(false); setAlasan("")
    }
    setLoading(false)
  }

  return (
    <div className={styles.pageContainer}>
      
      {/* 1. COMMAND CENTER HEADER */}
      <section className={styles.headerSection}>
        <div className={styles.headerContent}>
            <h1>Portal Absensi</h1>
            <p>Selesaikan absensi harian Anda hari ini.</p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ background: '#f1f5f9', padding: '10px 14px', borderRadius: '10px', color: '#0f172a', fontWeight: 800, fontSize: '1.25rem', fontVariantNumeric: 'tabular-nums', width: '50px', textAlign: 'center' }}>
                        {currentTime ? new Intl.DateTimeFormat("id-ID", { hour: '2-digit', timeZone: 'Asia/Jakarta' }).format(currentTime) : "00"}
                    </div>
                    <span style={{ color: '#cbd5e1', fontWeight: 800, fontSize: '1.2rem' }}>:</span>
                    <div style={{ background: '#f1f5f9', padding: '10px 14px', borderRadius: '10px', color: '#0f172a', fontWeight: 800, fontSize: '1.25rem', fontVariantNumeric: 'tabular-nums', width: '50px', textAlign: 'center' }}>
                        {currentTime ? new Intl.DateTimeFormat("id-ID", { minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(currentTime) : "00"}
                    </div>
                    <span style={{ color: '#cbd5e1', fontWeight: 800, fontSize: '1.2rem' }}>:</span>
                    <div style={{ background: '#f1f5f9', padding: '10px 14px', borderRadius: '10px', color: '#0f172a', fontWeight: 800, fontSize: '1.25rem', fontVariantNumeric: 'tabular-nums', width: '50px', textAlign: 'center' }}>
                        {currentTime ? new Intl.DateTimeFormat("id-ID", { second: '2-digit', timeZone: 'Asia/Jakarta' }).format(currentTime) : "00"}
                    </div>
                    <div style={{ background: '#e2e8f0', padding: '10px 12px', color: '#475569', fontWeight: 800, fontSize: '1rem', marginLeft: '4px', borderRadius: '10px' }}>
                        WIB
                    </div>
                </div>
                {currentTime && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#64748b', paddingLeft: '4px' }}>
                        <IconClock />
                        {new Intl.DateTimeFormat("id-ID", { dateStyle: 'full', timeZone: 'Asia/Jakarta' }).format(currentTime)}
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* 2. MAIN INTERACTIVE AREA */}
      <div className={styles.statusCard}>
        {isClosed ? (
            <div style={{ width: "100%", maxWidth: "640px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              
              {/* IMAGE HEADER */}
              {holidayImage ? (
                <div style={{ width: "100%", position: "relative", marginBottom: "24px", borderRadius: "24px", overflow: "hidden" }}>
                  <img src={holidayImage} alt="Banner Libur" style={{ width: "100%", height: "auto", display: "block" }} />
                  {/* Efek Memudar (Fade Effect) */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))" }}></div>
                </div>
              ) : (
                <div className={styles.successIcon} style={{ background: '#fef2f2', color: '#ef4444', margin: '0 auto 32px', width: '88px', height: '88px' }}>
                  <IconAlert />
                </div>
              )}
  
              {/* TITLE */}
              <h2 style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontWeight: 950, color: "#0f172a", margin: "0 0 32px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                HARI LIBUR OPERASIONAL
              </h2>
  
              {/* MESSAGE BLOCK */}
              <div style={{
                background: "#f8fafc",
                padding: "clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "clamp(8px, 2vw, 12px)",
                width: "100%",
                maxWidth: "420px",
                margin: "0 auto",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
              }}>
                <div style={{ 
                  width: "clamp(28px, 6vw, 36px)", height: "clamp(28px, 6vw, 36px)", 
                  flexShrink: 0,
                  background: "#eff6ff", 
                  color: "#3b82f6", 
                  borderRadius: "8px", 
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid #bfdbfe"
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </div>
                <p 
                  style={{ color: "#334155", fontSize: "clamp(0.75rem, 2.5vw, 0.85rem)", fontWeight: 700, margin: 0, lineHeight: 1.4, textAlign: "left" }}
                  dangerouslySetInnerHTML={{ __html: message }}
                />
              </div>
            </div>
        ) : hasAttendance || submittedStatus ? (
            <div style={{ padding: "12px" }}>
              <div className={styles.successIcon} style={{ background: activeStatus === 'HADIR' ? '#f0fdf4' : '#eff6ff', color: activeStatus === 'HADIR' ? '#16a34a' : '#0f172a', margin: '0 auto 32px' }}>
                {activeStatus === "HADIR" ? <IconCheck /> : <IconFileText />}
              </div>
              <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a", margin: 0 }}>{activeStatus === "HADIR" ? "Presensi Selesai" : "Pengajuan Diterima"}</h2>
              <p style={{ marginTop: "16px", color: "#64748b", fontWeight: 600, maxWidth: '480px', margin: '16px auto', lineHeight: 1.6 }}>
                {activeStatus === "HADIR" 
                  ? "Data kehadiran Anda telah berhasil divalidasi oleh sistem. Pastikan untuk tetap produktif hari ini." 
                  : "Dokumen absensi non-kehadiran Anda telah masuk ke sistem dan akan diproses oleh manajemen."}
              </p>
            </div>
        ) : (
            <div style={{ width: "100%" }}>
              <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Input Kehadiran</h2>
                  <div onClick={() => setShowPolicyModal(true)} style={{ color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eff6ff', borderRadius: '50%', padding: '4px' }} title="Lihat Panduan Presensi">
                    <IconInfo />
                  </div>
                </div>
                <p style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 500, margin: 0 }}>Sertakan bukti selfie dan screenshot sebagai lampiran wajib.</p>
            </div>

            {msg && msg.type === "error" && (
                <div className={msg.text.includes("kamera") ? styles.errorAlertBox : `${styles.alertBox} ${styles.errorAlert}`} style={!msg.text.includes("kamera") ? { marginBottom: '32px' } : undefined}>
                  {msg.text.includes("kamera") ? (
                    <>
                      <div className={styles.errorAlertContent}>
                        <div className={styles.errorIcon}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        </div>
                        <span>{msg.text}</span>
                      </div>
                      <button onClick={startCamera} className={styles.retryBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                        Beri Akses
                      </button>
                    </>
                  ) : (
                    <span>{msg.text}</span>
                  )}
                </div>
            )}

            <div className={styles.captureGrid}>
              <div className={styles.captureColumn}>
                <div className={styles.stepIndicator}>
                    <div className={styles.stepCircle}>1</div>
                    <span className={styles.stepLabel}>Verify Face Identity</span>
                </div>
                <div className={`${styles.captureBox} ${capturedPhoto ? styles.activeCaptureBox : ""}`}>
                  {capturedPhoto ? (
                    <>
                      <img src={capturedPhoto} alt="Selfie" className={styles.previewImage} style={{ transform: 'scaleX(-1)' }} />
                      <button onClick={() => { setCapturedPhoto(null); startCamera(); }} className={styles.reCaptureBtn}>×</button>
                    </>
                  ) : (
                    <div onClick={startCamera} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '24px 0', width: '100%', height: '100%', justifyContent: 'center' }}>
                      <div className={styles.actionIcon} style={{ background: '#eff6ff', color: '#3b82f6', width: '64px', height: '64px', borderRadius: '50%', marginBottom: '16px', border: 'none', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)' }}><IconFaceId /></div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Ambil Swafoto</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginTop: '6px', textAlign: 'center', padding: '0 12px' }}>Wajah harus terlihat jelas di dalam bingkai</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.captureColumn}>
                <div className={styles.stepIndicator}>
                    <div className={styles.stepCircle}>2</div>
                    <span className={styles.stepLabel}>Application Screenshot</span>
                </div>
                <div className={`${styles.captureBox} ${capturedScreenshot ? styles.activeCaptureBox : ""}`}>
                  {capturedScreenshot ? (
                    <>
                      <img src={capturedScreenshot} alt="Screenshot" className={styles.previewImage} />
                      <button onClick={() => setCapturedScreenshot(null)} className={styles.reCaptureBtn}>×</button>
                    </>
                  ) : (
                    <label style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <input type="file" accept="image/*" onChange={handleScreenshot} style={{ display: "none" }} />
                      <div className={styles.actionIcon} style={{ background: '#eff6ff', color: '#3b82f6', width: '64px', height: '64px', borderRadius: '50%', marginBottom: '16px', border: 'none', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)' }}><IconCloudUpload /></div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Unggah Bukti</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginTop: '6px', textAlign: 'center', padding: '0 12px' }}>Screenshot log aplikasi/lokasi</span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />

            <div className={styles.actionArea}>
              <button className={styles.primaryBtn} onClick={() => handleAbsen("HADIR")} disabled={loading || !capturedPhoto || !capturedScreenshot}>
                {loading ? (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ fontSize: '0.85rem' }}>MENGUNGGAH ({uploadProgress}%)</div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${uploadProgress}%`, height: '100%', background: '#fff', transition: 'width 0.2s ease-out' }} />
                    </div>
                  </div>
                ) : ( <> <IconSend /> KIRIM DATA KEHADIRAN </> )}
              </button>
              <button className={styles.secondaryBtn} onClick={() => setShowIzinModal(true)} disabled={loading}>
                PENGAJUAN IZIN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2.5 CAMERA MODAL */}
      {showCameraModal && (
        <div className={`${styles.modalOverlay} ${styles.cameraOverlay}`} style={{ zIndex: 9999 }}>
          <div className={`${styles.modal} ${styles.cameraModal}`}>
            
            <button onClick={closeCameraModal} className={styles.closeCameraBtn} aria-label="Tutup Kamera">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div className={styles.cameraVideoContainer} style={{ flexDirection: 'column', display: tempPhoto ? 'none' : 'flex', background: '#000', position: 'relative', height: '100vh' }}>
              <video ref={videoRef} autoPlay playsInline className={styles.cameraVideoElement} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'block', transform: 'scaleX(-1)', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '40px 24px 32px 24px', background: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', zIndex: 5 }}>
                <div onClick={takePhoto} className={styles.shutterBtn} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <div className={styles.shutterBtnInner}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {tempPhoto && (
               <div className={styles.cameraVideoContainer} style={{ flexDirection: 'column', background: '#000', position: 'relative', height: '100vh' }}>
                 <img src={tempPhoto} className={styles.cameraVideoElement} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'block', transform: 'scaleX(-1)', objectFit: 'cover' }} alt="Temp Selfie" />
                 <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '40px 20px 32px 20px', background: 'transparent', display: 'flex', gap: '16px', zIndex: 5 }}>
                    <button onClick={() => setTempPhoto(null)} style={{ width: '56px', height: '56px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', background: 'rgba(241, 245, 249, 0.95)', backdropFilter: 'blur(10px)', color: '#334155', border: '1px solid rgba(203, 213, 225, 0.6)', borderRadius: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'transform 0.15s' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    </button>
                    <button onClick={savePhoto} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '56px', boxSizing: 'border-box', background: '#0f172a', color: '#ffffff', border: '1px solid #0f172a', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', boxShadow: '0 6px 16px rgba(15, 23, 42, 0.25)', transition: 'transform 0.15s' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      GUNAKAN FOTO
                    </button>
                 </div>
               </div>
            )}
          </div>
        </div>
      )}

      {/* 3. POLICY MODAL */}
      {showPolicyModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPolicyModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '320px', padding: '24px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ color: '#0f172a', display: 'flex', alignItems: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: '-0.02em' }}>Ketentuan Absensi</h2>
              </div>
              <button onClick={() => setShowPolicyModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}>&times;</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
              {[
                { i: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, t: 'Window Transaksi', d: 'Layanan absensi aktif pukul 07.00 - 10.00 WIB. Pastikan internet stabil.' },
                { i: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, t: 'Validasi Multi-Bukti', d: 'Sistem mewajibkan lampiran visual wajah dan bukti aplikasi sebagai syarat sah.' },
                { i: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><path d="M10 9H8"/></svg>, t: 'Status Non-Hadir', d: 'Bentuk izin/ketidakhadiran wajib disertai dokumen pendukung sebelum batas waktu.' },
                { i: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>, t: 'Timestamp Server', d: 'Absensi menggunakan waktu server Jakarta yang tidak dapat dimanipulasi.' },
                { i: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, t: 'Pemeriksaan Berlapis', d: 'HRD akan melakukan audit berkala. Manipulasi data akan dikenakan sanksi.' },
                { i: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>, t: 'Dukungan Teknis', d: 'Jika terjadi kendala sistem (Error), hubungi tim IT beserta lampiran screenshot.' }
              ].map((p, idx) => (
                <div key={idx} className={styles.policyItem} style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div className={styles.policyNumber} style={{ width: '28px', height: '28px', minWidth: '28px', background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                    {p.i}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h4 className={styles.policyTitle} style={{ fontSize: '0.85rem', margin: 0 }}>{p.t}</h4>
                    <p className={styles.policyText} style={{ fontSize: '0.75rem', margin: 0, color: '#64748b', lineHeight: 1.4 }}>{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL PENGAJUAN IZIN */}
      {showIzinModal && (
        <div className={styles.modalOverlay} onClick={() => { if(!loading) setShowIzinModal(false); }}>
          <div className={styles.modal} style={{ maxWidth: '420px', padding: '28px 24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '14px', color: '#3b82f6' }}><IconFileText /></div>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0f172a", margin: 0 }}>Pengajuan Izin</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>Formulir absensi non-hadir</p>
              </div>
            </div>

            <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', marginBottom: '20px' }}>
              <button onClick={() => setIzinSubtype("IZIN")} style={{ flex: 1, padding: '10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, border: 'none', cursor: 'pointer', background: izinSubtype === "IZIN" ? '#ffffff' : 'transparent', color: izinSubtype === "IZIN" ? '#0f172a' : '#64748b', boxShadow: izinSubtype === "IZIN" ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}>IZIN / SAKIT</button>
              <button onClick={() => setIzinSubtype("LAINNYA")} style={{ flex: 1, padding: '10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, border: 'none', cursor: 'pointer', background: izinSubtype === "LAINNYA" ? '#ffffff' : 'transparent', color: izinSubtype === "LAINNYA" ? '#0f172a' : '#64748b', boxShadow: izinSubtype === "LAINNYA" ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}>LAINNYA</button>
            </div>
            
            {izinSubtype === "IZIN" && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '8px' }}>Bukti Dokumen (Surat Dokter/Keterangan)</label>
                <div className={`${styles.captureBox} ${capturedIzinPhoto ? styles.activeCaptureBox : ""}`} style={{ height: '180px', borderRadius: '12px', border: capturedIzinPhoto ? '2px solid #3b82f6' : '1px solid #e2e8f0', background: capturedIzinPhoto ? '#f8fafc' : '#ffffff' }}>
                  {capturedIzinPhoto ? (
                    <>
                      <img src={capturedIzinPhoto} alt="Lampiran" className={styles.previewImage} style={{ borderRadius: '10px', objectFit: 'contain', padding: '4px' }} />
                      <button onClick={() => setCapturedIzinPhoto(null)} className={styles.reCaptureBtn} style={{ top: '8px', right: '8px' }}>×</button>
                    </>
                  ) : izinCameraActive ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline className={styles.videoElement} style={{ borderRadius: '10px' }} />
                      <button onClick={async () => {
                        if (videoRef.current && canvasRef.current) {
                          const video = videoRef.current; const canvas = canvasRef.current
                          canvas.width = video.videoWidth; canvas.height = video.videoHeight
                          const ctx = canvas.getContext("2d")
                          if (ctx) {
                            ctx.drawImage(video, 0, 0); const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
                            const compressed = await compressImage(dataUrl, 1000, 1000)
                            setCapturedIzinPhoto(compressed); const stream = video.srcObject as MediaStream
                            if (stream) stream.getTracks().forEach(t => t.stop())
                            setIzinCameraActive(false)
                          }
                        }
                      }} className={styles.snapBtn} style={{ fontSize: '0.75rem', padding: '8px 16px', borderRadius: '20px', bottom: '8px' }}>AMBIL FOTO</button>
                    </>
                  ) : (
                    <label style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader(); reader.onloadend = async () => {
                            const compressed = await compressImage(reader.result as string, 1200, 1200)
                            setCapturedIzinPhoto(compressed)
                          }; reader.readAsDataURL(file)
                        }
                      }} />
                      <div className={styles.actionIcon} style={{ background: '#eff6ff', color: '#3b82f6', width: '56px', height: '56px', borderRadius: '50%', marginBottom: '12px', border: 'none', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconCloudUpload />
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Unggah Bukti</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginTop: '4px', textAlign: 'center', padding: '0 12px' }}>Surat Izin / Keterangan Dokter</span>
                    </label>
                  )}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '8px' }}>Keterangan / Alasan Lengkap</label>
              <textarea className={styles.textArea} placeholder="Tuliskan alasan Anda di sini..." value={alasan} onChange={(e) => setAlasan(e.target.value)} rows={3} style={{ borderRadius: '12px', padding: '12px', fontSize: '0.9rem', border: '1px solid #e2e8f0', background: '#f8fafc' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className={styles.secondaryBtn} onClick={() => { setShowIzinModal(false); setAlasan(""); setCapturedIzinPhoto(null); setIzinCameraActive(false); }} disabled={loading} style={{ flex: 1, padding: '14px', borderRadius: '12px' }}>BATAL</button>
              <button className={styles.primaryBtn} onClick={() => handleAbsen("IZIN")} disabled={loading || (izinSubtype === "IZIN" && !capturedIzinPhoto) || !alasan.trim()} style={{ flex: 2, padding: '14px', borderRadius: '12px' }}>
                {loading ? "PROSES..." : "KIRIM PENGAJUAN"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL CARA PERBAIKI IZIN KAMERA */}
      {showFixModal && (
        <div className={styles.modalOverlay} onClick={() => setShowFixModal(false)}>
          <div className={styles.modal} style={{ maxWidth: '320px', padding: '24px 20px' }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ background: '#fff1f2', padding: '10px', borderRadius: '14px', color: '#e11d48', display: 'inline-flex', marginBottom: '12px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              </div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#0f172a", margin: 0 }}>Akses Terblokir</h2>
              <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '0.8rem', lineHeight: 1.4 }}>Browser menolak akses kamera. Ikuti panduan ini:</p>
            </div>
            
            {/* ANIMATED VISUAL GUIDE FULL CYCLE */}
            <div style={{ background: '#f8fafc', padding: '16px 12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', justifyContent: 'center', position: 'relative', height: '120px' }}>
              <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '6px', width: '200px', height: '32px', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', position: 'relative', zIndex: 10 }}>
                {/* Lock pulse */}
                <div style={{ position: 'absolute', inset: '-3px', border: '2px solid rgba(225, 29, 72, 0.4)', borderRadius: '24px', opacity: 0, animation: 'pulseLock 6s infinite' }}></div>
                <div style={{ color: '#0f172a', display: 'flex', zIndex: 1 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#0f172a', fontWeight: 700, letterSpacing: '-0.01em' }}>app.rmpid.com</span>
                
                {/* Fake Dropdown */}
                <div className={styles.mockDropdown} style={{ position: 'absolute', top: '40px', left: '0px', background: 'white', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '12px', width: '200px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', opacity: 0, transform: 'translateY(-10px)', pointerEvents: 'none', zIndex: 5 }}>
                  <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Pengaturan Situs</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', fontSize: '0.75rem', fontWeight: 600 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                      Kamera
                    </div>
                    {/* Simulated Block -> Allow Toggle */}
                    <div style={{ position: 'relative', width: '54px', height: '22px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div className={styles.mockToggleBlock} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fee2e2', color: '#e11d48', fontSize: '0.65rem', fontWeight: 700 }}>Blokir</div>
                      <div className={styles.mockToggleAllow} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dcfce7', color: '#16a34a', fontSize: '0.65rem', fontWeight: 700 }}>Izinkan</div>
                    </div>
                  </div>
                </div>

                {/* Simulated cursor */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', animation: 'moveCursorFull 6s infinite', zIndex: 20 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#0f172a" stroke="white" strokeWidth="1.5"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', textAlign: 'left' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ color: '#0f172a', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontWeight: 800, fontSize: '0.7rem', flexShrink: 0 }}>1</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Klik Ikon Gembok
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>Klik ikon di sisi kiri alamat web Anda (atas).</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ color: '#0f172a', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>2</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>Buka Menu Izin (Permissions)</p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>Cari menu pengaturan situs (Site Settings).</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ color: '#0f172a', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>3</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>Izinkan Kamera (Allow)</p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>Ubah opsi dari "Blokir" menjadi "Izinkan".</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className={styles.secondaryBtn} style={{ flex: 1, padding: '12px 0' }} onClick={() => setShowFixModal(false)}>
                Tutup
              </button>
              <button className={styles.primaryBtn} style={{ flex: 1.5, padding: '12px 0', background: '#0f172a', boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.15)' }} onClick={() => { setShowFixModal(false); window.location.reload(); }}>
                Muat Ulang
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
