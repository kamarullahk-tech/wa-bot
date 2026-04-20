app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message || "";

    // ===== 1. FORMAT TOPUP =====
    const match = message.match(/^(\d{10,13})\s(\d{2,5})$/);

    if (match) {
      const nomor = match[1];
      const nominal = match[2];

      return res.json({
        replies: [
          `📄 ORDER\nNo: ${nomor}\nNominal: ${nominal}\n\nSila buat pembayaran`
        ]
      });
    }

    // ===== 2. CONFIRM PAYMENT =====
    if (message.toLowerCase() === "done") {
      return res.json({
        replies: ["⏳ Pesanan sedang diproses..."]
      });
    }

    // ===== 3. DEFAULT =====
    return res.json({
      replies: ["Bot aktif 🤖"]
    });

  } catch (err) {
    console.error(err);
    res.json({
      replies: ["❌ Server error"]
    });
  }
});
