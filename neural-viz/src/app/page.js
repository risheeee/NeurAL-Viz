"use client";
import { useState, useRef, useEffect } from "react";
import Script from "next/script";
import CodeEditor from "../components/CodeEditor";
import Visualizer from "../components/Visualizer";
import { SETUP_CODE } from "../utils/pythonSetup";
import { useNodesState, useEdgesState } from "reactflow";
import PresetSelector from "../components/PresetSelector";

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [code, setCode] = useState("# create nodes to visualize!\n# eg. head = Node(5)\n# eg. head.next = Node(18)")
  const [output, setOutput] = useState("")
  const [isPyodideReady, setIsPyodideReady] = useState(false);
  const pyodideRef = useRef(null);

  const [isAutoRun, setIsAutoRun] = useState(true);
  
  useEffect(() => {
    if (!isAutoRun || !pyodideRef.current) return;

    const timer = setTimeout(() => {
      runCode()
    }, 1500);

    return () => clearTimeout(timer);
  }, [code, isAutoRun, isPyodideReady]);

  async function initPyodide() {
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

  const runCode = () => {
  setOutput("");

  if (window.pyWorker) {
    window.pyWorker.terminate();
  }

  const worker = new Worker("/pyWorker.js");
  window.pyWorker = worker;

  const safeCode = typeof code === "string" ? code : "";

  const hasCode = safeCode
  .split('\n')
  .some(line => line.trim() && !line.trim().startsWith('#'));

const indentedCode = hasCode
  ? safeCode.split('\n').map(line => '    ' + line).join('\n')
  : '    pass';

  const protectedCode = `
try:
${indentedCode}
except Exception as e:
    raise e
`;

  const timeout = setTimeout(() => {
    worker.terminate();
    setOutput("⛔ Execution stopped: Infinite loop detected");
  }, 1000);
  
  worker.onmessage = (e) => {
    const { type, data } = e.data;

    if (type === "stdout") {
      setOutput(prev => prev + data + "\n");
    }

    if (type === "state") {
      clearTimeout(timeout);
      const state = JSON.parse(data);
      setNodes(state.nodes);
      setEdges(state.edges);
    }

    if (type === "error") {
      clearTimeout(timeout);
      setOutput(`Runtime Error: ${data}`);
    }
  };

  worker.postMessage({
    setupCode: SETUP_CODE,
    userCode: protectedCode
  });
};


  const handlePresetSelect = (newCode) => {
    setCode(newCode);
  };

  return (
    <main className="flex h-screen w-screen bg-black text-white overflow-hidden">
      <Script 
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js" 
        strategy="afterInteractive"
        onLoad={initPyodide} 
      />

      <div className="w-[60%] h-full relative border-r border-gray-800">
        <Visualizer 
          nodes={nodes} 
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
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
        
        <div className="absolute top-6 right-[11rem] z-10 flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full border border-gray-600">
          <div className={`w-2 h-2 rounded-full ${isAutoRun ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
          <label className="text-xs font-bold text-gray-300 cursor-pointer select-none">
            <input 
              type="checkbox" 
              className="hidden" 
              checked={isAutoRun} 
              onChange={(e) => setIsAutoRun(e.target.checked)} 
            />
            {isAutoRun ? "Live Mode ON" : "Live Mode OFF"}
          </label>
        </div>
      </div>

      <div className="w-[40%] h-full flex flex-col">
        <PresetSelector onSelect={handlePresetSelect} />
        <div className="flex-grow relative">
          <CodeEditor code={code} setCode={setCode} />
        </div>
      </div>
    </main>
  );
}