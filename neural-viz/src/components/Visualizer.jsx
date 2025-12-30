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
    </div>
  );
}