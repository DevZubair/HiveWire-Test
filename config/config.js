var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'production';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'backend-api'
    },
    port: process.env.PORT || 80,
    secret : "gregsmartdoctorapp",
    db: 'mongodb://Admin:500more@localhost:27017/hospital-database'

  },

  test: {
    root: rootPath,
    app: {
      name: 'backend-api'
    },
    port: process.env.PORT || 80,
    secret : "gregsmartdoctorapp",
    db: 'mongodb://Admin:500more@localhost:27017/hospital-database'
  },

  production: {
    root: rootPath,
    app: {
      name: 'backend-api'
    },
    port: process.env.PORT || 80,
    secret : "gregsmartdoctorapp",
    db: 'mongodb://Admin:500more@localhost:27017/hospital-database'
  }
};

module.exports = config[env];
