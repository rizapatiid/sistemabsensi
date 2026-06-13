"use client"

import { useState, useRef, useEffect } from "react"

interface Option {
  value: string | number
  label: string | number
}

interface CustomSelectProps {
  name: string
  options: Option[]
  defaultValue: string | number
  className?: string
}

const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export default function CustomSelect({ name, options, defaultValue, className = "" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(defaultValue)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find(o => o.value === selectedValue) || options[0]

  return (
    <div ref={containerRef} style={{ position: "relative", minWidth: "80px", flex: 1 }}>
      {/* Hidden input for HTML form submission */}
      <input type="hidden" name={name} value={selectedValue} />

      {/* Custom Select Trigger */}
      <div 
        className={className} 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          cursor: "pointer",
          userSelect: "none",
          height: "100%"
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption.label}</span>
        <IconChevronDown />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          left: 0,
          right: 0,
          backgroundColor: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          zIndex: 50,
          maxHeight: "250px",
          overflowY: "auto",
          padding: "4px"
        }}>
          {options.map((option) => (
            <div
              key={option.value}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: option.value === selectedValue ? 700 : 500,
                backgroundColor: option.value === selectedValue ? "#f1f5f9" : "transparent",
                color: option.value === selectedValue ? "#0f172a" : "#475569",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => {
                if (option.value !== selectedValue) {
                  e.currentTarget.style.backgroundColor = "#f8fafc"
                }
              }}
              onMouseLeave={(e) => {
                if (option.value !== selectedValue) {
                  e.currentTarget.style.backgroundColor = "transparent"
                }
              }}
              onClick={() => {
                setSelectedValue(option.value)
                setIsOpen(false)
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
