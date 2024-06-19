const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json({ extended: false }));

// Define route
app.use("/api/auth", authRoutes);

// Default route
app.get('/', (req, res) => res.send('API running'));

module.exports = app;