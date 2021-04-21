// Global imports
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Relative imports
import postRoutes from "./routes/posts.js";

// Set up middleware
const app = express();

// Middleware configuration
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Route configuration
app.use("/posts", postRoutes);

// Using MongoDB's free shared cluster
// https://www.mongodb.com/cloud/atlas

// Environment variables
// TODO: Create .env file to store these values
const CONNECTION_URL =
  "mongodb+srv://nicksinclair:nicksinclair123@cluster0.q7i7z.mongodb.net/bakepedia?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

// Establish connection with database
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.error(error.message));

// Removes warnings in console
mongoose.set("useFindAndModify", false);
