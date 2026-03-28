import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, voice } = req.body;

  if (!text || !voice) {
    return res.status(400).json({ error: "Missing text or voice" });
  }

  // YOUR SECRET API KEY (never exposed to frontend)
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ error: errorText });
    }

    // Get audio buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Send audio as response
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}