'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_laporan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tb_laporan.init({
    id_arep: DataTypes.STRING,
    judul: DataTypes.STRING,
    file: DataTypes.STRING,
    status: DataTypes.STRING,
    koreksi: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tb_laporan',
  });
  return tb_laporan;
};