import express from "express";
import bodyParser from "body-parser";

const app = express();
app.post("/chat", async (req, res) => {
  const message = req.body.message?.toLowerCase() || "";

  let reply = "Format salah.\nContoh: 08123456789 10";

  const match = message.match(/^(08\d{8,11})\s(10|15|25)$/);

  if (match) {
    const nomor = match[1];
    const nominal = match[2];

    reply = `✅ ORDER\nNo: ${nomor}\nNominal: ${nominal}\n\nSilakan bayar & ketik DONE`;
  }

  if (message === "done") {
    reply = "⏳ Sedang diproses...\nPulsa akan dikirim otomatis.";
  }

  res.json({ reply });
});

app.get("/", (req, res) => {
  res.send("Bot aktif 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan"));
