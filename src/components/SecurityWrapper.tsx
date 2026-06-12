"use client";

import { useEffect } from "react";

export default function SecurityWrapper() {
  useEffect(() => {
    // Disable right-click (context menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable keyboard shortcuts for dev tools and copy
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }
      
      // Ctrl+Shift+I (Inspect)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
      }
      
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
      }
      
      // Ctrl+P (Print)
      if (e.ctrlKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
      }
      
      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
      }
      
      // Note: We don't disable Ctrl+C aggressively here so inputs still work, 
      // but CSS user-select: none prevents copying text on the page.
    };

    // Disable drag and drop (especially for images)
    const handleDragStart = (e: DragEvent) => {
      if (e.target instanceof HTMLImageElement || e.target instanceof HTMLAnchorElement) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return null;
}
