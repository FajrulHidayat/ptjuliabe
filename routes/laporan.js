const express = require("express");
const router = express.Router();
const { laporan } = require("../app/controllers");

//judul
router.post("/", laporan.InsertData);
router.put("/:id_laporan", laporan.UpdateLaporan);
router.put("/status/:id_laporan", laporan.UpdateStatus);
router.put("/koreksi/:id_laporan", laporan.UpdateKoreksi);
router.get("/", laporan.SelectData);
router.get("/find", laporan.SelectWhere);
router.get("/opChart", laporan.SelectJumlah);
router.get("/PChart", laporan.SelectJumlahPimpinan);
router.get("/:id_arep", laporan.SelectData);
router.get("/file/:id", laporan.SelectData);
router.delete("/:id_user", laporan.DeleteData);


module.exports = router;
