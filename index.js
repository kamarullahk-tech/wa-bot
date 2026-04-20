import express from "express";

const app = express();
app.use(express.json());

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
        reply: `📄 ORDER\nNo: ${nomor}\nNominal: ${nominal}\n\n💳 Sila bayar dahulu.\nTaip DONE selepas bayar`
      });
    }

    // ===== 2. CONFIRM PAYMENT =====
    if (message.toLowerCase() === "done") {
      return res.json({
        reply: "⏳ Pesanan sedang diproses..."
      });
    }

    // ===== 3. DEFAULT REPLY =====
    return res.json({
      reply: "Bot aktif 🤖"
    });

  } catch (err) {
    console.error(err);
    res.json({ reply: "❌ Server error" });
  }
});

// ===== ROOT =====
app.get("/", (req, res) => {
  res.send("Bot jalan ✅");
});

// ===== START =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan di port " + PORT));
