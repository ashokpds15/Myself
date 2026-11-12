const { spawn } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const processes = [
  {
    name: "blog backend",
    args: [path.join(root, "backend", "server.js")],
    cwd: path.join(root, "backend"),
    env: {
      ...process.env,
      PORT: process.env.BACKEND_PORT || "5000",
    },
  },
  {
    name: "portfolio frontend",
    args: [require.resolve("react-scripts/scripts/start.js")],
    cwd: root,
    env: {
      ...process.env,
      ...(process.env.FRONTEND_PORT ? { PORT: process.env.FRONTEND_PORT } : {}),
    },
  },
];

const children = [];
let stopping = false;

function stopAll(exitCode = 0) {
  if (stopping) {
    return;
  }

  stopping = true;
  process.exitCode = exitCode;
  children.forEach((child) => {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill();
    }
  });
}

processes.forEach(({ name, args, cwd, env }) => {
  const child = spawn(process.execPath, args, { cwd, env, stdio: "inherit" });
  children.push(child);

  child.on("error", (error) => {
    console.error(`Unable to start ${name}:`, error);
    stopAll(1);
  });

  child.on("exit", (code) => {
    if (!stopping) {
      if (code !== 0) {
        console.error(`${name} exited with code ${code}.`);
      }
      stopAll(code || 0);
    }
  });
});

process.on("SIGINT", () => stopAll());
process.on("SIGTERM", () => stopAll());
