require("dotenv").config();
const express = require("express");
const cors = require("cors");
const searchRoute = require("./api/search");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static frontend files (if run locally)
app.use(express.static("../frontend"));

// API Routes
app.use("/api/search-cars", searchRoute);

// Vercel serverless functions handle the root differently, 
// but for local dev we start the server:
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the Express API for Vercel
module.exports = app;
