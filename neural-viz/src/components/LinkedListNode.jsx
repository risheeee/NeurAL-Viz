import { Handle, Position } from "reactflow";

export default function LinkedListNode({ data }) {
  return (
    <div className="relative">
      {/* 1. The Pointers Stacked Above */}
      <div className="absolute -top-12 left-0 w-full flex flex-col-reverse items-center gap-1">
        {data.pointers && data.pointers.map((ptr) => (
          <div 
            key={ptr} 
            className="bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded-full shadow-md font-bold uppercase tracking-wider"
          >
            {ptr} ▼
          </div>
        ))}
      </div>

      {/* 2. Actual Node (Box) */}
      <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center shadow-xl">
        <div className="text-xl font-bold text-gray-800">
            {data.label}
        </div>
      </div>

      {/* 3. Connectors (Handles) */}
      <Handle type="target" position={Position.Left} className="bg-gray-400!" />
      <Handle type="source" position={Position.Right} className="bg-black! w-3! h-3!" />
    </div>
  );
}