import React from 'react';
import { getSystemSettings } from '@/lib/settings';

const MaintenancePage = async () => {
    const settings = await getSystemSettings();
    const reason = settings.maintenanceReason || "Kami sedang mengoptimalkan infrastruktur sistem untuk memberikan performa terbaik bagi seluruh tim.";
    const until = settings.maintenanceUntil || "Segera";

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            color: '#000000',
            fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            padding: '40px 24px'
        }}>
            <div className="maintenance-wrapper">

                {/* LEFT CONTENT */}
                <div className="content-area">
                    <h2 className="label">SYSTEM OPTIMIZATION</h2>
                    <h1 className="title">WEBSITE <br /> <span style={{ color: '#3b82f6' }}>MAINTENANCE</span></h1>

                    <p className="desc">
                        {reason}
                    </p>

                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">ESTIMASI SELESAI</span>
                            <span className="info-value">{until.toUpperCase()}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">STATUS SISTEM</span>
                            <span className="info-value" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                                ON PROGRESS
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT ILLUSTRATION */}
                <div className="image-area">
                    <img
                        src="/maintenance_web.png"
                        alt="Maintenance"
                        className="hero-image"
                    />
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .maintenance-wrapper {
                    display: flex;
                    flex-direction: column-reverse;
                    align-items: center;
                    justify-content: center;
                    max-width: 1100px;
                    width: 100%;
                    gap: 60px;
                    text-align: center;
                }

                .content-area {
                    flex: 1;
                    max-width: 540px;
                }

                .image-area {
                    flex: 1.1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .hero-image {
                    width: 100%;
                    max-width: 500px;
                    height: auto;
                    /* No effects as requested */
                }

                .label {
                    font-size: 0.9rem;
                    font-weight: 800;
                    margin: 0 0 8px 0;
                    color: #3b82f6;
                    letter-spacing: 0.2em;
                }

                .title {
                    font-size: clamp(2.5rem, 8vw, 4.5rem);
                    font-weight: 950;
                    margin: 0 0 24px 0;
                    letter-spacing: -0.04em;
                    line-height: 1;
                    color: #0f172a;
                }

                .desc {
                    font-size: 1.15rem;
                    color: #64748b;
                    line-height: 1.6;
                    margin-bottom: 48px;
                    font-weight: 500;
                }

                .info-grid {
                    width: 100%;
                    max-width: 420px;
                    background: #fcfdfe;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                }

                .info-item {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: background 0.3s ease;
                }

                .info-item + .info-item {
                    border-top: 1px solid #e2e8f0;
                }

                .info-label {
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: #94a3b8;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                }

                .info-value {
                    font-size: 1.1rem;
                    font-weight: 950;
                    color: #1e3a8a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    text-align: center;
                    letter-spacing: -0.01em;
                }

                @media (min-width: 1024px) {
                    .maintenance-wrapper {
                        flex-direction: row;
                        text-align: left;
                        gap: 100px;
                        justify-content: space-between;
                    }

                    .info-grid {
                        grid-template-columns: 1fr 1fr;
                        max-width: 500px;
                        margin: 0;
                    }

                    .info-item {
                        padding: 28px;
                        text-align: left;
                        align-items: flex-start;
                    }

                    .info-value {
                        justify-content: flex-start;
                        text-align: left;
                    }

                    .info-item + .info-item {
                        border-top: none;
                        border-left: 1px solid #e2e8f0;
                    }

                    .image-area {
                        justify-content: flex-end;
                    }
                }
            `}} />
        </div>
    );
};

export default MaintenancePage;
