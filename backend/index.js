require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = 5012;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate OpenAI response
async function getCompletion(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching completion:", error);
    return null;
  }
}

// Root API endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Node.js Backend with OpenAI and CORS!" });
});

// OpenAI API endpoint
app.post("/generate", async (req, res) => {
  const { text } = req.body; // Get text from request body

  if (!text) {
    return res.status(400).json({ error: "Text input is required" });
  }

  const prompt = `Want to create a WhatsApp bulk message content for ${text} with 250 chars. Include stickers also. Provide me message only.`;

  const response = await getCompletion(prompt);

  if (response) {
    res.json({ message: response });
  } else {
    res.status(500).json({ error: "Failed to generate content" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
