# 🔗 NeurAL-Viz Real-time interactive LinkedList visualizer 

An interactive, browser-based tool to visualize Python Linked List algorithms. Built with **Next.js**, **React Flow**, and **Pyodide**, this tool allows developers to watch their code execute line-by-line, visualize pointer manipulations, and "time travel" through their algorithm's execution history.

## Key Features

* **⚡ Real-Time "Live Mode":** Toggle **Live Mode** to ON, and the visualizer will automatically compile and run your code as you type. No need to spam the "Run" button, just code and watch the graph update instantly.
* **🕰️ Time Travel Debugging:** The engine records a "movie reel" of your code's execution. Use the scrubber to step backward and forward through history to see exactly when and where a pointer changed.
* **👀 Deep Pointer Tracking:** Visualizes local variables (like `curr`, `prev`, `temp`) as dynamic badges attached to nodes.
* **🛣️ Smart Layout Engine:** Automatically detects structure. Merging two lists? It places them in separate lanes. Creating a cycle? It draws a curved red arrow to indicate the loop.
* **🛡️ Infinite Loop Protection:** Code runs in a dedicated **Web Worker** with a safety timeout, preventing accidental infinite loops from freezing your browser.

## How It Works

1. **The Engine (Pyodide):** Your Python code runs entirely in the browser using WebAssembly.
2. **Live Execution:** When **Live Mode** is active, the app detects when you stop typing. After a short delay, it sends your code to a Web Worker.
3. **The Snapshot System:** We inject a custom tracer that takes a snapshot of memory (Global & Local variables) after every single line of code.
4. **The Renderer:** React Flow parses these snapshots and updates the nodes and edges to reflect the exact state of your Linked List at that moment.

## Tech Stack

* **Framework:** [Next.js 13+](https://nextjs.org/) (App Router)
* **Visualization:** [React Flow](https://reactflow.dev/)
* **Python Engine:** [Pyodide](https://pyodide.org/) (WebAssembly)
* **Styling:** Tailwind CSS

## Getting Started

[NeurAL-Viz](https://neuralviz.vercel.app/)

## Try it with LeetCode problems

NeurAL-Viz is designed to help you **visualize Linked List solutions** from platforms like LeetCode.
You can copy your Python solution directly into the editor (or even write line by line), and watch how the pointers move step by step.

### recommended LeetCode problems to try

- **21. Merge Two Sorted Lists**
- **24. Swap Nodes in Pairs**
- **61. Rotate List**
- **83. Remove Duplicates from Sorted List**
- **141. Linked List Cycle**
- **206. Reverse Linked List**
- **876. Middle of the Linked List**
- **Anything else of your choice!**

## Example Usage
```
# create the Linked List
head = Node(9)
head.next = Node(18)
head.next.next = Node(27)
head.next.next.next = Node(36)
head.next.next.next.next = Node(45)

prev = None
curr = head

while curr:
    temp = curr.next

    curr.next = prev

    prev = curr
    curr = temp
    
head = prev
```

## 🤝 Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.