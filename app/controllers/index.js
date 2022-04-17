const auth = require("./AuthController")
const arep = require("./ArepController")
const laporan = require("./LaporanController")

const controller = {
    auth,
    arep,
    laporan
}

module.exports = controller