// src/hooks/useToolScripts.js
import { useEffect } from 'react';

export default function useToolScripts() {
  useEffect(() => {
    // Array of the scripts you removed from index.html
    const scriptUrls = [
      "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
    ];

    scriptUrls.forEach((url) => {
      // Check if script is already added so we don't load it twice
      if (!document.querySelector(`script[src="${url}"]`)) {
        const script = document.createElement('script');
        script.src = url;
        script.async = true; // Loads without blocking the UI
        document.body.appendChild(script);
      }
    });
  }, []); // Empty array ensures this only runs once when the component loads
}