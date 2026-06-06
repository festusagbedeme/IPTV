import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with named parameters
const getGeminiClient = (): GoogleGenAI | null => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Return null to handle gracefully if the user has not configured their key yet
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// 1. AI-powered EPG update route utilizing Google Search Grounding
app.post("/api/epg/update", async (req, res) => {
  const { channelName } = req.body;
  if (!channelName) {
    return res.status(400).json({ error: "Channel name is required" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    // Generate helpful mock EPG if API key is not configured yet
    const simulatedEpg = [
      {
        id: `sim-${channelName}-1`,
        channelId: channelName,
        title: `${channelName} Morning Show`,
        startTime: "08:00",
        endTime: "10:30",
        description: "A lively breakfast broadcast discussing the latest updates, lifestyle topics, and current local digests.",
        date: new Date().toISOString().split("T")[0],
        isLive: true,
      },
      {
        id: `sim-${channelName}-2`,
        channelId: channelName,
        title: `${channelName} Interactive Documentary`,
        startTime: "10:30",
        endTime: "12:00",
        description: "Specialized deep-dive report on wildlife conservations and deep atmospheric sciences.",
        date: new Date().toISOString().split("T")[0],
        isLive: false,
      },
      {
        id: `sim-${channelName}-3`,
        channelId: channelName,
        title: `${channelName} World Hour Prime`,
        startTime: "12:00",
        endTime: "13:30",
        description: "Global reporting, breaking broadcasts, and interactive talk interviews with industry pioneers.",
        date: new Date().toISOString().split("T")[0],
        isLive: false,
      }
    ];
    return res.json({
      channelName,
      epg: simulatedEpg,
      source: "Simulator fallback (Configure Gemini API Key in Settings > Secrets for real-world live search grounding)"
    });
  }

  try {
    const prompt = `Search the internet for current scheduling or typical daily EPG schedule details for the television channel: "${channelName}".
Return a list of exactly 3 sequential programming items starting around the current time.
For each program programmatically extract:
1. "title": A descriptive title of the show.
2. "startTime": in 24-hour HH:MM format (e.g. "14:15").
3. "endTime": in 24-hour HH:MM format (e.g. "15:45").
4. "description": A short explanation of the show's content (1-2 sentences).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of EPG schedule guides",
          items: {
            type: Type.OBJECT,
            required: ["title", "startTime", "endTime", "description"],
            properties: {
              title: { type: Type.STRING },
              startTime: { type: Type.STRING, description: "Format: HH:MM" },
              endTime: { type: Type.STRING, description: "Format: HH:MM" },
              description: { type: Type.STRING },
            }
          }
        }
      },
    });

    const textOutput = response.text || "[]";
    const parsedEpg = JSON.parse(textOutput.trim());

    // Clean data and inject date
    const todayStr = new Date().toISOString().split("T")[0];
    const epgItems = parsedEpg.map((item: any, idx: number) => ({
      id: `${channelName.replace(/\s+/g, '-').toLowerCase()}-${idx}-${Date.now()}`,
      channelId: channelName,
      title: item.title || `${channelName} Special Program`,
      startTime: item.startTime || "10:00",
      endTime: item.endTime || "11:30",
      description: item.description || "In-depth features and broadcast updates.",
      date: todayStr,
      isLive: idx === 0, // Simulate current one as live
    }));

    return res.json({
      channelName,
      epg: epgItems,
      source: "Gemini Live Web Grounding Search Engine"
    });
  } catch (error: any) {
    console.error("Gemini EPG Generation Error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate EPG via Gemini search" });
  }
});

// 2. Stalker portal login/handshake emulator
app.post("/api/stalker/handshake", (req, res) => {
  const { url, mac } = req.body;
  if (!url || !mac) {
    return res.status(400).json({ error: "Portal URL and MAC address are required" });
  }

  // Parse hostname for personalized branding
  let host = "default";
  try {
    const parsedUrl = new URL(url);
    host = parsedUrl.hostname;
  } catch (e) {
    // Keep default
  }

  const successMessage = `Stalker handshake successful! Key validated with client ID: MAG-254-v4.`;
  
  res.json({
    success: true,
    message: successMessage,
    panelSettings: {
      host,
      mac,
      expiresAt: "2028-12-31 23:59:59",
      maxConnections: 1,
      currentActiveConnections: 0,
      protocolVersion: "stalker_v5.3",
      packageType: "Premium Gold UHD Content Package",
      aspectRatio: "16:9",
      audioTracks: ["English (Primary Stereo)", "French (Stereo Dubbed)", "Auto Adaptive"],
      bufferRecommendationMs: 2000,
    }
  });
});

// Serve frontend assets or mount Vite server depending on environment
async function launchServerAndFrontends() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server and Vite frontend running securely on http://0.0.0.0:${PORT}`);
  });
}

launchServerAndFrontends();
