const { tb_user } = require("../models");
const authService = require("../services/authService");
const { default: axios } = require("axios");

class Authentication {
  async regis(req, res, next) {
    req.start = Date.now();
    let status;
    let message;
    let dtUser;
    let foto;
    let id;
    // if (err instanceof multer.MulterError) {
    //   // a multer error occurred when uploading
    //   return res.status(200).json(err);
    // } else if (err) {
    //   return res.status(200).json(err);
    // }
    // const imagePath = path.join(__dirname, "../../public/image/pegawai");
    // const fileUpload = new resize(imagePath);
    // foto = await fileUpload.save(req.file.buffer, req.file.originalname);
    const item = {
      nama: req.body.nama,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      foto: "blankProfile.png",
    };
    // console.log(item);
    const dtSUser = await tb_user.findOne({
      where: { email: item.email },
    });
    if (!dtSUser) {
      dtUser = await tb_user.create(item);
      status = 200;
      message = "Akun Berhasil Dibuat";
      if (dtUser.role === "arep") {
        const arep = {
          id_user: dtUser.id,
          // nik : req.body.nik,
          tempat_lahir: req.body.tempat_lahir,
          tanggal_lahir: req.body.tanggal_lahir,
          wilayah: req.body.wilayah,
        };
        axios
          .post("http://localhost:9000/arep", arep)
          .then(function (res) {
            console.log(res.status);
            next();
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    } else if (dtSUser.email === item.email) {
      status = 401;
      message = "Akun Sudah Ada";
    }

    //get diagnostic
    let time = Date.now() - req.start;
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    const data = {
      diagnostic: {
        memoryUsage: `${Math.round(used * 100) / 100} MB`,
        elapsedTime: time,
        timestamp: Date(Date.now()).toString(),
        status: status,
        message: message,
      },
    };
    return res.status(status).json(data);
  }
  async login(req, res) {
    req.start = Date.now();
    let status;
    let message;
    let token;
    let email = req.header("email");
    let password = req.header("password");
    // let noWA = req.header("noWA");
    let response = {};
    console.log(email);
    const dtMember = await tb_user.findOne({ where: { email: email } });
    if (!dtMember) {
      status = 404;
      message = "Data member tidak ditemukan";
    } else {
      // const match = await bcrypt.compare(password, dtMember.password);
      // if (match === false) {
      if (password != dtMember.password) {
        status = 401;
        message = "Unauthorized";
        token = null;
      } else {
        token = authService().issue({ id: email, type: dtMember.role });
        token = `Bearer ${token}`;
        status = 200;
        message = "Login berhasil";
        response = {
          email: dtMember.email,
          nama: dtMember.nama,
          role: dtMember.role,
        };
      }
    }
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
      result: response,
    };
    res.set({ Authorization: token });
    res.set({ "Access-Control-Allow-Headers": "*" });
    res.set({ "Access-Control-Expose-Headers": "Authorization" });
    return res.status(status).json(data);
  }

  //  validation
  async verify(req, res) {
    req.start = Date.now();
    let data;
    let status;
    let message;
    let response;

    const token = req.header("Authorization").split("Bearer ")[1];

    let time = Date.now() - req.start;
    authService().verify(token, (err, result) => {
      if (err) {
        status = 401;
        message = err.message;
        response = {
          isvalid: false,
        };
      } else {
        status = 200;
        message = "validasi sukses";
        response = {
          isvalid: true,
          email: result.id,
          role: result.type,
        };
      }
      const used = process.memoryUsage().heapUsed / 1024 / 1024;
      data = {
        diagnostic: {
          status: status,
          message: message,
          memoryUsage: `${Math.round(used * 100) / 100} MB`,
          elapsedTime: time,
          timestamp: Date(Date.now()).toString(),
        },
        result: response,
      };
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
    if (req.params.email == null) {
      dtAnggota = await tb_user.findAll({ order: [["id", "ASC"]] });
    } else {
      dtAnggota = await tb_user.findAll({
        where: { email: req.params.email },
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
  // async logout(req, res) {
  //   const token = req.header("Authorization").split("Bearer ")[1];

  //   authService().blacklist(token, (err) => {
  //     if (err) {
  //       return res.status(401).json({ isvalid: false, err: "Invalid Token!" });
  //     }

  //     return res.status(200).json({ isvalid: true });
  //   });
  //   return res.status(401).json({ isvalid: "token revoked" });
  // }
}
const auth = new Authentication();
module.exports = auth;
