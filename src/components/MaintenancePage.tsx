import React from 'react';
import { getSystemSettings } from '@/lib/settings';

const MaintenancePage = async () => {
    const settings = await getSystemSettings();
    const reason = settings.maintenanceReason || "Kami sedang melakukan pemeliharaan sistem untuk meningkatkan performa dan keamanan layanan bagi seluruh pegawai.";
    const until = settings.maintenanceUntil || "Segera";

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                /* ══ ROOT ══ */
                .mn-container {
                    min-height: 100dvh;
                    display: flex;
                    flex-direction: row;
                    background: #ffffff;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }

                /* ══ LEFT — BRAND ══ */
                .mn-brand {
                    flex: 1.1;
                    background: linear-gradient(145deg, #0a0f1e 0%, #0f172a 50%, #1a2744 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 56px 48px 60px;
                    color: white;
                    position: relative;
                    overflow: hidden;
                    text-align: center;
                }

                /* Decorative circles — identical to login */
                .mn-decor-a {
                    position: absolute;
                    width: 420px; height: 420px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
                    top: -80px; right: -80px;
                    pointer-events: none;
                }
                .mn-decor-b {
                    position: absolute;
                    width: 300px; height: 300px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%);
                    bottom: -60px; left: -60px;
                    pointer-events: none;
                }

                /* Logo — same filter as login */
                .mn-brand-logo {
                    height: 56px;
                    width: auto;
                    object-fit: contain;
                    margin-bottom: 32px;
                    z-index: 2;
                    filter: drop-shadow(0px 0px 6px rgba(255,255,255,0.3))
                            drop-shadow(1px 0 0 white)
                            drop-shadow(-1px 0 0 white)
                            drop-shadow(0 1px 0 white)
                            drop-shadow(0 -1px 0 white);
                }

                /* Illustration wrapper */
                .mn-illus-wrapper {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    z-index: 2;
                }

                /* Floating chips — same style as login */
                .mn-chip {
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.72rem;
                    font-weight: 700;
                    white-space: nowrap;
                    z-index: 5;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));
                }
                .mn-chip-icon {
                    width: 48px; height: 48px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                /* Chip 1 — top left — red (maintenance) */
                .mn-chip-1 {
                    top: 8%; left: 0;
                    color: #fca5a5;
                    animation: mn-float1 4s ease-in-out infinite;
                }
                .mn-chip-1 .mn-chip-icon {
                    background: rgba(239,68,68,0.25);
                    color: #f87171;
                    border: 1.5px solid rgba(248,113,113,0.3);
                }

                /* Chip 2 — top right — amber (clock) */
                .mn-chip-2 {
                    top: 8%; right: 0;
                    color: #fde68a;
                    animation: mn-float2 4.5s ease-in-out infinite;
                }
                .mn-chip-2 .mn-chip-icon {
                    background: rgba(245,158,11,0.25);
                    color: #fbbf24;
                    border: 1.5px solid rgba(251,191,36,0.3);
                }

                /* Chip 3 — bottom left — green (security) */
                .mn-chip-3 {
                    bottom: 8%; left: 12%;
                    color: #6ee7b7;
                    animation: mn-float3 3.8s ease-in-out infinite;
                }
                .mn-chip-3 .mn-chip-icon {
                    background: rgba(16,185,129,0.25);
                    color: #34d399;
                    border: 1.5px solid rgba(52,211,153,0.3);
                }

                /* Chip 4 — bottom right — blue (team) */
                .mn-chip-4 {
                    bottom: 8%; right: 12%;
                    color: #93c5fd;
                    animation: mn-float4 5s ease-in-out infinite;
                }
                .mn-chip-4 .mn-chip-icon {
                    background: rgba(59,130,246,0.25);
                    color: #60a5fa;
                    border: 1.5px solid rgba(96,165,250,0.3);
                }

                @keyframes mn-float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
                @keyframes mn-float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
                @keyframes mn-float3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
                @keyframes mn-float4 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }

                /* SVG Illustration */
                .mn-svg-scene {
                    width: 100%;
                    max-width: 380px;
                    height: auto;
                    z-index: 2;
                    animation: mn-float-img 3.5s ease-in-out infinite;
                    filter: drop-shadow(0 24px 40px rgba(0,0,0,0.5));
                }
                @keyframes mn-float-img {
                    0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)}
                }

                .mn-gear-spin { animation: mn-spin 6s linear infinite; transform-origin: center; }
                .mn-gear-spin-rev { animation: mn-spin-rev 4s linear infinite; transform-origin: center; }
                @keyframes mn-spin     { from{transform:rotate(0deg)}  to{transform:rotate(360deg)} }
                @keyframes mn-spin-rev { from{transform:rotate(0deg)}  to{transform:rotate(-360deg)} }

                .mn-blink-led { animation: mn-led 1.2s ease-in-out infinite; }
                @keyframes mn-led { 0%,100%{opacity:1} 50%{opacity:0.2} }

                .mn-wrench-anim { animation: mn-wrench 2.5s ease-in-out infinite; transform-origin: 60px 60px; }
                @keyframes mn-wrench { 0%,100%{transform:rotate(-15deg)} 50%{transform:rotate(15deg)} }

                .mn-progress-anim { animation: mn-bar 2s ease-in-out infinite; }
                @keyframes mn-bar {
                    0%   { stroke-dashoffset: 160; }
                    50%  { stroke-dashoffset: 60; }
                    100% { stroke-dashoffset: 160; }
                }

                /* Ground shadow */
                .mn-illus-shadow {
                    width: 65%; height: 18px;
                    background: radial-gradient(ellipse at center, rgba(59,130,246,0.4) 0%, transparent 75%);
                    border-radius: 50%;
                    margin-top: 4px;
                    flex-shrink: 0;
                }

                /* Brand title */
                .mn-brand-title {
                    font-size: clamp(1.8rem, 2.5vw, 2.6rem);
                    font-weight: 900;
                    letter-spacing: -0.03em;
                    line-height: 1.15;
                    margin-bottom: 12px;
                    z-index: 2;
                    color: #f8fafc;
                }

                /* Gradient line */
                .mn-brand-line {
                    width: 64px; height: 4px;
                    border-radius: 99px;
                    background: linear-gradient(90deg, #ef4444 0%, #f97316 50%, #eab308 100%);
                    margin-bottom: 16px;
                    z-index: 2;
                    box-shadow: 0 0 12px rgba(239,68,68,0.5);
                }

                /* Subtitle */
                .mn-brand-sub {
                    font-size: 0.95rem;
                    color: #94a3b8;
                    line-height: 1.7;
                    font-weight: 400;
                    max-width: 300px;
                    z-index: 2;
                    margin-bottom: 40px;
                }

                /* Status badge on left */
                .mn-brand-status {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 2;
                }

                .mn-status-item {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: #64748b;
                }
                .mn-status-item svg { color: #3b82f6; flex-shrink: 0; }

                /* ══ RIGHT — CONTENT ══ */
                .mn-right {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #ffffff;
                    padding: 60px 40px;
                }

                .mn-form-wrapper {
                    width: 100%;
                    max-width: 420px;
                    display: flex;
                    flex-direction: column;
                }

                /* Logo on right (same as login) */
                .mn-logo-wrap {
                    margin-bottom: 48px;
                }
                .mn-logo-right {
                    height: 56px;
                    width: auto;
                    object-fit: contain;
                }

                /* Heading — same class sizes as login */
                .mn-heading {
                    font-size: 2rem;
                    font-weight: 900;
                    color: #0f172a;
                    margin: 0 0 8px;
                    letter-spacing: -0.03em;
                }

                .mn-subheading {
                    font-size: 1rem;
                    color: #64748b;
                    margin: 0 0 40px;
                    font-weight: 400;
                    line-height: 1.5;
                }

                /* ── Status badge (top of right) */
                .mn-status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 100px;
                    padding: 5px 14px;
                    font-size: 0.68rem;
                    font-weight: 800;
                    color: #dc2626;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    margin-bottom: 28px;
                }

                /* ── Heading */
                .mn-heading {
                    font-size: 2.2rem;
                    font-weight: 900;
                    color: #0f172a;
                    margin: 0 0 14px;
                    letter-spacing: -0.04em;
                    line-height: 1.1;
                }

                .mn-subheading {
                    font-size: 0.95rem;
                    color: #64748b;
                    margin: 0 0 10px;
                    font-weight: 400;
                    line-height: 1.6;
                }

                /* ── Reason card */
                .mn-reason-card {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #eff6ff;
                    border: 1px solid #bfdbfe;
                    border-radius: 12px;
                    padding: 14px 16px;
                    margin-bottom: 36px;
                }
                .mn-reason-icon {
                    flex-shrink: 0;
                    color: #1d4ed8;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, rgba(219, 234, 254, 0.7), rgba(191, 219, 254, 0.3));
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.9);
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15),
                                inset 0 2px 4px rgba(255, 255, 255, 0.8);
                }
                .mn-reason-card p {
                    font-size: 0.85rem;
                    color: #1e40af;
                    font-weight: 500;
                    line-height: 1.5;
                    margin: 0;
                }

                /* ── Divider */
                .mn-divider {
                    width: 100%;
                    height: 1px;
                    background: #f1f5f9;
                    margin-bottom: 28px;
                }

                /* ── Two-column stats */
                .mn-stats {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-bottom: 36px;
                }

                .mn-stat {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .mn-stat-label {
                    font-size: 0.68rem;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }

                .mn-stat-val {
                    font-size: 1.05rem;
                    font-weight: 800;
                    color: #0f172a;
                    letter-spacing: -0.02em;
                }

                .mn-stat-val-green {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 1.05rem;
                    font-weight: 800;
                    color: #16a34a;
                    letter-spacing: -0.02em;
                }

                /* ── Progress */
                .mn-prog-wrap { margin-bottom: 0; }
                .mn-prog-label-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.68rem;
                    font-weight: 700;
                    color: #cbd5e1;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: 10px;
                }
                .mn-prog-track {
                    width: 100%;
                    height: 4px;
                    background: #f1f5f9;
                    border-radius: 100px;
                    overflow: hidden;
                }
                .mn-prog-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #6366f1, #8b5cf6);
                    border-radius: 100px;
                    animation: mn-slide 2.4s ease-in-out infinite;
                    transform-origin: left;
                }
                @keyframes mn-slide {
                    0%  {transform:translateX(-100%) scaleX(0.3)}
                    50% {transform:translateX(70%) scaleX(0.4)}
                    100%{transform:translateX(240%) scaleX(0.3)}
                }

                /* Footer */
                .mn-footer {
                    margin-top: 44px;
                    font-size: 0.72rem;
                    color: #cbd5e1;
                    font-weight: 500;
                    text-align: center;
                }

                /* ══ RESPONSIVE — identical breakpoints to login ══ */
                @media (max-width: 1024px) {
                    .mn-brand { padding: 48px 40px; }
                    .mn-brand-title { font-size: 2.2rem; }
                }

                @media (max-width: 768px) {
                    .mn-container { flex-direction: column; }
                    .mn-brand { display: none; }
                    .mn-right {
                        padding: 40px 24px;
                        align-items: flex-start;
                        min-height: 100dvh;
                    }
                    .mn-form-wrapper {
                        margin: auto 0;
                        width: 100%;
                        max-width: 100%;
                    }
                    .mn-logo-right { height: 48px; }
                    .mn-heading { font-size: 1.75rem; }
                    .mn-subheading { font-size: 0.95rem; margin-bottom: 32px; }
                }
                `
            }} />

            <div className="mn-container">

                {/* ══ LEFT — BRAND (Desktop only) ══ */}
                <div className="mn-brand">
                    <div className="mn-decor-a" />
                    <div className="mn-decor-b" />



                    <div className="mn-illus-wrapper">


                        {/* ── Inline SVG Illustration ── */}
                        <svg className="mn-svg-scene" viewBox="0 0 400 340" fill="none" xmlns="http://www.w3.org/2000/svg">

                            {/* Background glow */}
                            <ellipse cx="200" cy="200" rx="160" ry="120" fill="url(#glow)" opacity="0.3"/>

                            {/* ── SERVER RACK ── */}
                            <rect x="80" y="60" width="180" height="220" rx="12" fill="#0f172a" stroke="#1e3a8a" strokeWidth="2"/>
                            {/* rack screws */}
                            <circle cx="94" cy="74" r="4" fill="#1e3a8a"/>
                            <circle cx="246" cy="74" r="4" fill="#1e3a8a"/>
                            <circle cx="94" cy="268" r="4" fill="#1e3a8a"/>
                            <circle cx="246" cy="268" r="4" fill="#1e3a8a"/>

                            {/* Server unit 1 */}
                            <rect x="96" y="88" width="148" height="36" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
                            <rect x="108" y="100" width="60" height="12" rx="3" fill="#0ea5e9" opacity="0.8"/>
                            <circle cx="226" cy="106" r="5" fill="#22c55e" className="mn-blink-led"/>
                            <circle cx="212" cy="106" r="5" fill="#3b82f6"/>

                            {/* Server unit 2 */}
                            <rect x="96" y="132" width="148" height="36" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
                            <rect x="108" y="144" width="80" height="12" rx="3" fill="#6366f1" opacity="0.7"/>
                            <circle cx="226" cy="150" r="5" fill="#f59e0b" className="mn-blink-led" style={{animationDelay:'0.4s'}}/>
                            <circle cx="212" cy="150" r="5" fill="#3b82f6"/>

                            {/* Server unit 3 — being worked on */}
                            <rect x="96" y="176" width="148" height="36" rx="6" fill="#1c1917" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2"/>
                            <rect x="108" y="188" width="40" height="12" rx="3" fill="#ef4444" opacity="0.5"/>
                            <circle cx="226" cy="194" r="5" fill="#ef4444" className="mn-blink-led" style={{animationDelay:'0.2s'}}/>
                            <text x="155" y="198" fontSize="8" fill="#ef4444" textAnchor="middle" fontFamily="monospace" fontWeight="bold">ERROR</text>

                            {/* Server unit 4 */}
                            <rect x="96" y="220" width="148" height="36" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
                            <rect x="108" y="232" width="50" height="12" rx="3" fill="#0ea5e9" opacity="0.5"/>
                            <circle cx="226" cy="238" r="5" fill="#94a3b8"/>
                            <circle cx="212" cy="238" r="5" fill="#94a3b8"/>

                            {/* ── LARGE GEAR (right) ── */}
                            <g transform="translate(270,130)" className="mn-gear-spin">
                                <circle cx="0" cy="0" r="38" fill="#1e293b" stroke="#3b82f6" strokeWidth="3"/>
                                <circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#3b82f6" strokeWidth="2"/>
                                {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>(
                                    <rect key={i} x="-5" y="-46" width="10" height="12" rx="2"
                                        fill="#3b82f6"
                                        transform={`rotate(${a})`}
                                    />
                                ))}
                            </g>

                            {/* ── SMALL GEAR (right-lower) ── */}
                            <g transform="translate(298,188)" className="mn-gear-spin-rev">
                                <circle cx="0" cy="0" r="20" fill="#1e293b" stroke="#6366f1" strokeWidth="2"/>
                                <circle cx="0" cy="0" r="9" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5"/>
                                {[0,45,90,135,180,225,270,315].map((a,i)=>(
                                    <rect key={i} x="-3" y="-25" width="6" height="8" rx="1.5"
                                        fill="#6366f1"
                                        transform={`rotate(${a})`}
                                    />
                                ))}
                            </g>

                            {/* ── WRENCH ── */}
                            <g className="mn-wrench-anim">
                                <path d="M290 80 Q310 60 330 70 L310 90 L300 100 L280 90 Z" fill="#94a3b8"/>
                                <rect x="268" y="96" width="18" height="50" rx="4" fill="#94a3b8" transform="rotate(-45 268 96)"/>
                                <path d="M290 80 Q310 60 330 70 Q325 85 310 90 Z" fill="#64748b"/>
                            </g>

                            {/* ── LAPTOP (left-bottom) ── */}
                            <g transform="translate(10,210)">
                                <rect x="0" y="0" width="80" height="54" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1.5"/>
                                <rect x="4" y="4" width="72" height="46" rx="3" fill="#0f172a"/>
                                {/* screen content */}
                                <rect x="8" y="8" width="40" height="6" rx="2" fill="#3b82f6" opacity="0.7"/>
                                <rect x="8" y="18" width="60" height="4" rx="2" fill="#334155"/>
                                <rect x="8" y="26" width="45" height="4" rx="2" fill="#334155"/>
                                <rect x="8" y="34" width="30" height="4" rx="2" fill="#ef4444" opacity="0.6"/>
                                {/* loading bar */}
                                <rect x="8" y="40" width="64" height="5" rx="2.5" fill="#1e3a8a"/>
                                <rect x="8" y="40" width="35" height="5" rx="2.5" fill="#3b82f6" className="mn-progress-anim" strokeDasharray="160" strokeDashoffset="0"/>
                                {/* base */}
                                <rect x="-6" y="54" width="92" height="5" rx="2" fill="#334155"/>
                                <rect x="20" y="59" width="40" height="3" rx="1.5" fill="#1e293b"/>
                            </g>

                            {/* ── CONNECTION LINES ── */}
                            <line x1="260" y1="150" x2="270" y2="130" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5"/>
                            <line x1="260" y1="194" x2="278" y2="188" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5"/>
                            <line x1="90" y1="240" x2="82" y2="234" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4"/>

                            {/* ── DEFS ── */}
                            <defs>
                                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#3b82f6"/>
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                                </radialGradient>
                            </defs>
                        </svg>
                        <div className="mn-illus-shadow" />
                    </div>

                    <h1 className="mn-brand-title">Sistem Sedang<br />Dalam Perbaikan</h1>
                    <div className="mn-brand-line" />
                    <p className="mn-brand-sub">
                        Tim IT kami sedang bekerja keras untuk memulihkan layanan secepatnya.
                    </p>

                    <div className="mn-brand-status">
                        <div className="mn-status-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                            Infrastruktur Aktif
                        </div>
                        <div className="mn-status-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            Data Terenkripsi
                        </div>
                    </div>
                </div>

                {/* ══ RIGHT — INFO PANEL ══ */}
                <div className="mn-right">
                    <div className="mn-form-wrapper">

                        {/* Logo */}
                        <div className="mn-logo-wrap">
                            <img src="/logositus.png" alt="RMP Digitals Logo" className="mn-logo-right" />
                        </div>

                        {/* Heading */}
                        <h2 className="mn-heading">Sistem<br />Maintenance</h2>
                        <p className="mn-subheading">Mohon maaf atas ketidaknyamanan ini.</p>

                        {/* Reason card */}
                        <div className="mn-reason-card">
                            <div className="mn-reason-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 16v-4"></path>
                                    <path d="M12 8h.01"></path>
                                </svg>
                            </div>
                            <p>{reason}</p>
                        </div>

                        <div className="mn-divider" />

                        {/* 2-column stats */}
                        <div className="mn-stats">
                            <div className="mn-stat">
                                <span className="mn-stat-label">Estimasi Selesai</span>
                                <span className="mn-stat-val">{until}</span>
                            </div>
                            <div className="mn-stat">
                                <span className="mn-stat-label">Status Sistem</span>
                                <span className="mn-stat-val-green">
                                    <span className="mn-live" />
                                    On Progress
                                </span>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mn-prog-wrap">
                            <div className="mn-prog-label-row">
                                <span>Proses Pemeliharaan</span>
                                <span>Berjalan</span>
                            </div>
                            <div className="mn-prog-track">
                                <div className="mn-prog-fill" />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mn-footer">
                            &copy; {new Date().getFullYear()} PT Riza Media Productions
                        </div>

                    </div>
                </div>

            </div>
        </>
    );
};

export default MaintenancePage;
