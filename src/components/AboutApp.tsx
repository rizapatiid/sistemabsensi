"use client";

import React, { useState } from 'react';

export default function AboutApp() {
  const [activeTab, setActiveTab] = useState('informasi');

  return (
    <div className="about-container">
      <div className="about-wrapper">
        {/* Header Banner */}
        <div className="about-header">
          <img 
            src="/logositus.png" 
            alt="PT Riza Media Productions Logo" 
            className="about-logo"
          />
          <h1 className="about-title">
            Sistem Informasi Kehadiran Terpadu (SIKAT)
          </h1>
          <p className="about-version">
            Versi 1.0.0-Release <span className="status-dot"></span> Secure Build
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="tab-container">
          {[
            { id: 'informasi', label: 'Informasi Umum' },
            { id: 'privasi', label: 'Kebijakan Privasi' },
            { id: 'keamanan', label: 'Keamanan & Kepatuhan' },
            { id: 'bantuan', label: 'Layanan Bantuan' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          
          {/* TAB 1: Informasi Umum */}
          {activeTab === 'informasi' && (
            <div className="fade-in">
              <div className="section-block">
                <h2 className="section-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  Tentang Sistem
                </h2>
                <p className="paragraph">
                  Sistem Informasi Kehadiran Terpadu (SIKAT) yang dikembangkan oleh <strong>PT Riza Media Productions</strong> adalah solusi digital komprehensif tingkat *enterprise* yang dirancang khusus untuk merevolusi manajemen Sumber Daya Manusia (HR) secara modern. Sistem ini secara cerdas mengintegrasikan proses pencatatan kehadiran presisi, manajemen kompensasi finansial, evaluasi kedisiplinan, dan komunikasi internal dalam satu ekosistem terpadu tanpa hambatan (*seamless integration*).
                </p>
                <p className="paragraph">
                  Sistem kami tidak sekadar melakukan otomatisasi, melainkan menjadi fondasi utama dalam inisiatif transformasi digital operasional perusahaan Anda. Dibangun menggunakan arsitektur teknologi generasi terbaru, aplikasi ini difokuskan pada kecepatan akses, keandalan data (*data integrity*), dan pengalaman pengguna (*User Experience*) yang sangat intuitif baik di perangkat *desktop* maupun seluler.
                </p>
                <p className="paragraph">
                  Sistem Informasi Kehadiran Terpadu (SIKAT) yang dikembangkan oleh <strong>PT Riza Media Productions</strong> adalah solusi digital komprehensif tingkat *enterprise* yang dirancang khusus untuk merevolusi manajemen Sumber Daya Manusia (HR) secara modern. Sistem ini secara cerdas mengintegrasikan proses pencatatan kehadiran presisi, manajemen kompensasi finansial, evaluasi kedisiplinan, dan komunikasi internal dalam satu ekosistem terpadu tanpa hambatan (*seamless integration*).
                </p>
                <p className="paragraph">
                  Sistem kami tidak sekadar melakukan otomatisasi, melainkan menjadi fondasi utama dalam inisiatif transformasi digital operasional perusahaan Anda. Dibangun menggunakan arsitektur teknologi generasi terbaru, aplikasi ini difokuskan pada kecepatan akses, keandalan data (*data integrity*), dan pengalaman pengguna (*User Experience*) yang sangat intuitif baik di perangkat *desktop* maupun seluler. Kami menyadari bahwa efisiensi birokrasi adalah kunci keberhasilan bisnis, oleh karena itu setiap modul diciptakan untuk meminimalkan beban administratif HRD.
                </p>
                <p className="paragraph">
                  Berjalan di atas infrastruktur komputasi awan yang sangat tangguh (<em>highly-available cloud infrastructure</em>), sistem kami memberikan jaminan stabilitas akses operasional hingga 99.9% (SLA). Hal ini dirancang untuk memastikan kelancaran ritme kerja dengan skalabilitas tinggi, siap mengakomodasi pertumbuhan jumlah karyawan perusahaan Anda di masa mendatang secara dinamis tanpa penundaan atau interupsi layanan (*zero downtime deployment*). Selain itu, sistem pembaruan *over-the-air* memastikan organisasi Anda selalu mendapatkan teknologi mutakhir tanpa repot mengatur peladen lokal.
                </p>
              </div>

              <h2 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                Spesifikasi & Fitur Inti
              </h2>
              <div className="grid-container">
                {[
                  { title: 'Presensi Geolocation Akurasi Tinggi', desc: 'Validasi radius lokasi secara presisi menggunakan integrasi GPS.' },
                  { title: 'Sistem Anti-Fraud Waktu Server', desc: 'Mencegah manipulasi jam gawai melalui sinkronisasi NTP Server terpusat.' },
                  { title: 'Rekapitulasi Kehadiran Real-time', desc: 'Laporan metrik kedisiplinan yang terkalkulasi otomatis tanpa jeda waktu.' },
                  { title: 'Distribusi Slip Gaji Digital', desc: 'Pengarsipan dokumen finansial karyawan yang ramah lingkungan (paperless).' },
                ].map((feature, idx) => (
                  <div key={idx} className="feature-card">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-desc">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Kebijakan Privasi */}
          {activeTab === 'privasi' && (
            <div className="fade-in">
              <h2 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                Kebijakan Privasi & Perlindungan Data Pribadi
              </h2>
              <p className="paragraph" style={{ marginBottom: '24px' }}>
                PT Riza Media Productions menempatkan privasi dan kerahasiaan data sebagai prioritas tertinggi yang tidak dapat ditawar. Kami mengadopsi kerangka kerja manajemen privasi standar global dan mematuhi secara ketat standar kepatuhan regulasi privasi yang berlaku, termasuk <strong>Undang-Undang Pelindungan Data Pribadi (UU PDP) Republik Indonesia</strong>. Kebijakan ini dibuat secara transparan untuk memberikan pemahaman menyeluruh tentang bagaimana data Anda dikelola, diproses, dan diamankan di dalam ekosistem SIKAT.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="privacy-item">
                  <h3 className="privacy-title">1. Pengumpulan Data Lokasi Definitif (Geolocation)</h3>
                  <p className="privacy-desc">Data titik koordinat GPS Anda hanya dan semata-mata dikumpulkan <strong>secara spesifik pada milidetik ketika Anda menekan tombol "Absen Masuk" atau "Absen Pulang"</strong>. Sistem ini dirancang dengan prinsip *privacy-first* sehingga tidak memiliki fungsi pelacakan (*tracking*) presisten di latar belakang, maupun kapabilitas memantau pergerakan fisik perangkat Anda di luar jam interaksi operasional absensi.</p>
                </div>
                <div className="privacy-item">
                  <h3 className="privacy-title">2. Protokol Kerahasiaan Dokumen Finansial</h3>
                  <p className="privacy-desc">Informasi terkait gaji, bonus, dan dokumen slip gaji didesain sebagai Dokumen Rahasia Korporasi Tingkat 1. Rincian ini dienkripsi pada tataran *database* menggunakan algoritma asimetris modern, di mana dekripsi hanya terjadi saat data tersebut dipanggil secara langsung oleh sesi sah milik Anda. Tidak ada administrator lain yang dapat membaca nominal detail tanpa otorisasi terstruktur.</p>
                </div>
                <div className="privacy-item">
                  <h3 className="privacy-title">3. Kebijakan Retensi dan Penghapusan Data</h3>
                  <p className="privacy-desc">Semua rekaman kehadiran historis dan metrik akan diarsipkan (*archived*) ke dalam *cold-storage* berlapis perlindungan mutlak setelah melewati tahun buku, dan akan dihapus (*wiped*) sepenuhnya dari ekosistem digital kami apabila terjadi pemutusan akun secara definitif, memastikan tidak ada rekam jejak digital yang tersisa secara tidak sah.</p>
                </div>
                <div className="privacy-item">
                  <h3 className="privacy-title">4. Non-Disclosure & Anti-Monetisasi Data Pihak Ketiga</h3>
                  <p className="privacy-desc">Kami mengikat diri pada janji legal yang solid bahwa tidak ada satupun informasi identitas pribadi (PII), log komunikasi internal, riwayat penempatan lokasi, maupun perilaku absensi Anda yang akan pernah diekstraksi, dijual, dibarter, maupun disewakan kepada agregator data, pengiklan komersial, atau instansi pihak ketiga di luar mandat penegakan hukum resmi.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Keamanan & Kepatuhan */}
          {activeTab === 'keamanan' && (
            <div className="fade-in">
              <h2 className="section-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Arsitektur Infrastruktur Keamanan
              </h2>
              <p className="paragraph" style={{ marginBottom: '32px' }}>
                Di era digital yang penuh dengan ancaman sibernetika (*cyber threats*), pelindungan sistem informasi adalah hal yang esensial. SIKAT dikembangkan dengan filosofi <em>Security by Design</em>, di mana fondasi keamanan telah ditanamkan sejak baris kode pertama. Kami menerapkan pelindungan berlapis militeristik (*military-grade standard layer*) yang mencakup pengamanan transmisi, ketahanan *server*, dan filter serangan siber proaktif.
              </p>
              
              <div className="grid-container">
                <div className="security-card">
                  <div className="security-title">Enkripsi AES-256 & TLS 1.3</div>
                  <p className="security-desc">Semua titik pertukaran data (transmisi) antara perangkat (*browser*/gawai) Anda dan peladen pusat kami diamankan dengan algoritma enkripsi tercanggih yang saat ini belum bisa diretas oleh skema komputasi konvensional, mencegah segala bentuk penyadapan (*Man-In-The-Middle attacks*).</p>
                </div>
                <div className="security-card">
                  <div className="security-title">Manajemen Sesi Terisolasi & Anti-Hijack</div>
                  <p className="security-desc">Kami mengimplementasikan metode autentikasi stateless menggunakan *JSON Web Tokens (JWT)* yang dienkripsi berlapis. Token ini memiliki umur (*Time-To-Live*) yang ketat dan secara instan mereset koneksi jika sistem mendeteksi aktivitas janggal guna menghindari pembajakan sesi.</p>
                </div>
                <div className="security-card">
                  <div className="security-title">Strategi Pencadangan (Disaster Recovery)</div>
                  <p className="security-desc">Data operasional yang kritikal direplikasi pada hitungan detik (<em>real-time mirroring</em>) menuju lokasi klaster *server* terpisah secara geografis. Pendekatan *fail-over* ini memastikan perusahaan Anda terlindungi dari bencana fisik maupun kegagalan *hardware* yang merusak data.</p>
                </div>
                <div className="security-card">
                  <div className="security-title">Mitigasi Serangan Siber (WAF & DDoS)</div>
                  <p className="security-desc">Sistem dilapisi oleh <em>Web Application Firewall (WAF)</em> cerdas dan peredam serangan *DDoS (Distributed Denial of Service)* tingkat lanjut yang secara otonom memblokir ribuan bot berbahaya, injeksi SQL, dan ancaman silang-situs (*XSS*) sebelum pernah menyentuh gerbang peladen.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Layanan Bantuan */}
          {activeTab === 'bantuan' && (
            <div className="fade-in">
              <div className="support-section">
                <div className="support-icon-wrapper">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <h2 className="support-title">
                  Butuh Bantuan Teknis?
                </h2>
                <p className="support-subtitle">
                  Tim dukungan Enterprise kami beroperasi 24/7 untuk memastikan kelancaran aktivitas operasional perusahaan Anda.
                </p>
                
                <div className="support-cards-wrapper">
                  <div className="support-card">
                    <div className="support-card-label">Email Korporat</div>
                    <div className="support-card-value">contact@rmpid.com</div>
                  </div>
                  <div className="support-card">
                    <div className="support-card-label">Telepon Darurat</div>
                    <div className="support-card-value">085121027553</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer & License */}
        <div className="about-footer">
          <p className="footer-warning"><strong>Peringatan Legal:</strong> Perangkat lunak ini merupakan properti intelektual mutlak milik PT Riza Media Productions. Segala bentuk modifikasi, penggandaan, distribusi tanpa izin, atau rekayasa balik (<em>reverse engineering</em>) akan dituntut berdasarkan Hukum Hak Cipta Internasional dan Nasional yang berlaku.</p>
          <p className="footer-copyright">&copy; {new Date().getFullYear()} PT Riza Media Productions. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </div>
      <style jsx>{`
        .about-container {
          padding: 24px 0;
          max-width: 1000px;
          margin: 0 auto;
          font-family: system-ui, -apple-system, sans-serif;
          width: 100%;
          box-sizing: border-box;
        }
        .about-container * {
          box-sizing: border-box;
        }
        .about-wrapper {
          padding: 0;
          overflow: hidden;
        }
        .about-header {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          padding: 32px 32px;
          text-align: center;
          color: white;
          border-radius: 16px;
          margin-bottom: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
          position: relative;
          overflow: hidden;
        }
        .about-logo {
          height: 80px;
          margin: 0 auto 24px auto;
          display: block;
          filter: drop-shadow(1px 0 0 white) drop-shadow(-1px 0 0 white) drop-shadow(0 1px 0 white) drop-shadow(0 -1px 0 white);
        }
        .about-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }
        .about-version {
          font-size: 1.1rem;
          color: #cbd5e1;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.1);
          padding: 6px 16px;
          border-radius: 50px;
          backdrop-filter: blur(4px);
        }
        .status-dot {
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px #10b981;
        }
        .tab-container {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 24px;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* IE and Edge */
        }
        .tab-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
        .tab-button {
          flex: 1;
          padding: 16px 24px;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          color: #64748b;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .tab-button.active {
          border-bottom: 3px solid #0284c7;
          color: #0f172a;
          font-weight: 700;
        }
        .tab-content {
          padding: 0;
        }
        .section-block {
          margin-bottom: 40px;
        }
        .section-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .paragraph {
          color: #475569;
          line-height: 1.8;
          margin-bottom: 16px;
          font-size: 1.05rem;
          text-align: justify;
        }
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        .feature-card, .security-card, .support-card {
          background: #ffffff;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
          text-align: left;
        }
        .feature-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 10px;
        }
        .feature-desc {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.5;
          text-align: justify;
        }
        .privacy-item {
          border-left: 4px solid #8b5cf6;
          padding-left: 20px;
        }
        .privacy-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 8px;
        }
        .privacy-desc {
          color: #64748b;
          line-height: 1.6;
          text-align: justify;
        }
        .security-title {
          color: #334155;
          font-weight: 700;
          margin-bottom: 10px;
          font-size: 1.1rem;
        }
        .security-desc {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.5;
          text-align: justify;
        }
        .support-section {
          text-align: center;
          padding: 40px 0;
        }
        .support-icon-wrapper {
          width: 80px;
          height: 80px;
          background: #eff6ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px auto;
        }
        .support-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 16px;
        }
        .support-subtitle {
          color: #64748b;
          font-size: 1.1rem;
          margin-bottom: 32px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }
        .support-cards-wrapper {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .support-card {
          flex: 1;
          min-width: 250px;
        }
        .support-card-label {
          color: #64748b;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .support-card-value {
          color: #0f172a;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .about-footer {
          padding: 24px 0;
          margin-top: 40px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 0.85rem;
          color: #64748b;
        }
        .footer-warning {
          margin-bottom: 8px;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.5;
        }
        .footer-copyright {
          font-weight: 600;
        }
        .fade-in {
          animation: fadeIn 0.3s ease;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .about-container {
            padding: 16px 0 80px 0; /* No left/right padding, let the layout container handle it */
          }
          .about-container * {
            box-sizing: border-box;
          }
          .about-header {
            padding: 24px 20px;
            border-radius: 16px;
            margin-bottom: 20px;
            width: 100%;
          }
          .about-title {
            font-size: 1.3rem;
            word-wrap: break-word;
            overflow-wrap: break-word;
            line-height: 1.4;
          }
          .about-logo {
            height: 40px;
            margin-bottom: 16px;
          }
          .about-version {
            font-size: 0.8rem;
            padding: 4px 12px;
            white-space: normal;
            line-height: 1.4;
            display: inline-block;
          }
          .tab-container {
            margin-bottom: 16px;
            width: 100%;
          }
          .tab-button {
            padding: 12px 12px;
            font-size: 0.85rem;
          }
          .tab-content {
            padding: 0;
            width: 100%;
          }
          .section-title {
            font-size: 1.15rem;
            margin-bottom: 12px;
            align-items: flex-start;
          }
          .paragraph {
            font-size: 0.9rem;
            line-height: 1.6;
          }
          .grid-container {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .feature-card, .security-card, .support-card {
            padding: 16px;
            width: 100%;
          }
          .support-section {
            padding: 16px 0;
          }
          .support-title {
            font-size: 1.25rem;
          }
          .support-subtitle {
            font-size: 0.9rem;
          }
          .support-cards-wrapper {
            flex-direction: column;
            gap: 12px;
          }
          .about-footer {
            padding: 16px;
            margin-top: 24px;
            font-size: 0.8rem;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
