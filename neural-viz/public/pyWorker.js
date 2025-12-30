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

    // 1. Initialize (Define Node class, etc.)
    await pyodide.runPythonAsync(setupCode);

    // 2. Run User Code
    // (Tracing logic is now embedded INSIDE userCode by page.js)
    try {
        await pyodide.runPythonAsync(`run_user_code("""${userCode}""")`);
    } catch (userErr) {
        // Send error but CONTINUE so we can still fetch the history up to the crash
        self.postMessage({ type: "error", data: userErr.message || String(userErr) });
    }

    // 3. Fetch the Movie Reel (History)
    // We fetch this even if the code crashed, so we can see what happened
    const historyJSON = await pyodide.runPythonAsync("get_history_json()");
    self.postMessage({ type: "history", data: historyJSON });

  } catch (err) {
    self.postMessage({
      type: "error",
      data: err.message || String(err),
    });
  }
};