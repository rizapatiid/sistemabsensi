"use client";

import { useState } from "react";
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
}

export default function Navbar({ user, onMobileMenuToggle, isSidebarCollapsed }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  return (
    <header className={`navbar ${isSidebarCollapsed ? 'sidebar-state-collapsed' : ''}`}>
      <div className="navbar-left">
        <button className="hamburger-btn" onClick={onMobileMenuToggle}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <img 
          src="/logositus.png" 
          alt="RMP Digitals" 
          className="navbar-logo"
        />
      </div>
      <div className="navbar-right">
        <div className="user-profile" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
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
                  await logoutAction();
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
          background-color: white;
          border-bottom: 1px solid #eef2f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 110;
        }
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .hamburger-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #1a567e;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 10px;
          transition: all 0.2s;
        }
        .hamburger-btn:hover {
          background: #f1f5f9;
          transform: scale(1.05);
        }
        .welcome-msg {
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 640px) {
          .welcome-msg { display: none; }
        }
        .welcome-text {
          font-weight: 700;
          color: #1e293b;
          font-size: 0.95rem;
        }
        .welcome-date {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }
        .navbar-logo {
          height: 54px;
          display: none;
        }
        
        .sidebar-state-collapsed .navbar-logo {
           display: block;
        }

        .sidebar-state-collapsed .hamburger-btn {
           background: transparent;
           border-color: transparent;
           padding: 4px;
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
          padding: 6px 12px;
          border-radius: 12px;
          transition: background-color 0.2s;
        }
        .user-profile:hover {
          background-color: #f8fafc;
        }
        .user-info-text {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        @media (max-width: 1024px) {
          .user-info-text { display: none; }
        }
        .user-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
        }
        .user-role-badge {
          font-size: 0.65rem;
          font-weight: 800;
          color: #0369a1;
          background: #e0f2fe;
          padding: 2px 8px;
          border-radius: 4px;
          margin-top: 2px;
        }
        .user-avatar-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          background-color: #f1f5f9;
          border: 2px solid #eef2f6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .user-profile:hover .user-avatar {
          border-color: #cbd5e1;
        }
        .dropdown-indicator {
          color: #94a3b8;
          transition: transform 0.2s;
        }
        .dropdown-indicator.rotated {
          transform: rotate(180deg);
        }
        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 220px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          margin-top: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 120;
          border: 1px solid #eef2f6;
        }
        .dropdown-header {
          padding: 8px 12px 12px;
        }
        .dropdown-header strong {
          display: block;
          font-size: 0.9rem;
          color: #1e293b;
        }
        .dropdown-header p {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 2px;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
          border-radius: 12px;
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
