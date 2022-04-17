const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const authRoutes = require("../routes/auth");
const arepRoutes = require("../routes/arep");
const laporanRoutes = require("../routes/laporan");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

axios.default.baseURL = "http://localhost:9000/";
// axios.defaults.baseURL = "http://151.106.108.85:9000/";
app.get("/", (req, res) =>
  res.status(200).send({
    message: "selamat datang",
  })
);

app.use("/image", express.static("public/image/"));
app.use("/file", express.static("public/files/"));
app.use("/auth", authRoutes);
app.use("/arep", arepRoutes);
app.use("/laporan", laporanRoutes);

module.exports = app;
