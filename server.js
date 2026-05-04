import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post("/api/messages", async (req, res) => {
  try {
    const response = await client.messages.create(req.body);
    res.json(response);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/", (req, res) => res.send("Scout API is running!"));

app.listen(process.env.PORT || 3001, () => console.log("Server started"));