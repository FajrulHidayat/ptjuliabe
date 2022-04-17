'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_arep extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tb_arep.init({
    id_user:DataTypes.STRING,
    nik: DataTypes.STRING,
    tempat_lahir: DataTypes.STRING,
    tanggal_lahir: DataTypes.DATEONLY,
    wilayah: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tb_arep',
  });
  return tb_arep;
};