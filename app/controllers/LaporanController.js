const { tb_laporan,tb_arep,tb_user } = require("../models");
const path = require("path");
const multer = require("multer");
const { unlinkSync } =require('fs');
const Storage = multer.diskStorage({
    // Destination to store image     
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../../public/files"));
    },
      filename: (req, file, cb) => {
          cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});
const upload = multer({storage:Storage}).single("file");
class LaporanController {
  async InsertData(req, res) {
    await upload(req, res, async function (err) {
        //set diagnostic
        req.start = Date.now();
        let status;
        let message;
        let dtAnggota;
        let file
        let id;
        if (err instanceof multer.MulterError) {
            // a multer error occurred when uploading
            return res.status(200).json(err);
        } else if (err) {
            return res.status(200).json(err);
        }
        // console.log(res.req.file.originalname);
        // const imagePath = path.join(__dirname, "../../public/file");
        // // const fileUpload = new resize(imagePath);
        // file = await fileUpload.save(req.file.buffer, req.file.originalname);
        // // if(req.body.password == req.body.confirmPassword)
        // console.log(res.req);
        const item = {
        id_arep: req.body.id_arep,
        judul: req.body.judul,
        file: res.req.file.filename,
        status: "Baru",
        koreksi: ""
        };
        // console.log(item);
        // const dtSAnggota = await tb_komentar.findOne({
        //   where: { nim: req.body.nim },
        // });

        // if (dtSAnggota) {
        //   status = 404;
        //   message = "Data Sudah Ada";
        // } else {
        dtAnggota = await tb_laporan.create(item);
        status = 200;
        message = "Berhasil Input Data";
        // }
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
        return res.status(status).json(data);
    })
  }
  async SelectData(req, res) {
    //set diagnostic
    req.start = Date.now();
    let status;
    let message;
    let dtAnggota;

    //get data
    console.log(Object.keys(req.query)[0]);
    console.log(req.query[Object.keys(req.query)[0]]);
    let col =Object.keys(req.query)[0]
    const whe = {[col]:req.query[Object.keys(req.query)[0]]}
    console.log(whe);
    if (req.params.id_arep == null && req.params.id == null) {
      // console.log(req.params);
      dtAnggota = await tb_laporan.findAll({ order: [["id", "ASC"]] });
    } else if(req.params.id !== null && req.params.id_arep == null) {
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
  async SelectWhere(req, res) {
    //set diagnostic
    req.start = Date.now();
    let status;
    let message;
    let dtAnggota;
    let dtAnggotas=[];

    //get data
    // console.log(Object.keys(req.query)[0]);
    // console.log(req.query[Object.keys(req.query)[0]]);
    let col =Object.keys(req.query)[0]
    const whe = {[col]:req.query[Object.keys(req.query)[0]]}
    // console.log(whe);
    if(col === "wilayah"){
      const dtArep = await tb_arep.findAll({
        where: {wilayah:req.query[Object.keys(req.query)[0]]},
        order: [["id", "ASC"]],
      });
      // console.log("1");
      // console.log(dtArep[0].dataValues);
      await Promise.all(dtArep.map(async(element) => {
        // console.log(element.dataValues.id);
        const dtLaporan = await tb_laporan.findAll({
          where: {id_arep:`${element.dataValues.id}`},
          order: [["id", "ASC"]],
        });
        
        // dtAnggota.push(dtLaporan)
        await Promise.all(dtLaporan.map(async(el) => {
          // console.log(element);
          const dtUser = await tb_user.findAll({
            where: {id:`${element.dataValues.id_user}`},
            order: [["id", "ASC"]],
          });
          await Promise.all(dtUser.map(async(e) => {
            el.dataValues.nama=e.dataValues.nama
          }))
          // el.dataValues.nama=element.dataValues.nama
          el.dataValues.wilayah=element.dataValues.wilayah
          dtAnggota.push(el)
        })) ;
        // console.log(dtLaporan);
        // console.log(dtAnggota);
      }))
      // dtAnggota = dtLaporans
    }else{
      dtAnggota = await tb_laporan.findAll({
        where: whe,
        order: [["id", "ASC"]],
      });
      console.log(dtAnggota.length);
      await Promise.all(dtAnggota.map(async(element) => {
        const dtArep = await tb_arep.findAll({
          where: {id:`${element.dataValues.id_arep}`},
          order: [["id", "ASC"]],
        });
        console.log(dtArep.length);
        await Promise.all(dtArep.map(async(el) => {
          const dtUser = await tb_user.findAll({
            where: {id:`${el.dataValues.id_user}`},
            order: [["id", "ASC"]],
          });
          console.log(dtUser.length);
          await Promise.all(dtUser.map(async(e) => {
            element.dataValues.nama=e.dataValues.nama
          }))
          element.dataValues.wilayah=el.dataValues.wilayah
          dtAnggotas.push(element)
        })) ;
      }))
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
            unlinkSync(`${path.join(__dirname, "../../public/files/")}${dtSAnggota.file}`);
            console.log(`successfully deleted ${path.join(__dirname, "../../public/files/")}${dtSAnggota.file}`);
          } catch (err) {
            console.log(`failed to delete ${path.join(__dirname, "../../public/files/")}${dtSAnggota.file}`);
            // handle the error
          }
          dtAnggota = await tb_laporan.update(update, {
            where: { id: req.params.id_laporan },
          });
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
    })
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
      dtAnggota = await tb_arep.destroy({ where: { id_user: req.params.id_user } });
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
