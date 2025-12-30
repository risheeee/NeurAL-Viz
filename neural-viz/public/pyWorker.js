let pyodide = null;

async function init() {
  if (pyodide) return;

  importScripts("https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js");

  pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
  });
}

self.onmessage = async (e) => {
  const { setupCode, userCode } = e.data;  

  try {
    await init();

    pyodide.setStdout({
      batched: (msg) => {
        self.postMessage({ type: "stdout", data: msg });
      },
    });

    // 🔴 if userCode were undefined, this line causes your error
    await pyodide.runPythonAsync(setupCode + "\n" + userCode);

    const stateJSON = await pyodide.runPythonAsync(
      "get_linked_list_state()"
    );

    self.postMessage({ type: "state", data: stateJSON });

  } catch (err) {
    self.postMessage({
      type: "error",
      data: err.message || String(err),
    });
  }
};
