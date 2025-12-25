"use client";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode }) {
  return (
    <div className="h-full w-full border-r border-gray-700">
      <Editor
        height="100%"
        defaultLanguage="python"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}