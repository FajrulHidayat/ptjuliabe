const { tb_arep,tb_user } = require("../models");
const sequelize = require("sequelize")
const path = require("path");
const multer = require("multer");
const upload = multer().single("foto");
const resize = require("../services/resize.service");
class ArepController {
  async InsertData(req, res) {
    //set diagnostic
    req.start = Date.now();
    let status;
    let message;
    let dtAnggota;
    let id;

    // if(req.body.password == req.body.confirmPassword)
    console.log(req.body);
    const item = {
      id_user: req.body.id_user,
      nik: req.body.nik,
      tempat_lahir: req.body.tempat_lahir,
      tanggal_lahir: req.body.tanggal_lahir,
      wilayah: req.body.wilayah
    };
    // console.log(item);
    // const dtSAnggota = await tb_komentar.findOne({
    //   where: { nim: req.body.nim },
    // });

    // if (dtSAnggota) {
    //   status = 404;
    //   message = "Data Sudah Ada";
    // } else {
    dtAnggota = await tb_arep.create(item);
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
  }
  async SelectData(req, res) {
    //set diagnostic
    req.start = Date.now();
    let status;
    let message;
    let dtAnggota;
    let dataArep=[];

    //get data
    if (req.params.id_user == null) {
      dtAnggota = await tb_arep.findAll({ order: [["id_user", "ASC"]] });
      for (let i = 0; i < dtAnggota.length; i++) {
        let objData = dtAnggota[i].dataValues
        const dtUser = await tb_user.findAll({ where: { id: dtAnggota[i].dataValues.id_user }, order: [["id", "ASC"]] });
        objData.email = dtUser[0].dataValues.email
        objData.nama = dtUser[0].dataValues.nama
        // console.log(dtUser[0].dataValues);
        dataArep.push(objData)
      }
    } else {
      dtAnggota = await tb_arep.findAll({
        where: { id_user: req.params.id_user },
        order: [["id_user", "ASC"]],
      });
      // console.log(dtAnggota[0].dataValues);
      let objData = dtAnggota[0].dataValues
      const dtUser = await tb_user.findAll({ where: { id: dtAnggota[0].dataValues.id_user }, order: [["id", "ASC"]] });
      objData.email = dtUser[0].dataValues.email
      objData.nama = dtUser[0].dataValues.nama
      // console.log(dtUser[0].dataValues);
      dataArep.push(objData)
      // dataArep.push(dtAnggota)
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
    // console.log(dataArep);
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
      result: dataArep,
    };
    return res.status(status).json(data);
  }
  async SelectWilayah(req, res) {
    //set diagnostic
    req.start = Date.now();
    let status;
    let message;
    let dtAnggota;
    let dataArep=[];

    //get data
    
      dtAnggota = await tb_arep.findAll({attributes:[[sequelize.fn('DISTINCT', sequelize.col('wilayah')), 'Wilayah']],order: [["wilayah", "ASC"]] });
    //  console.log(dtAnggota);
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
    // console.log(dataArep);
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
  async UpdateData(req, res) {
    //set diagnostic
    req.start = Date.now();
    let status;
    let message;
    let id;
    let dtAnggota,dtUser;

    const update = {
        nik: req.body.nik,
        tempat_lahir: req.body.tempat_lahir,
        tanggal_lahir: req.body.tanggal_lahir,
        wilayah: req.body.wilayah,
    };
    const updateUser = {
        nama: req.body.nama
    };

    if (req.params.id_user == null) {
      status = 403;
      message = "ID harus tercantumkan";
      id_user = null;
    } else {
      const dtSAnggota = await tb_arep.findOne({
        where: { id: req.params.id_user },
      });
      // console.log(dtSAnggota.dataValues);
      if (!dtSAnggota) {
        status = 404;
        message = "Data Member Tidak Ditemukan";
        id = null;
      } else {
        dtAnggota = await tb_arep.update(update, {
          where: { id: req.params.id_user },
        });
        dtUser = await tb_user.update(updateUser, {
          where: { id: dtSAnggota.dataValues.id_user },
        });
        status = 200;
        message = "Sukses";
        id = dtSAnggota.id;
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
      result: id,
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
  async UpdateImage(req, res) {
    await upload(req, res, async function (err) {
    //set diagnostic
    req.start = Date.now();
    let status;
    let message;
    let dtAnggota;
    let id;
    let foto;

    if (err instanceof multer.MulterError) {
        // a multer error occurred when uploading
        return res.status(200).json(err);
      } else if (err) {
        return res.status(200).json(err);
      }
      const imagePath = path.join(__dirname, "../../public/image/");
      const fileUpload = new resize(imagePath);
      foto = await fileUpload.save(req.file.buffer, req.file.originalname);
      console.log(foto);
    const update = {
        foto: foto
    };

    if (req.params.id == null) {
      status = 403;
      message = "ID harus tercantumkan";
      id = null;
    } else {
      const dtSAnggota = await tb_user.findOne({
        where: { id: req.params.id },
      });

      if (!dtSAnggota) {
        status = 404;
        message = "Data Member Tidak Ditemukan";
        id = null;
      } else {
        dtAnggota = await tb_user.update(update, {
          where: { id: req.params.id },
        });
        status = 200;
        message = "Sukses";
        id = dtSAnggota.id;
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
      result: id,
    };
    return res.status(status).json(data);
});
  }
}

const arepController = new ArepController();
module.exports = arepController;
