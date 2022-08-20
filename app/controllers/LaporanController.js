const { tb_laporan, tb_arep, tb_user } = require("../models");
const sendNotification = require("../services/NotificationService");
const path = require("path");
const multer = require("multer");
const { unlinkSync } = require("fs");
const Storage = multer.diskStorage({
  // Destination to store image
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/files"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});
const upload = multer({ storage: Storage }).single("file");
class LaporanController {
  async InsertData(req, res) {
    await upload(req, res, async function (err) {
      //set diagnostic
      req.start = Date.now();
      let status;
      let message;
      let dtAnggota;
      let file;
      let id;
      if (err instanceof multer.MulterError) {
        return res.status(200).json(err);
      } else if (err) {
        return res.status(200).json(err);
      }
      const item = {
        id_arep: req.body.id_arep,
        judul: req.body.judul,
        file: res.req.file.filename,
        status: "Baru",
        koreksi: "",
      };
      dtAnggota = await tb_laporan.create(item);
      status = 200;
      message = "Berhasil Input Data";
      //get diagnostic
      let time = Date.now() - req.start;
      const used = process.memoryUsage().heapUsed / 1024 / 1024;
      const data = {
        diagnostic: {
          memoryUsage: `${Math.round(used * 100) / 100} MB`,
          elapsedTime: time,
          timestamp: Date(Date.now()).toString(),
        },
        result: {
          status: status,
          messagae: message,
        },
      };
      const dtOP = await tb_user.findOne({ where: { role: "operator" } });
      sendNotification(
        dtOP.fcm_token,
        req.body.body,
        req.body.title,
        `http://localhost:3000/PeriksaLaporan?id=${dtAnggota.id}`
      );
      return res.status(status).json(data);
    });
  }
  async SelectData(req, res) {
    //set diagnostic
    req.start = Date.now();
    let status;
    let message;
    let dtAnggota;

    //get data
    // console.log(Object.keys(req.query)[0]);
    // console.log(req.query[Object.keys(req.query)[0]]);
    let col = Object.keys(req.query)[0];
    const whe = { [col]: req.query[Object.keys(req.query)[0]] };
    // console.log(whe);
    if (req.params.id_arep == null && req.params.id == null) {
      // console.log(req.params);
      dtAnggota = await tb_laporan.findAll({ order: [["id", "ASC"]] });
    } else if (req.params.id !== null && req.params.id_arep == null) {
      console.log(req.params);
      dtAnggota = await tb_laporan.findAll({
        where: { id: req.params.id },
        order: [["id", "ASC"]],
      });
    } else {
      console.log(req.params);
      dtAnggota = await tb_laporan.findAll({
        where: { id_arep: req.params.id_arep },
        order: [["id", "ASC"]],
      });
    }
    if (!dtAnggota) {
      status = 404;
      message = "Data Member Tidak Ditemukan";
    } else {
      status = 200;
      message = "Sukses";
    }
    // .then(angg=>{
    //     res.json(angg)
    // })
    // return res.status(200).send({
    //     message : 'Data Anggota Belum ada'
    // })

    //get diagnostic
    let time = Date.now() - req.start;
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    const data = {
      diagnostic: {
        status: status,
        message: message,
        memoryUsage: `${Math.round(used * 100) / 100} MB`,
        elapsedTime: time,
        timestamp: Date(Date.now()).toString(),
      },
      result: dtAnggota,
    };
    return res.status(status).json(data);
  }
  async SelectJumlah(req, res) {
    //set diagnostic
    req.start = Date.now();
    let status;
    let message;
    let dtAnggota, LMasuk, LKoreksi, LSetuju, TArep;

    //get data
    LMasuk = await tb_laporan.count({
      where: {
        status: "Baru",
      },
    });
    LKoreksi = await tb_laporan.count({
      where: {
        status: "Koreksi",
      },
    });
    LSetuju = await tb_laporan.count({
      where: {
        status: "Setuju",
      },
    });
    TArep = await tb_arep.count();
    dtAnggota = {
      baru: LMasuk,
      koreksi: LKoreksi,
      setuju: LSetuju,
      arep: TArep,
    };
    console.log(LMasuk);
    if (!dtAnggota) {
      status = 404;
      message = "Data Member Tidak Ditemukan";
    } else {
      status = 200;
      message = "Sukses";
    }
    // .then(angg=>{
    //     res.json(angg)
    // })
    // return res.status(200).send({
    //     message : 'Data Anggota Belum ada'
    // })

    //get diagnostic
    let time = Date.now() - req.start;
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    const data = {
      diagnostic: {
        status: status,
        message: message,
        memoryUsage: `${Math.round(used * 100) / 100} MB`,
        elapsedTime: time,
        timestamp: Date(Date.now()).toString(),
      },
      result: [dtAnggota],
    };
    return res.status(status).json(data);
  }
  async SelectJumlahPimpinan(req, res) {
    //set diagnostic
    req.start = Date.now();
    let status;
    let message;
    let dtAnggota, LPajak, LSetuju, TArep;

    //get data

    LSetuju = await tb_laporan.count({
      where: {
        status: "Setuju",
      },
    });
    LPajak = await tb_laporan.count({
      where: {
        status: "Pajak",
      },
    });
    TArep = await tb_arep.count();
    dtAnggota = { setuju: LSetuju, pajak: LPajak, arep: TArep };
    // console.log(LMasuk);
    if (!dtAnggota) {
      status = 404;
      message = "Data Member Tidak Ditemukan";
    } else {
      status = 200;
      message = "Sukses";
    }
    // .then(angg=>{
    //     res.json(angg)
    // })
    // return res.status(200).send({
    //     message : 'Data Anggota Belum ada'
    // })

    //get diagnostic
    let time = Date.now() - req.start;
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    const data = {
      diagnostic: {
        status: status,
        message: message,
        memoryUsage: `${Math.round(used * 100) / 100} MB`,
        elapsedTime: time,
        timestamp: Date(Date.now()).toString(),
      },
      result: [dtAnggota],
    };
    return res.status(status).json(data);
  }
  async SelectWhere(req, res) {
    //set diagnostic
    req.start = Date.now();
    let status;
    let message;
    let dtAnggota = [];
    let dtAnggotas = [];

    //get data
    // console.log(Object.keys(req.query)[0]);
    // console.log(req.query[Object.keys(req.query)[0]]);
    let col = Object.keys(req.query)[0];
    const whe = { [col]: req.query[Object.keys(req.query)[0]] };
    console.log(whe);
    if (col === "wilayah") {
      const dtArep = await tb_arep.findAll({
        where: whe,
        order: [["id", "ASC"]],
      });
      // console.log("1");
      // console.log(dtArep[0].dataValues);
      await Promise.all(
        dtArep.map(async (element) => {
          console.log(element.dataValues.id);
          const dtLaporan = await tb_laporan.findAll({
            where: { id_arep: `${element.dataValues.id}` },
            order: [["id", "ASC"]],
          });

          // dtAnggota.push(dtLaporan)
          await Promise.all(
            dtLaporan.map(async (el) => {
              console.log("el");
              console.log(el);
              const dtUser = await tb_user.findAll({
                where: { id: `${element.dataValues.id_user}` },
                order: [["id", "ASC"]],
              });
              await Promise.all(
                dtUser.map(async (e) => {
                  el.dataValues.nama = e.dataValues.nama;
                })
              );
              // el.dataValues.nama=element.dataValues.nama
              el.dataValues.wilayah = element.dataValues.wilayah;
              // console.log(el);
              dtAnggota.push(el);
            })
          );
          // console.log(dtLaporan);
          // console.log(dtAnggota);
        })
      );
      // dtAnggota = dtLaporans
    } else {
      dtAnggota = await tb_laporan.findAll({
        where: whe,
        order: [["id", "ASC"]],
      });
      console.log(dtAnggota.length);
      await Promise.all(
        dtAnggota.map(async (element) => {
          const dtArep = await tb_arep.findAll({
            where: { id: `${element.dataValues.id_arep}` },
            order: [["id", "ASC"]],
          });
          console.log(dtArep.length);
          await Promise.all(
            dtArep.map(async (el) => {
              const dtUser = await tb_user.findAll({
                where: { id: `${el.dataValues.id_user}` },
                order: [["id", "ASC"]],
              });
              console.log(dtUser.length);
              await Promise.all(
                dtUser.map(async (e) => {
                  element.dataValues.nama = e.dataValues.nama;
                })
              );
              element.dataValues.wilayah = el.dataValues.wilayah;
              dtAnggotas.push(element);
            })
          );
        })
      );
    }
    if (!dtAnggota) {
      status = 404;
      message = "Data Member Tidak Ditemukan";
    } else {
      status = 200;
      message = "Sukses";
    }
    // .then(angg=>{
    //     res.json(angg)
    // })
    // return res.status(200).send({
    //     message : 'Data Anggota Belum ada'
    // })

    //get diagnostic
    let time = Date.now() - req.start;
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    // console.log("dtAnggota");
    const data = {
      diagnostic: {
        status: status,
        message: message,
        memoryUsage: `${Math.round(used * 100) / 100} MB`,
        elapsedTime: time,
        timestamp: Date(Date.now()).toString(),
      },
      result: dtAnggota,
    };
    return res.status(status).json(data);
  }
  async UpdateLaporan(req, res) {
    await upload(req, res, async function (err) {
      //set diagnostic
      req.start = Date.now();
      let status;
      let message;
      let id_laporan;
      let dtAnggota;
      if (err instanceof multer.MulterError) {
        // a multer error occurred when uploading
        return res.status(200).json(err);
      } else if (err) {
        return res.status(200).json(err);
      }
      const update = {
        file: res.req.file.filename,
        status: "Baru",
      };
      console.log(res.req.file.filename);
      if (req.params.id_laporan == null) {
        status = 403;
        message = "ID harus tercantumkan";
        id_laporan = null;
      } else {
        const dtSAnggota = await tb_laporan.findOne({
          where: { id: req.params.id_laporan },
        });

        if (!dtSAnggota) {
          status = 404;
          message = "Data Member Tidak Ditemukan";
          id_laporan = null;
        } else {
          try {
            unlinkSync(
              `${path.join(__dirname, "../../public/files/")}${dtSAnggota.file}`
            );
            console.log(
              `successfully deleted ${path.join(
                __dirname,
                "../../public/files/"
              )}${dtSAnggota.file}`
            );
          } catch (err) {
            console.log(
              `failed to delete ${path.join(__dirname, "../../public/files/")}${
                dtSAnggota.file
              }`
            );
            // handle the error
          }
          dtAnggota = await tb_laporan.update(update, {
            where: { id: req.params.id_laporan },
          });
          status = 200;
          message = "Sukses";
          id_laporan = dtSAnggota.id;
          const dtOP = await tb_user.findOne({ where: { role: "operator" } });
          sendNotification(
            dtOP.fcm_token,
            "Laporan Telah Diperbaharui Oleh Penganggung Jawab ",
            "Laporan Diperbaharui",
            `http://localhost:3000/PeriksaLaporan?id=${req.params.id_laporan}`
          );
        }
      }

      //get diagnostic
      let time = Date.now() - req.start;
      const used = process.memoryUsage().heapUsed / 1024 / 1024;
      const data = {
        diagnostic: {
          status: status,
          message: message,
          memoryUsage: `${Math.round(used * 100) / 100} MB`,
          elapsedTime: time,
          timestamp: Date(Date.now()).toString(),
        },
        result: id_laporan,
      };
      return res.status(status).json(data);
    });
  }
  async UpdateStatus(req, res) {
    //set diagnostic
    req.start = Date.now();
    let status;
    let message;
    let id_laporan;
    let dtAnggota;

    const update = {
      status: req.body.status,
    };

    if (req.params.id_laporan == null) {
      status = 403;
      message = "ID harus tercantumkan";
      id_laporan = null;
    } else {
      const dtSAnggota = await tb_laporan.findOne({
        where: { id: req.params.id_laporan },
      });

      if (!dtSAnggota) {
        status = 404;
        message = "Data Member Tidak Ditemukan";
        id_laporan = null;
      } else {
        dtAnggota = await tb_laporan.update(update, {
          where: { id: req.params.id_laporan },
        });
        const dtArep = await tb_arep.findOne({
          where: { id: dtSAnggota.id_arep },
        });
        const dtUser = await tb_user.findOne({ where: { id: dtArep.id_user } });
        sendNotification(
          dtUser.fcm_token,
          `Laporan Anda Berubah Status menjadi ${req.body.status}`,
          "Perubahan Status",
          `http://localhost:3000/laporan?id=${req.params.id_laporan}&status=${req.body.status}`
        );
        if (req.body.status === "Setuju") {
          const dtPimpinan = await tb_user.findOne({
            where: { role: "pimpinan" },
          });
          sendNotification(
            dtPimpinan.fcm_token,
            "Laporan Penanggung Jawab telah divalidasi oleh Operator",
            `Laporan Baru`,
            `http://localhost:3000/PimpinanPeriksaLaporan?id=${req.params.id_laporan}`
          );
        }
        status = 200;
        message = "Sukses";
        id_laporan = dtSAnggota.id;
      }
    }

    //get diagnostic
    let time = Date.now() - req.start;
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    const data = {
      diagnostic: {
        status: status,
        message: message,
        memoryUsage: `${Math.round(used * 100) / 100} MB`,
        elapsedTime: time,
        timestamp: Date(Date.now()).toString(),
      },
      result: id_laporan,
    };
    return res.status(status).json(data);
  }
  async UpdateKoreksi(req, res) {
    //set diagnostic
    req.start = Date.now();
    let status;
    let message;
    let id_laporan;
    let dtAnggota;

    const update = {
      koreksi: req.body.koreksi,
      status: "Revisi",
      pengoreksi: req.body.pengoreksi,
    };

    if (req.params.id_laporan == null) {
      status = 403;
      message = "ID harus tercantumkan";
      id_laporan = null;
    } else {
      const dtSAnggota = await tb_laporan.findOne({
        where: { id: req.params.id_laporan },
      });

      if (!dtSAnggota) {
        status = 404;
        message = "Data Member Tidak Ditemukan";
        id_laporan = null;
      } else {
        dtAnggota = await tb_laporan.update(update, {
          where: { id: req.params.id_laporan },
        });
        const dtArep = await tb_arep.findOne({
          where: { id: dtSAnggota.id_arep },
        });
        const dtUser = await tb_user.findOne({ where: { id: dtArep.id_user } });
        sendNotification(
          dtUser.fcm_token,
          `Laporan Anda Mendapatkan Revisi`,
          "Revisi Laporan",
          `http://localhost:3000/laporan?id=${req.params.id_laporan}&status=Revisi`
        );
        status = 200;
        message = "Sukses";
        id_laporan = dtSAnggota.id;
      }
    }

    //get diagnostic
    let time = Date.now() - req.start;
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    const data = {
      diagnostic: {
        status: status,
        message: message,
        memoryUsage: `${Math.round(used * 100) / 100} MB`,
        elapsedTime: time,
        timestamp: Date(Date.now()).toString(),
      },
      result: id_laporan,
    };
    return res.status(status).json(data);
  }
  async DeleteData(req, res) {
    //set diagnostic
    req.start = Date.now();
    let status;
    let message;
    let dtAnggota;
    let id;

    if (req.params.id == null) {
      status = 403;
      message = "ID harus tercantumkan";
      id = null;
    } else {
      dtAnggota = await tb_arep.destroy({
        where: { id_user: req.params.id_user },
      });
    }
    if (!dtAnggota) {
      status = 404;
      message = "Data Member Tidak Ditemukan";
      id = null;
    } else {
      status = 200;
      message = "Sukses";
      id = dtAnggota.id_user;
    }

    //get diagnostic
    let time = Date.now() - req.start;
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    const data = {
      diagnostic: {
        status: status,
        message: message,
        memoryUsage: `${Math.round(used * 100) / 100} MB`,
        elapsedTime: time,
        timestamp: Date(Date.now()).toString(),
      },
      result: id,
    };
    return res.status(status).json(data);
  }
}
const laporanController = new LaporanController();
module.exports = laporanController;
