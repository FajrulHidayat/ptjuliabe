const express = require("express");
const router = express.Router();
const { auth } = require("../app/controllers");

//judul
router.post("/regis", auth.regis);
router.post("/login", auth.login);
// router.post("/logout", auth.logout);
router.post("/verify", auth.verify);
router.put("/setToken/:id", auth.SetToken);
router.get("/getToken/:id", auth.GetToken);
router.get("/:email", auth.SelectData);

module.exports = router;
