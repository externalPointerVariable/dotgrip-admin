import express from "express";
import cors from "cors";
import router from "./routes/test_put.ts";
import connectDB from "./utils/mongo.util.ts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.use("/test", router);

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
