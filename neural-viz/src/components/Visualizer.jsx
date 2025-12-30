"use client";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import LinkedListNode from "./LinkedListNode"; 
import { LayoutGroup } from "framer-motion";

const nodeTypes = {
  linkedListNode: LinkedListNode,
};

export default function Visualizer({ nodes = [], edges = [], onNodesChange, onEdgesChange }) {

  const styledNodes = nodes.map(node => ({
    ...node,
    type: 'linkedListNode', 
  }));

  return (
    <div className="h-full w-full bg-gray-900">
      <LayoutGroup>
      <ReactFlow 
        nodes={styledNodes} 
        edges={edges} 
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes} 
        fitView
        panActivationKeyCode={null} 
      >
        <Background color="#255" gap={20} />
        <Controls />
      </ReactFlow>
      </LayoutGroup>

      <div className="absolute top-5 left-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-gray-700 text-[10px] text-gray-300 z-10 shadow-xl pointer-events-none select-none">
        <div className="font-bold mb-2 text-gray-500 uppercase tracking-widest text-[9px]">Legend</div>
        
        <div className="flex items-center gap-3 mb-1.5">
           <div className="w-8 h-0.5 border-b border-green-400 border-dashed overflow-hidden">
              {/*<div className="absolute inset-0 bg-white/50 w-full h-full animate-pulse"></div>*/}
           </div>
           <span>Next (Forward)</span>
        </div>

        <div className="flex items-center gap-3 mb-1.5">
           <div className="w-8 h-0.5 border-b border-yellow-400 border-dashed"></div>
           <span>Prev (Backward)</span>
        </div>

        <div className="flex items-center gap-3">
           <div className="w-8 h-0.5 border-b border-red-800 border-dashed"></div>
           <span>Circular / Cycle</span>
        </div>
      </div>

    </div>
  );
}