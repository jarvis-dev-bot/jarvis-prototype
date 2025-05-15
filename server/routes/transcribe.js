import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  res.json({ text: "我想吃中餐" });
});

export default router;
