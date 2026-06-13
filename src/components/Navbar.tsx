"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth";

interface User {
  name: string;
  role: string;
}

interface NavbarProps {
  user: User;
  onMobileMenuToggle?: () => void;
  isSidebarCollapsed?: boolean;
  onLogoutClick?: () => void;
}

export default function Navbar({ user, onMobileMenuToggle, isSidebarCollapsed, onLogoutClick }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className={`navbar hidden-on-mobile ${isSidebarCollapsed ? 'sidebar-state-collapsed' : ''}`}>
      <div className="navbar-left">
        {isSidebarCollapsed && (
          <img
            src="/logositus.png"
            alt="PT Riza Media Productions"
            height="48"
            className="navbar-logo-desktop"
          />
        )}
      </div>
      <div className="navbar-right">
        <div className="user-profile" ref={profileRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <div className="user-info-text">
            <span className="user-name">{user?.name?.toUpperCase() || "USER"}</span>
            <span className="user-role-badge">{user?.role}</span>
          </div>
          <div className="user-avatar-container">
            <div className="user-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a567e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="7" r="4"></circle>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              </svg>
            </div>
            <div className={`dropdown-indicator ${isDropdownOpen ? 'rotated' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          {isDropdownOpen && (
            <div className="user-dropdown glass" onClick={(e) => e.stopPropagation()}>
              <div className="dropdown-header">
                <strong>{user?.name}</strong>
                <p>{user?.role}</p>
              </div>
              <div className="dropdown-divider"></div>
              <div
                className="dropdown-item profile-item"
                onClick={() => {
                  setIsDropdownOpen(false);
                  router.push(user.role === 'ADMIN' ? '/admin/profil' : '/employee/profil');
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profil Saya
              </div>

              <div className="dropdown-divider"></div>
              <div
                className="dropdown-item logout-item"
                onClick={async (e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(false);
                  if (onLogoutClick) {
                    onLogoutClick();
                  } else {
                    await logoutAction();
                  }
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          height: 70px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px) saturate(150%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 4px 30px -4px rgba(15, 23, 42, 0.04);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 110;
          transition: all 0.3s ease;
        }
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .navbar-logo-desktop {
          height: 48px;
          display: block;
        }
        .navbar-logo-mobile {
          display: none;
        }
        .navbar-mobile-toggle {
          display: none;
        }
        @media (max-width: 1024px) {
          .navbar {
            display: none;
          }
          .navbar-logo-desktop {
            display: none;
          }
        }
        .welcome-text {
          font-weight: 800;
          font-size: 1.05rem;
          letter-spacing: -0.01em;
          background: linear-gradient(135deg, #0f172a 0%, #0284c7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 2px;
        }
        .welcome-date {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .navbar-greeting {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 8px;
        }
        .navbar-logo {
          height: 54px;
          display: none;
        }
        
        .sidebar-state-collapsed .navbar-logo {
           display: block;
        }

        .sidebar-state-collapsed .hamburger-btn {
          /* Restore visibility */
        }

        @media (max-width: 1024px) {
          .navbar-left {
            gap: 12px;
          }
          .navbar-logo {
            display: block;
            width: auto;
          }
        }
        .navbar-right {
          display: flex;
          align-items: center;
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          position: relative;
          padding: 6px 8px;
          background: transparent;
          border: none;
          border-radius: 12px;
          transition: all 0.2s ease;
        }
        .user-profile:hover {
          background-color: rgba(15, 23, 42, 0.04);
          transform: translateY(-1px);
        }
        .user-profile:active {
          transform: translateY(0);
        }
        .user-info-text {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
        }
        @media (max-width: 1024px) {
          .user-info-text { display: none; }
          .user-profile { padding: 6px; border-radius: 50%; border: none; box-shadow: none; background: transparent; }
          .user-profile:hover { background: transparent; transform: none; box-shadow: none; }
        }
        .user-name {
          font-size: 0.85rem;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: 0.02em;
        }
        .user-role-badge {
          font-size: 0.6rem;
          font-weight: 800;
          color: #0284c7;
          background: linear-gradient(to right, #e0f2fe, #bae6fd);
          padding: 3px 10px;
          border-radius: 20px;
          margin-top: 3px;
          letter-spacing: 0.06em;
          border: 1px solid rgba(255,255,255,0.5);
          box-shadow: 0 2px 4px rgba(2, 132, 199, 0.05);
        }
        .user-avatar-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .user-avatar {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 2px solid #bfdbfe;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.5);
        }
        .user-profile:hover .user-avatar {
          border-color: #93c5fd;
          transform: scale(1.05);
        }
        .dropdown-indicator {
          color: #94a3b8;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .dropdown-indicator.rotated {
          transform: rotate(180deg);
          color: #3b82f6;
        }
        .user-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 200px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border-radius: 16px;
          box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(226, 232, 240, 0.8);
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          z-index: 120;
          animation: dropdownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dropdown-header {
          padding: 12px 12px 8px;
          text-align: center;
          background: linear-gradient(to bottom, #f8fafc, transparent);
          border-radius: 12px 12px 0 0;
          margin: -6px -6px 0 -6px;
        }
        .dropdown-header strong {
          display: block;
          font-size: 0.85rem;
          color: #0f172a;
          font-weight: 800;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 4px;
        }
        .dropdown-header p {
          font-size: 0.65rem;
          color: #64748b;
          font-weight: 700;
          margin-top: 2px;
          letter-spacing: 0.05em;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          border-radius: 10px;
          transition: all 0.2s;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }
        .dropdown-item:hover {
          background-color: #f8fafc;
        }
        .logout-item, .profile-item {
          color: #ef4444;
        }
        .profile-item {
          color: #1a567e;
        }
        .logout-item:hover {
          background-color: #fef2f2;
          color: #dc2626;
        }
        .profile-item:hover {
          background-color: #f0f9ff;
          color: #0c4a6e;
        }
        .dropdown-divider {
          height: 1px;
          background-color: #f1f5f9;
          margin: 6px 0;
        }
        .dropdown-item svg {
          stroke: currentColor;
        }
      `}</style>
    </header>
  );
}
