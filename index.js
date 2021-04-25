// Global imports
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Relative imports
import postRoutes from "./routes/posts.js";

// Set up middleware
const app = express();

// Allow reading of environment variables from .env
dotenv.config();

// Middleware configuration
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Route configuration
app.use("/posts", postRoutes);

// Greeting
app.get("/", (req, res) => {
  res.send("Hello to Bakepedia API!");
});

// Using MongoDB's free shared cluster
// https://www.mongodb.com/cloud/atlas

// Environment variables
const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

// Establish connection with database
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}!`))
  )
  .catch((error) => console.error(error));

// Removes warnings in console
mongoose.set("useFindAndModify", false);
