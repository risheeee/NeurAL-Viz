"use client";

const PRESETS = {
    basic: `# Basic singly linked list
head = Node(9)
head.next = Node(18)
head.next.next = Node(27)
head.next.next.next = Node(36)
head.next.next.next.next = Node(45)
    `,

    cycle: `# cyclic Linked List
head = Node(1)
node2 = Node(2)
node3 = Node(3)
node4 = Node(4)
node5 = Node(5)

head.next = node2
node2.next = node3
node3.next = node4
node4.next = node5
node5.next = node2
    `,

    circular: `# circular Linked List
head = Node(1)
second = Node(2)
third = Node(3)
fourth = Node(4)

head.next = second
second.next = third
third.next = fourth
fourth.next = head
    `,

    intersection: `# Linked List with an intersection
common = Node(8)
common.next = Node(7)

headA = Node(1)
headA.next = Node(9)
headA.next.next = common

headB = Node(3)
headB.next = common
    `
};

export default function PresetSelector({ onSelect }) {
  return (
    <div className="flex gap-2 p-2 bg-gray-800 border-b border-gray-700 overflow-x-auto no-scrollbar">
      <span className="text-gray-400 text-xs font-bold uppercase tracking-wider self-center mr-2">
        Presets:
      </span>
      
      {Object.entries(PRESETS).map(([key, code]) => (
        <button
          key={key}
          onClick={() => onSelect(code)}
          className="px-3 py-1 bg-gray-700 hover:bg-blue-600 text-xs text-white rounded transition-colors whitespace-nowrap border border-gray-600"
        >
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </button>
      ))}
    </div>
  );
}