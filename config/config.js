var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'production';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'backend-api'
    },
    port: process.env.PORT || 3000,
    secret : "gregsmartdoctorapp",
    db: 'mongodb://Admin:500more@ds027483.mongolab.com:27483/doctor-database'


  },

  test: {
    root: rootPath,
    app: {
      name: 'backend-api'
    },
    port: process.env.PORT || 3000,
    secret : "gregsmartdoctorapp",
    db: 'mongodb://Admin:500more@ds027483.mongolab.com:27483/doctor-database'
  },

  production: {
    root: rootPath,
    app: {
      name: 'backend-api'
    },
    port: process.env.PORT || 3000,
    secret : "gregsmartdoctorapp",
    db: 'mongodb://Admin:500more@ds027483.mongolab.com:27483/doctor-database'
  }
};

module.exports = config[env];
