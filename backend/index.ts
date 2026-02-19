import express from "express";
import cors from "cors";
import connectDB from "./utils/mongo.util.ts";
import { AuthRoutes } from "./routes/auth.routes.ts";
import influencerRoutes from "./routes/influencer.routes.ts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.use("/api/auth", AuthRoutes);
app.use("/api/influencers", influencerRoutes);

connectDB()
  .then(() => [
    console.log("✅ Database connected"),
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    }),
  ])
  .catch((error) => {
    console.error("❌ Failed to connect to the database:", error);
  });
