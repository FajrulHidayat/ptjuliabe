const express = require("express");
const router = express.Router();
const { arep } = require("../app/controllers");

//judul
router.post("/", arep.InsertData);
router.put("/:id_user", arep.UpdateData);
router.put("/foto/:id", arep.UpdateImage);
router.get("/", arep.SelectData);
router.get("/wilayah", arep.SelectWilayah);
router.get("/arep/:id_user", arep.SelectData);
router.delete("/:id_user", arep.DeleteData);


module.exports = router;
