// Simple Node.js backend for contact form: echoes + logs messages.
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // serve index.html and public/

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body || {};
  const entry = {
    at: new Date().toISOString(),
    name, email, message,
    ua: (req.headers["user-agent"] || ""),
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress
  };
  // Log to a local file
  const logPath = path.join(__dirname, "contact.log");
  fs.appendFile(logPath, JSON.stringify(entry) + "\n", (err) => {
    if (err) console.error("Log write failed:", err);
  });

  // Echo back payload for quick client-side confirmation
  res.json({ ok: true, status: "received", echo: { name, email, message } });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
});
