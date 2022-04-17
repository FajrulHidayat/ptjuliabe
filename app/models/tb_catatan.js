'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_catatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tb_catatan.init({
    id_laporan: DataTypes.STRING,
    catatan: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'tb_catatan',
  });
  return tb_catatan;
};