"use client";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

const defaultNodes = [
  { id: "1", position: { x: 100, y: 100 }, data: { label: "Start Here" } },
];

export default function Visualizer({ nodes = defaultNodes, edges = [] }) {
  return (
    <div className="h-full w-full bg-gray-900">
      <ReactFlow nodes={nodes} edges={edges} fitView panActivationKeyCode={null}> 
        <Background color="#444" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}