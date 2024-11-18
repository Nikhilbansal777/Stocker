const express = require("express");
const axios = require("axios");
const cors = require("cors"); // Import cors package

const app = express();

app.use(cors()); // Enable CORS for all routes

app.get("/fetch-stock/:stockTicker", async (req, res) => {
  const stockTicker = req.params.stockTicker;
  const url = `https://www.google.com/finance/quote/${stockTicker}:NSE`;
  try {
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

app.listen(3000, () => {
  console.log("Proxy server running on http://localhost:3000");
});
