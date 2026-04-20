import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// ===== CONFIG =====
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DIGI_USERNAME = process.env.DIGI_USERNAME;
const DIGI_API_KEY = process.env.DIGI_API_KEY;

// ===== ROUTE =====
app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message || "";

    // ===== 1. FORMAT TOPUP =====
    const match = message.match(/^(\d{10,13})\s(\d{2,5})$/);

    if (match) {
      const nomor = match[1];
      const nominal = match[2];

      return res.json({
        reply: `🧾 ORDER\nNo: ${nomor}\nNominal: ${nominal}\n\n💳 Sila bayar dahulu.\nTaip DONE selepas bayar`
      });
    }

    // ===== 2. CONFIRM PAYMENT =====
    if (message.toLowerCase() === "done") {

      // contoh hit Digiflazz
      const response = await fetch("https://api.digiflazz.com/v1/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: DIGI_USERNAME,
          buyer_sku_code: "pulsa10", // tukar ikut produk
          customer_no: "08123456789", // nanti boleh dynamic
          ref_id: "INV" + Date.now(),
          sign: DIGI_API_KEY
        })
      });

      const data = await response.json();

      return res.json({
        reply: "✅ Pesanan sedang diproses..."
      });
    }

    // ===== 3. CHATGPT =====
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Kamu adalah bot jualan topup WhatsApp." },
          { role: "user", content: message }
        ]
      })
    });

    const aiData = await aiRes.json();

    const reply =
      aiData.choices?.[0]?.message?.content || "Maaf, error AI.";

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.json({ reply: "❌ Server error" });
  }
});

// ===== ROOT =====
app.get("/", (req, res) => {
  res.send("Bot aktif 🚀");
});

// ===== START =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan"));
