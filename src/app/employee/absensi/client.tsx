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
  existingStatus
}: { 
  isClosed: boolean, 
  message: string, 
  hasAttendance: boolean,
  existingStatus?: string
}) {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{type: "error"|"success", text: string} | null>(null)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [capturedScreenshot, setCapturedScreenshot] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [showIzinModal, setShowIzinModal] = useState(false)
  const [alasan, setAlasan] = useState("")
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null)
  
  const activeStatus = submittedStatus || existingStatus
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setCapturedScreenshot(reader.result as string)
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

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current; const canvas = canvasRef.current
      canvas.width = video.videoWidth; canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0); const dataUrl = canvas.toDataURL("image/jpeg")
        setCapturedPhoto(dataUrl); const stream = video.srcObject as MediaStream
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
    } else if (status === "IZIN" && (!alasan || !alasan.trim())) {
      setMsg({ type: "error", text: "Alasan izin wajib diisi!" }); return
    }

    setLoading(true); setMsg(null)
    const res = await submitKehadiranAction(status, capturedPhoto || undefined, capturedScreenshot || undefined, alasan || undefined)
    if (res?.error) {
      setMsg({ type: "error", text: res.error })
    } else {
      setMsg({ type: "success", text: "Data kehadiran berhasil dikirim!" })
      setSubmittedStatus(status); setShowIzinModal(false); setAlasan("")
    }
    setLoading(false)
  }

  return (
    <div className={styles.pageContainer}>
      
      {/* 1. CLEAN HEADER SECTION */}
      <section className={styles.headerSection}>
        <div className={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ color: '#1e3a8a' }}><IconClock /></div>
            <h1>Portal Absensi Digital</h1>
          </div>
          <p>Lakukan pencatatan kehadiran harian Anda dengan melampirkan bukti yang diperlukan.</p>
        </div>
      </section>

      {msg && msg.type === "error" && (
        <div className={`${styles.alertBox} ${styles.errorAlert}`}>
          {msg.text}
        </div>
      )}

      {/* 2. MAIN STATUS CARD */}
      <div className={styles.statusCard}>
        {isClosed ? (
          <div style={{ padding: "8px" }}>
            <div style={{ color: '#ef4444', marginBottom: '20px' }}><IconAlert /></div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: '-0.02em' }}>Portal Terkunci</h2>
            <p style={{ marginTop: "12px", color: "#64748b", fontWeight: "500", maxWidth: '400px', margin: '12px auto' }}>{message}</p>
          </div>
        ) : hasAttendance || submittedStatus ? (
          <div style={{ padding: "8px" }}>
            <div className={styles.successIcon} style={{ background: activeStatus === 'HADIR' ? '#f0fdf4' : '#eff6ff', color: activeStatus === 'HADIR' ? '#16a34a' : '#1e3a8a', borderColor: activeStatus === 'HADIR' ? '#dcfce7' : '#dbeafe', margin: '0 auto 24px' }}>
              {activeStatus === "HADIR" ? <IconCheck /> : <IconFileText />}
            </div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: '-0.03em' }}>
              {activeStatus === "HADIR" ? "Presensi Berhasil" : "Izin Tercatat"}
            </h2>
            <p style={{ marginTop: "12px", color: "#64748b", fontWeight: "500", maxWidth: '450px' }}>
              {activeStatus === "HADIR" 
                ? "Terima kasih, data kehadiran Anda sudah masuk ke sistem. Selamat bekerja dan tetap produktif!" 
                : "Dokumen pengajuan izin Anda sudah kami terima dan akan segera diproses oleh admin."}
            </p>
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ color: '#1e3a8a' }}><IconClock /></div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#0f172a", margin: 0 }}>Input Kehadiran Hari Ini</h2>
            </div>
            <p style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: "500", textAlign: 'left', marginBottom: '32px' }}>Silakan selesaikan dua langkah verifikasi berikut untuk mencatat kehadiran Anda secara sah di sistem.</p>

            <div className={styles.captureGrid}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div className={styles.stepCircle}>1</div>
                    <span className={styles.stepLabel}>VERIFIKASI WAJAH / SELFIE</span>
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
                      <button onClick={takePhoto} className={styles.snapBtn}>AMBIL FOTO</button>
                    </>
                  ) : (
                    <div onClick={startCamera} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: '#1e3a8a' }}>
                      <div className={styles.actionIcon}><IconCamera /></div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.05em' }}>BUKA KAMERA</span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div className={styles.stepCircle}>2</div>
                    <span className={styles.stepLabel}>UNGGAH BUKTI SCREENSHOT APP</span>
                </div>
                <div className={`${styles.captureBox} ${capturedScreenshot ? styles.activeCaptureBox : ""}`}>
                  {capturedScreenshot ? (
                    <>
                      <img src={capturedScreenshot} alt="Screenshot" className={styles.previewImage} />
                      <button onClick={() => setCapturedScreenshot(null)} className={styles.reCaptureBtn}>×</button>
                    </>
                  ) : (
                    <label style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#1e3a8a', cursor: 'pointer' }}>
                      <input type="file" accept="image/*" onChange={handleScreenshot} style={{ display: "none" }} />
                      <div className={styles.actionIcon}><IconUpload /></div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.05em' }}>PILIH FILE</span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />

            <div className={styles.actionArea}>
              <button className={styles.primaryBtn} onClick={() => handleAbsen("HADIR")} disabled={loading || !capturedPhoto || !capturedScreenshot}>
                {loading ? "MENGIRIM..." : ( <> <IconSend /> KIRIM KEHADIRAN </> )}
              </button>
              <button className={styles.secondaryBtn} onClick={() => setShowIzinModal(true)} disabled={loading}>
                AJUKAN IZIN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. KETENTUAN & KEBIJAKAN PRESENSI */}
      <section className={styles.card} style={{ marginTop: '20px', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ color: '#1e3a8a' }}><IconShield /></div>
          <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#0f172a", margin: 0 }}>Ketentuan & Kebijakan Presensi</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className={styles.policyItem}>
             <div className={styles.policyNumber}>01</div>
             <div>
               <h4 className={styles.policyTitle}>Batas Waktu Harian</h4>
               <p className={styles.policyText}>Sistem presensi dibuka mulai pukul 07:00 hingga 10:00 WIB. Presensi di luar jam tersebut akan dianggap terlambat/alfa.</p>
             </div>
          </div>

          <div className={styles.policyItem}>
             <div className={styles.policyNumber}>02</div>
             <div>
               <h4 className={styles.policyTitle}>Lampiran Wajib</h4>
               <p className={styles.policyText}>Setiap karyawan wajib menyertakan foto selfie (wajah jelas) dan screenshot aplikasi yang aktif untuk divalidasi oleh HRD.</p>
             </div>
          </div>

          <div className={styles.policyItem}>
             <div className={styles.policyNumber}>03</div>
             <div>
               <h4 className={styles.policyTitle}>Prosedur Izin/Sakit</h4>
               <p className={styles.policyText}>Pengajuan izin maksimal dilakukan SEBELUM pukul 10:00 WIB. Khusus sakit wajib melampirkan surat keterangan dokter ke kantor fisik.</p>
             </div>
          </div>

          <div className={styles.policyItem}>
             <div className={styles.policyNumber}>04</div>
             <div>
               <h4 className={styles.policyTitle}>Keamanan Data</h4>
               <p className={styles.policyText}>Setiap data kehadiran direkam dengan koordinat waktu server yang akurat. Manipulasi data akan dikenakan sanksi sesuai SP Kepegawaian.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. MODAL IZIN (Clean Popup) */}
      {showIzinModal && (
        <div className={styles.modalOverlay} onClick={() => setShowIzinModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '50%', color: '#1e3a8a', display: 'inline-flex', marginBottom: '16px' }}><IconFileText /></div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0f172a", margin: 0 }}>Pengajuan Izin</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Sebutkan alasan atau keterangan sakit Anda di bawah ini.</p>
            </div>
            
            <textarea className={styles.textArea} placeholder="Tulis alasan lengkap..." value={alasan} onChange={(e) => setAlasan(e.target.value)} rows={4} />

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <button className={styles.primaryBtn} onClick={() => handleAbsen("IZIN")} disabled={loading || !alasan.trim()}>
                {loading ? "KIRIM..." : "KIRIM IZIN"}
              </button>
              <button className={styles.secondaryBtn} onClick={() => { setShowIzinModal(false); setAlasan(""); }} disabled={loading}>
                BATAL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
