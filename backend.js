const { spawn } = require("child_process");
const tcpPortUsed = require("tcp-port-used");
const path = require("path");

const PORT = 8000;
let backendProcess;

async function startBackend() {
  const isPortInUse = await tcpPortUsed.check(PORT);
  if (isPortInUse) {
    console.log("Backend is already running on port", PORT);
    return;
  }

  const backendCommand = process.platform === "win32" ? "node.exe" : "node";
  const backendArgs = ["index.js"];
  const backendPath = path.join(__dirname, "./server");

  try {
    backendProcess = spawn(backendCommand, backendArgs, {
      cwd: backendPath,
      stdio: ["inherit", "pipe", "pipe"],
      shell: true,
    });

    backendProcess.stdout.on("data", (data) => console.log(`Backend stdout: ${data}`));
    backendProcess.stderr.on("data", (data) => console.error(`Backend stderr: ${data}`));

    backendProcess.on("close", (code) => {
      console.log(`Backend process exited with code ${code}`);
      if (code !== 0) startBackend();
    });
  } catch (error) {
    console.error("Error starting backend:", error);
  }
}

module.exports = { startBackend };
