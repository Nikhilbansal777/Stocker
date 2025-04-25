const express = require("express");
const axios = require("axios");
const cors = require("cors"); // Import cors package
const webpush = require("web-push");
const app = express();

const publicKey =
  "BIwHKMzF6gMtT89NlBq2mThi5G29Sxlge4jLFVZWJUx2dNOUQ6kL_0t3cmGC7S6rlDrEjQFvkyIX_PnBLXNEMEI";
const privateKey = "hqUZxsaEGPKJMFbQcqnnx9o52TWY-kTzwpxpQuDIfN0";

app.use(cors()); // Enable CORS for all routes

const sub = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/eo1exzbzSuY:APA91bExDYNYUs4R5Cb5aStkxU-NUeFi_VL_RJ5pK8HihseJL9Ya2-03AWgnjw8hMZVfGgNxYZhSAO9Bp8sDWs2WmFtKlrmjTSD3B-PbQsWGpu43vY2iZ7tzC_T9FcRn0cSpO_kk7pvV",
  expirationTime: null,
  keys: {
    p256dh:
      "BNCFMRHZRDCxKjG2Y7eJAhRoZB7p0oOjBg04LgOC5yQvwI2fMVxF2me7xPi26e2-rLvt37VkLoEp8IQXy9yrMl8",
    auth: "v1ZTRxT-KtOyCeyhFNQYGQ",
  },
};

webpush.setVapidDetails(
  "mailto:nikhil.saroj.bansal@gmail.com",
  publicKey,
  privateKey
);
const payLoad = {
  notification: {
    data: { url: "https://www.youtube.com/watch?v=0vSEmEdYKro" },
    title: "First notificaiton",
    Vibreate: [100, 500, 100],
  },
};
webpush.sendNotification(sub, JSON.stringify(payLoad));

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
