"use client"

import { useState, useRef } from "react"
import { submitKehadiranAction } from "@/actions/employeeUser"
import styles from "@/styles/absensi_karyawan.module.css"

// Professional Line Icons
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
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><path d="M10 9H8"/></svg>
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
  
  const activeStatus = submittedStatus || existingStatus
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
    setMsg(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch (err) {
      setMsg({ type: "error", text: "Gagal mengakses kamera. Pastikan izin diberikan." })
      setCameraActive(false)
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
        setCapturedPhoto(compressed); const stream = video.srcObject as MediaStream
        if (stream) stream.getTracks().forEach(t => t.stop())
        setCameraActive(false)
      }
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
            <h1>Portal Absensi Digital</h1>
            <p>Selesaikan verifikasi harian Anda untuk validasi kehadiran hari ini.</p>
        </div>
        <div style={{ background: '#f8fafc', padding: '12px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#0f172a' }}><IconClock /></div>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0f172a' }}>
                {new Intl.DateTimeFormat("id-ID", { hour: '2-digit', minute: '2-digit' }).format(new Date())} <span style={{ opacity: 0.4 }}>WIB</span>
            </div>
        </div>
      </section>

      {/* 2. MAIN INTERACTIVE AREA */}
      <div className={styles.statusCard}>
        {isClosed ? (
          <div style={{ padding: "clamp(16px, 4vw, 32px)", textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {!holidayImage && (
              <div className={styles.successIcon} style={{ background: '#fef2f2', color: '#ef4444', margin: '0 auto 24px', width: '80px', height: '80px' }}>
                <IconAlert />
              </div>
            )}
            
            {holidayImage && (
              <div style={{ 
                marginBottom: 'clamp(24px, 5vw, 40px)', 
                borderRadius: 'clamp(16px, 4vw, 24px)', 
                overflow: 'hidden', 
                border: '1px solid rgba(0,0,0,0.05)', 
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', 
                background: '#f8fafc',
                width: '100%',
                maxWidth: '600px'
              }}>
                  <img src={holidayImage} alt="Pengumuman Libur" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }} />
              </div>
            )}

            <h2 style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontWeight: 950, color: "#0f172a", margin: 0, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                HARI LIBUR OPERASIONAL
            </h2>
            <div style={{ 
                marginTop: "clamp(16px, 4vw, 24px)", 
                padding: 'clamp(16px, 4vw, 24px)', 
                background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)', 
                borderRadius: '20px', 
                border: '1px solid #e2e8f0', 
                maxWidth: '500px',
                width: '100%'
            }}>
                <p style={{ color: "#475569", fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', fontWeight: 700, margin: 0, lineHeight: 1.6 }}>{message}</p>
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
            <div style={{ textAlign: 'left', marginBottom: '40px' }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0f172a", margin: '0 0 12px' }}>Input Kehadiran</h2>
                <p style={{ color: "#64748b", fontSize: "0.95rem", fontWeight: 600, margin: 0 }}>Sertakan bukti selfie dan screenshot aplikasi yang aktif sebagai lampiran wajib.</p>
            </div>

            {msg && msg.type === "error" && (
                <div className={styles.alertBox} style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fee2e2', marginBottom: '32px' }}>{msg.text}</div>
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
                      <img src={capturedPhoto} alt="Selfie" className={styles.previewImage} />
                      <button onClick={() => { setCapturedPhoto(null); startCamera(); }} className={styles.reCaptureBtn}>×</button>
                    </>
                  ) : cameraActive ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline className={styles.videoElement} />
                      <button onClick={takePhoto} className={styles.snapBtn}>AMBIL FOTO SEKARANG</button>
                    </>
                  ) : (
                    <div onClick={startCamera} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div className={styles.actionIcon}><IconCamera /></div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0f172a' }}>START CAMERA</span>
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
                      <div className={styles.actionIcon}><IconUpload /></div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0f172a' }}>UPLOAD CAPTURE</span>
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

      {/* 3. POLICY GRID SECTION */}
      <section className={styles.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ color: '#0f172a' }}><IconShield /></div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0f172a", margin: 0 }}>Panduan & Integritas Presensi</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { n: '01', t: 'Window Transaksi', d: 'Layanan absensi aktif pukul 07.00 - 10.00 WIB. Pastikan perangkat Anda terhubung ke internet yang stabil.' },
            { n: '02', t: 'Validasi Multi-Bukti', d: 'Sistem mewajibkan lampiran visual wajah dan bukti aplikasi sebagai syarat sah penerimaan data oleh manajemen.' },
            { n: '03', t: 'Status Non-Hadir', d: 'Segala bentuk izin atau ketidakhadiran lainnya wajib disertai dokumen pendukung dan dikirim sebelum batas waktu.' },
            { n: '04', t: 'Timestamp Server', d: 'Absensi menggunakan waktu server Jakarta yang tidak dapat dimanipulasi melalui pengaturan waktu perangkat lokal.' },
            { n: '05', t: 'Pemeriksaan Berlapis', d: 'HRD akan melakukan audit berkala. Manipulasi data atau ketidaksesuaian bukti selfie akan dikenakan sanksi disipliner.' },
            { n: '06', t: 'Dukungan Teknis', d: 'Jika terjadi kendala sistem (Error), segera hubungi tim IT dengan melampirkan bukti screenshot kendala tersebut.' }
          ].map(p => (
            <div key={p.n} className={styles.policyItem}>
              <div className={styles.policyNumber}>{p.n}</div>
              <div>
                <h4 className={styles.policyTitle}>{p.t}</h4>
                <p className={styles.policyText}>{p.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MODAL PENGAJUAN IZIN */}
      {showIzinModal && (
        <div className={styles.modalOverlay} onClick={() => { if(!loading) setShowIzinModal(false); }}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '20px', color: '#0f172a', display: 'inline-flex', marginBottom: '16px', border: '1px solid #e2e8f0' }}><IconFileText /></div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0f172a", margin: 0 }}>Pengajuan Non-Aktif</h2>
              <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Sertakan dokumen pendukung untuk divalidasi.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
              <button onClick={() => setIzinSubtype("IZIN")} style={{ padding: '10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '900', border: 'none', cursor: 'pointer', background: izinSubtype === "IZIN" ? '#fff' : 'transparent', color: izinSubtype === "IZIN" ? '#0f172a' : '#94a3b8', boxShadow: izinSubtype === "IZIN" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>IZIN / SAKIT</button>
              <button onClick={() => setIzinSubtype("LAINNYA")} style={{ padding: '10px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '900', border: 'none', cursor: 'pointer', background: izinSubtype === "LAINNYA" ? '#fff' : 'transparent', color: izinSubtype === "LAINNYA" ? '#0f172a' : '#94a3b8', boxShadow: izinSubtype === "LAINNYA" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>LAINNYA</button>
            </div>
            
            {izinSubtype === "IZIN" && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', display: 'block', marginBottom: '12px', textTransform: 'uppercase' }}>Unggah Surat Izin / Keterangan Dokter</label>
                <div className={`${styles.captureBox} ${capturedIzinPhoto ? styles.activeCaptureBox : ""}`} style={{ height: '140px' }}>
                  {capturedIzinPhoto ? (
                    <>
                      <img src={capturedIzinPhoto} alt="Lampiran" className={styles.previewImage} />
                      <button onClick={() => setCapturedIzinPhoto(null)} className={styles.reCaptureBtn}>×</button>
                    </>
                  ) : izinCameraActive ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline className={styles.videoElement} />
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
                      }} className={styles.snapBtn} style={{ fontSize: '0.7rem', padding: '8px 16px' }}>AMBIL FOTO</button>
                    </>
                  ) : (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={async () => {
                        setIzinCameraActive(true)
                        try {
                          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
                          if (videoRef.current) videoRef.current.srcObject = stream
                        } catch (err) { setIzinCameraActive(false); }
                      }} className={styles.secondaryBtn} style={{ padding: '10px 16px', fontSize: '0.75rem' }}>KAMERA</button>
                      <label className={styles.secondaryBtn} style={{ padding: '10px 16px', fontSize: '0.75rem', cursor: 'pointer' }}>
                        UPLOAD <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader(); reader.onloadend = async () => {
                              const compressed = await compressImage(reader.result as string, 1200, 1200)
                              setCapturedIzinPhoto(compressed)
                            }; reader.readAsDataURL(file)
                          }
                        }} />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: '900', color: '#94a3b8', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Keterangan Penjelasan</label>
              <textarea className={styles.textArea} placeholder="Tuliskan alasan lengkap..." value={alasan} onChange={(e) => setAlasan(e.target.value)} rows={3} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <button className={styles.primaryBtn} onClick={() => handleAbsen("IZIN")} disabled={loading || (izinSubtype === "IZIN" && !capturedIzinPhoto) || !alasan.trim()}>
                {loading ? "PROSES..." : "KIRIM DATA"}
              </button>
              <button className={styles.secondaryBtn} onClick={() => { setShowIzinModal(false); setAlasan(""); setCapturedIzinPhoto(null); setIzinCameraActive(false); }} disabled={loading}>BATAL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
