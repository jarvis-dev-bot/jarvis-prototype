import express from "express";
import cors from "cors";
import transcribeRoute from "./routes/transcribe.js";
import restaurantRoute from "./routes/restaurant.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/transcribe", transcribeRoute);
app.use("/api/restaurant", restaurantRoute);

app.listen(3000, () => console.log("Server running on port 3000"));
