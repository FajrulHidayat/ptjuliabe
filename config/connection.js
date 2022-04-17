require("dotenv/config");
const development = {
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || "127.0.0.1",
  dialect: "mysql",
  // }
  // const development = {
  //   username: "fajrul",
  //   password: "fajrul",
  //   database: "protoskripsi",
  //   dialect: "mysql",
  // }
  dialectOptions: {
    options: {
      useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: function (field, next) {
        // for reading from database
        if (field.type === "DATETIME") {
          return field.string();
        }
        return next();
      },
    },
  },
  timezone: "+08:00",
};
const test = {
  username: "root",
  password: "",
  database: "protoskripsi",
  host: "127.0.0.1",
  dialect: "mysql",
};
const production = {
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || "127.0.0.1",
  dialect: "mysql",
  dialectOptions: {
    options: {
      useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: function (field, next) {
        // for reading from database
        if (field.type === "DATETIME") {
          return field.string();
        }
        return next();
      },
    },
  },
};
module.exports = {
  development,
  test,
  production,
};
