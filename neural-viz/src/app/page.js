"use client";
import { useState, useRef } from "react";
import Script from "next/script";
import CodeEditor from "../components/CodeEditor";
import Visualizer from "../components/Visualizer";
import { SETUP_CODE } from "../utils/pythonSetup";

export default function Home() {
  const [code, setCode] = useState("# Try printing something\nprint('Hello from Python!')");
  const [output, setOutput] = useState("");
  const [isPyodideReady, setIsPyodideReady] = useState(false);
  const pyodideRef = useRef(null);

  // Robust Initialization Function
  async function initPyodide() {
    // Check if the global function exists. If not, retry in 500ms.
    if (typeof window.loadPyodide !== "function") {
      console.warn("Pyodide not fully loaded yet. Retrying...");
      setTimeout(initPyodide, 500); 
      return;
    }

    try {
      const py = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
      });
      pyodideRef.current = py;
      setIsPyodideReady(true);
      console.log("Pyodide Successfully Initialized");
    } catch (err) {
      console.error("Pyodide Crash:", err);
      setOutput(`Engine Error: ${err.message}`);
    }
  }

  const runCode = async () => {
    if (!pyodideRef.current) return;
    try {
      const py = pyodideRef.current;
      py.setStdout({ batched: (msg) => setOutput((prev) => prev + msg + "\n") });
      await py.runPythonAsync(SETUP_CODE + "\n" + code);
    } catch (err) {
      setOutput(`Runtime Error: ${err.message}`);
    }
  };

  return (
    <main className="flex h-screen w-screen bg-black text-white overflow-hidden">
      {/* strategy="afterInteractive" is slightly safer for heavy libs 
         than lazyOnload in some Next.js versions 
      */}
      <Script 
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js" 
        strategy="afterInteractive"
        onLoad={initPyodide} 
      />

      {/* Visualizer Panel */}
      <div className="w-[60%] h-full relative border-r border-gray-800">
        <Visualizer />
        <div className="absolute bottom-0 w-full h-32 bg-gray-900 border-t border-gray-700 p-2 font-mono text-xs overflow-auto opacity-90">
             <div className="text-gray-400 mb-1">CONSOLE OUTPUT:</div>
             <pre>{output}</pre>
        </div>
        <button 
          className={`absolute top-4 right-4 px-6 py-2 rounded shadow-lg font-bold z-10 transition-all ${
            !isPyodideReady 
              ? "bg-gray-600 cursor-wait opacity-50" 
              : "bg-green-600 hover:bg-green-500 hover:scale-105"
          }`}
          onClick={runCode}
          disabled={!isPyodideReady}
        >
          {!isPyodideReady ? "Loading Engine..." : "Run Code ▶"}
        </button>
      </div>

      {/* Code Editor Panel */}
      <div className="w-[40%] h-full">
        <CodeEditor code={code} setCode={setCode} />
      </div>
    </main>
  );
}