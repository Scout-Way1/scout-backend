import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "4mb" }));

app.post("/api/messages", async (req, res) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    if (data.error) console.log("Error:", data.error);
    res.status(response.status).json(data);
  } catch (e) {
    console.log("Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get("/", (req, res) => res.send("Scout API is running!"));

app.listen(process.env.PORT || 3001, () => console.log("Server started"));
