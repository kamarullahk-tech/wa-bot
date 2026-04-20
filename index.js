import express from "express";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  res.json({ reply: "Bot jalan bro!" });
});

app.get("/", (req, res) => {
  res.send("Server hidup");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
