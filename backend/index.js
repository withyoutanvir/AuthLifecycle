import express from 'express';
import {connectDB} from './db/connectDB.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import aitopiaRoutes from "./routes/aitopia.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// API routes should be registered before static and wildcard routes
app.use("/api/auth", authRoutes);
app.use("/api/aitopia", aitopiaRoutes);
console.log("NODE_ENV =", process.env.NODE_ENV);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  // Serve React app for all other routes (SPA)
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  // Dev mode: simple root response
  app.get("/", (req, res) => {
    res.send("Hello World 123");
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
