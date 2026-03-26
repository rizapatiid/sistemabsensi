import prisma from "@/lib/prisma"
import { getSession } from "@/actions/auth"
import styles from "@/styles/admin.module.css"
import Link from "next/link"

// Komponen Icon SVG sederhana
const IconAbsen = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M12 18v-6" />
    <path d="M8 15h8" />
  </svg>
)

const IconPayroll = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
)

const IconProfile = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const IconAnnounce = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a3 3 0 0 1 3 3 3 3 0 0 1-3 3h-3c-1 0-2 0-3 .5S10 16 10 16v1a1 1 0 1 1-2 0v-1c0-1 0-2-.5-3S4 11 4 11a3 3 0 0 1 3-3h11z" />
    <path d="M10 8V5a2 2 0 0 1 2-2 2 2 0 0 1 2 2v3" />
    <path d="M7 14v4a2 2 0 0 0 2 2h1" />
  </svg>
)

const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

export default async function EmployeeHomePage() {
  const session = await getSession()
  if (!session) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 1. Data User
  const user = await prisma.user.findUnique({ where: { id: session.id } })

  // 2. Data Absensi Bulan Ini
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  
  const monthlyAttendances = await prisma.attendance.findMany({
    where: {
      idKaryawan: session.id,
      tanggal: { gte: firstDay, lte: lastDay }
    }
  })

  // 3. Cek Status Hari Ini
  const isHoliday = await prisma.calendar.findFirst({
    where: { tanggal: today }
  })
  const hasAbsenToday = await prisma.attendance.findUnique({
    where: { idKaryawan_tanggal: { idKaryawan: session.id, tanggal: today } }
  })
  const isWeekend = today.getDay() === 0 || today.getDay() === 6

  // 4. Pengumuman Terjadwal
  const announcements = await prisma.announcement.findMany({ 
    where: {
      OR: [
        { scheduleDate: null },
        { scheduleDate: { lte: new Date() } }
      ]
    },
    orderBy: { tanggal: "desc" },
    take: 3
  })

  // 5. Histori Payroll Terakhir
  const lastPayroll = await prisma.payroll.findFirst({
    where: { idKaryawan: session.id },
    orderBy: [{ tahun: "desc" }, { bulan: "desc" }]
  })

  // 6. Kalender Libur Mendatang
  const upcomingHolidays = await prisma.calendar.findMany({
    where: { tanggal: { gte: today } },
    orderBy: { tanggal: "asc" },
    take: 3
  })

  const hadirCount = monthlyAttendances.filter(a => a.status === "HADIR").length
  const izinCount = monthlyAttendances.filter(a => a.status === "IZIN").length

  return (
    <div className={styles.pageContainer}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 className={styles.pageTitle} style={{ marginBottom: "5px" }}>Beranda Karyawan</h1>
          <p style={{ color: "#64748b" }}>Selamat datang kembali, <strong>{user?.nama}</strong></p>
        </div>
        <div style={{ textAlign: "right", fontSize: "0.9rem" }}>
          <div style={{ fontWeight: "700", color: "var(--primary)" }}>{new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(new Date())}</div>
          <div style={{ color: "#94a3b8" }}>{user?.jabatan}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.2)" }}>
          <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", marginBottom: "1rem" }}>STATUS HARI INI</div>
          {isWeekend || isHoliday ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ color: "#f59e0b", backgroundColor: "#fef3c7", padding: "10px", borderRadius: "12px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div>
                <div style={{ fontWeight: "700", color: "#f59e0b" }}>HARI LIBUR</div>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{isHoliday?.keterangan || "Akhir Pekan"}</div>
              </div>
            </div>
          ) : hasAbsenToday ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ color: "#10b981", backgroundColor: "#dcfce7", padding: "10px", borderRadius: "12px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <div style={{ fontWeight: "700", color: "#10b981" }}>SUDAH ABSEN</div>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Jam: {new Intl.DateTimeFormat("id-ID", { timeStyle: "short" }).format(hasAbsenToday.waktuMasuk)}</div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ color: "#ef4444", backgroundColor: "#fee2e2", padding: "10px", borderRadius: "12px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div>
                <div style={{ fontWeight: "700", color: "#ef4444" }}>BELUM ABSEN</div>
                <Link href="/employee/absensi" style={{ fontSize: "0.8rem", color: "#3b82f6", fontWeight: "600" }}>Ayo Absen Sekarang →</Link>
              </div>
            </div>
          )}
        </div>

        <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.2)" }}>
          <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", marginBottom: "1rem" }}>STATISTIK BULAN INI</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#10b981" }}>{hadirCount}</div>
              <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>HADIR</div>
            </div>
            <div style={{ width: "1px", height: "30px", backgroundColor: "#e2e8f0" }}></div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#f59e0b" }}>{izinCount}</div>
              <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>IZIN</div>
            </div>
            <div style={{ width: "1px", height: "30px", backgroundColor: "#e2e8f0" }}></div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#3b82f6" }}>{monthlyAttendances.length}</div>
              <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>TOTAL</div>
            </div>
          </div>
        </div>

        <div className="glass" style={{ padding: "1.5rem", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.2)" }}>
          <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", marginBottom: "1rem" }}>PAYROLL TERAKHIR</div>
          {lastPayroll ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "700" }}>Gaji {new Intl.DateTimeFormat("id-ID", { month: "short" }).format(new Date(2000, lastPayroll.bulan-1))} {lastPayroll.tahun}</div>
                <div style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: "600" }}>Rp {lastPayroll.totalGaji.toLocaleString("id-ID")}</div>
              </div>
              <Link href="/employee/transaksi" style={{ color: "#3b82f6", backgroundColor: "#eff6ff", padding: "10px", borderRadius: "12px" }}>
                <IconPayroll />
              </Link>
            </div>
          ) : (
            <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Belum ada histori gaji.</div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "var(--primary)" }}><IconAnnounce /></span> Papan Pengumuman
          </h2>
          {announcements.length === 0 ? (
            <div className="glass" style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Belum ada pengumuman terbaru.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {announcements.map(a => (
                <div key={a.id} className="glass" style={{ padding: "1.5rem", borderRadius: "16px", overflow: "hidden" }}>
                  <div style={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: "700", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Informasi • {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(a.tanggal)}
                  </div>
                  <h3 style={{ fontSize: "1.4rem", marginBottom: "1rem", color: "var(--primary)" }}>{a.judul}</h3>
                  {a.image && (
                    <div style={{ marginBottom: "1rem", borderRadius: "12px", overflow: "hidden", border: "1px solid #efefef" }}>
                      <img src={a.image} alt="" style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} />
                    </div>
                  )}
                  <p style={{ lineHeight: "1.7", color: "#334155", whiteSpace: "pre-wrap" }}>{a.konten}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Akses Cepat</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Link href="/employee/absensi" className="glass" style={{ padding: "1rem", borderRadius: "12px", textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "15px", transition: "0.2s" }}>
              <div style={{ width: "42px", height: "42px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconAbsen />
              </div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "0.9rem" }}>Absensi Harian</div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Input masuk & izin</div>
              </div>
            </Link>
            <Link href="/employee/transaksi" className="glass" style={{ padding: "1rem", borderRadius: "12px", textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ width: "42px", height: "42px", backgroundColor: "#e0f2fe", color: "#075985", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconPayroll />
              </div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "0.9rem" }}>Slip Gaji</div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Lihat riwayat payroll</div>
              </div>
            </Link>
            <Link href="/employee/profil" className="glass" style={{ padding: "1rem", borderRadius: "12px", textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ width: "42px", height: "42px", backgroundColor: "#fef3c7", color: "#92400e", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconProfile />
              </div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "0.9rem" }}>Profil Saya</div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Pengaturan data diri</div>
              </div>
            </Link>
          </div>

          <div style={{ marginTop: "2rem", padding: "1.5rem", borderRadius: "16px", background: "linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)", color: "white", boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)" }}>
            <div style={{ fontSize: "0.75rem", opacity: 0.8, fontWeight: "600", letterSpacing: "1px" }}>REKENING AKTIF</div>
            {user?.rekeningBank ? (
              <div style={{ marginTop: "1rem" }}>
                <div style={{ fontWeight: "800", fontSize: "1.1rem" }}>{user.rekeningBank}</div>
                <div style={{ fontSize: "1.3rem", fontWeight: "700", letterSpacing: "2px", margin: "8px 0", color: "white" }}>{user.noRekening}</div>
                <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>a.n. {user.namaRekening}</div>
              </div>
            ) : (
              <div style={{ marginTop: "1.5rem", fontSize: "0.8rem", fontStyle: "italic", opacity: 0.7 }}>Data rekening belum diatur.</div>
            )}
            <Link href="/employee/profil" style={{ display: "block", marginTop: "1.5rem", textAlign: "center", backgroundColor: "rgba(255,255,255,0.15)", padding: "10px", borderRadius: "10px", textDecoration: "none", color: "white", fontSize: "0.8rem", fontWeight: "600", backdropFilter: "blur(4px)" }}>Update Rekening</Link>
          </div>

          <div className="glass" style={{ marginTop: "2rem", padding: "1.5rem", borderRadius: "16px" }}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#ef4444" }}><IconCalendar /></span> Hari Libur
            </h2>
            {upcomingHolidays.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Tidak ada jadwal libur terdekat.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {upcomingHolidays.map(h => (
                  <div key={h.id} style={{ display: "flex", gap: "12px", alignItems: "flex-start", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: "6px 8px", borderRadius: "10px", textAlign: "center", minWidth: "55px" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: "800" }}>{new Intl.DateTimeFormat("id-ID", { month: "short" }).format(h.tanggal).toUpperCase()}</div>
                      <div style={{ fontSize: "1.2rem", fontWeight: "900" }}>{h.tanggal.getDate()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#1e293b" }}>{h.keterangan}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(h.tanggal)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
