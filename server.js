import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "4mb" }));

app.post("/api/messages", async (req, res) => {
  try {
    // Forward anthropic-beta header from client if present (needed for web_fetch and other beta tools).
    // Falls back to enabling web-fetch by default since that's what Scout AI uses.
    const betaHeader = req.headers["anthropic-beta"] || "web-fetch-2025-09-10";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "anthropic-beta": betaHeader,
        "x-api-key": process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log("Status:", response.status, "| beta:", betaHeader);
    if (data.error) console.log("Anthropic error:", JSON.stringify(data.error));
    res.status(response.status).json(data);
  } catch (e) {
    console.log("Proxy error:", e.message);
    res.status(500).json({ error: { type: "proxy_error", message: e.message } });
  }
});

app.get("/", (req, res) => res.send("Scout API is running!"));

app.listen(process.env.PORT || 3001, () => console.log("Server started"));
