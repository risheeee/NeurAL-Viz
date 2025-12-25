"use client";
import { useState, useEffect, useRef } from "react";

export default function usePyodide() {
  const [pyodide, setPyodide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPyodide = async () => {
      // 1. Load the script dynamically
      if (!window.loadPyodide) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
        script.onload = async () => {
          // 2. Initialize Pyodide
          const py = await window.loadPyodide();
          setPyodide(py);
          setIsLoading(false);
        };
        document.body.appendChild(script);
      } else {
        // Already loaded
        setIsLoading(false);
      }
    };
    loadPyodide();
  }, []);

  return { pyodide, isLoading };
}