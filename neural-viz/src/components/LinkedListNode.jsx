import { Handle, Position } from "reactflow";
import { motion } from "framer-motion";

export default function LinkedListNode({ data }) {
  return (
    <div className="relative">
      {/* 1. The Pointers Stacked Above */}
      <div className="absolute bottom-[100%] left-1/2 -translate-x-1/2 w-max flex flex-col-reverse items-center gap-1 mb-2 pointer-events-none">
        {data.pointers && data.pointers.map((ptr) => (
          <motion.div 
            key={ptr}
            layoutId={ptr}
            transition={{type: "spring", stiffness: 300, damping: 25}} 
            className="bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded-full shadow-md font-bold uppercase tracking-wider"
          >
            {ptr} ▼
          </motion.div>
        ))}
      </div>

      {/* 2. Actual Node (Box) */}
      <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center shadow-xl">
        <div className="text-xl font-bold text-gray-800">
            {data.label}
        </div>
      </div>

      {/* 3. Connectors (Handles) */}
      {/* for next pointers */}
      <Handle type="target" position={Position.Left} id = "next-tgt" className="bg-gray-400!" style={{top: '35%'}}/>
      <Handle type="source" position={Position.Right} id = "next-src" className="bg-black! w-2! h-2!" style={{top:'35%'}}/>

      {/* for prev pointers */}
      <Handle type="source" position={Position.Left} id = "prev-src" className="bg-black! w-2! h-2!" style={{top:'65%'}}/>
      <Handle type="target" position={Position.Right} id = "prev-tgt" className="bg-gray-400!" style={{top:'65%'}}/>

        {/* Cyclic / circulra pointers*/}
      <Handle type="source" position={Position.Bottom} id="t-src" className="bg-transparent!" style={{ left: '60%' }} />
      <Handle type="target" position={Position.Bottom} id="t-tgt" className="bg-transparent!" style={{ left: '40%' }} />
    </div>
  );
}