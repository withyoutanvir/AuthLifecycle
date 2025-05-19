import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/lang", async (req, res) => {
  try {
    const response = await axios.post(
      "https://extensions.aitopia.ai/languages/lang/get/lang/en",
      req.body,
      { headers: { "Content-Type": "application/json" } }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch Aitopia language data" });
  }
});

export default router;
