const express = require("express");
const authRoutes = require("./routes/authRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors");

// Configure CORS options
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from your frontend's URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
  credentials: true, // Allow credentials (cookies, authorization headers)
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "token",
  ], // Allowed headers
};

const app = express();
const PORT = process.env.PORT || 3000;

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(express.json());

// Preflight OPTIONS handling
app.options("*", cors(corsOptions));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use("/api/auth", authRoutes);
app.use("/api/passwords", passwordRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
