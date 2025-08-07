import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 📌 API → Bot cevabı üret
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sen her zaman düzgün, anlaşılır ve kullanıcının dilinde cevap ver." },
        { role: "user", content: message }
      ]
    });

    const botMessageFinal = completion.choices[0].message.content;

    res.json({ botMessageFinal });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Bir hata oluştu" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
