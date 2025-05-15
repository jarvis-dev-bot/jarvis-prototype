import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/", async (req, res) => {
  const { lat, lng, type = "chinese" } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing lat or lng" });
  }

  const url = `https://api.yelp.com/v3/businesses/search?term=${type}&latitude=${lat}&longitude=${lng}&sort_by=rating&limit=1`;

  try {
    const yelpRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
    });

    const data = await yelpRes.json();

    if (!data.businesses || data.businesses.length === 0) {
      return res.status(404).json({ error: "No businesses found" });
    }

    const top = data.businesses[0];

    res.json({
      name: top.name,
      rating: top.rating,
      phone: top.phone,
      address: top.location?.address1 || "",
      url: top.url,
      distance: top.distance,
    });
  } catch (error) {
    console.error("Yelp API error:", error);
    res.status(500).json({ error: "Yelp API failed" });
  }
});

export default router;
