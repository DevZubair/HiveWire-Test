var express        = require('express'),
  glob           = require('glob'),
  app            = express(),
  favicon        = require('serve-favicon'),
  logger         = require('morgan'),
  cookieParser   = require('cookie-parser'),
  bodyParser     = require('body-parser'),
  compress       = require('compression'),
  methodOverride = require('method-override'),
//   http           = require('http').Server(app),
//  io             = require('socket.io')(http),
// fs             = require('fs'),
  busboy         = require('connect-busboy');

module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'production';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'production';

  app.use(logger('dev'));
  app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
  });
  app.use(busboy());                  //use for file uploading
  app.use(bodyParser.json());         //use for JSON form data uploading
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static('images'));
  app.use('/admin',express.static('web-portal'));
  app.use(methodOverride());
  var controllers27 = glob.sync(config.root + '/app/controllers/AdminAPIs/adminLoginAPI.js');

  controllers27.forEach(function (controller) {
    require(controller)(app);
  });

  var controllers31 = glob.sync(config.root + '/app/controllers/AdminAPIs/adminSuspendUser.js');

  controllers31.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers43 = glob.sync(config.root + '/app/controllers/AdminAPIs/adminOtherUsers.js');

  controllers43.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers35 = glob.sync(config.root + '/app/controllers/AdminAPIs/adminReinstateUser.js');

  controllers35.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers38 = glob.sync(config.root + '/app/controllers/AdminAPIs/adminNewUsers.js');

  controllers38.forEach(function (controller) {
    require(controller)(app);
  });

  var controllers26 = glob.sync(config.root + '/app/controllers/AdminAPIs/adminDashboard.js');

  controllers26.forEach(function (controller) {
    require(controller)(app);
  });

  var controllers28 = glob.sync(config.root + '/app/controllers/AdminAPIs/adminMessageAll.js');

  controllers28.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers21 = glob.sync(config.root + '/app/controllers/UsersAPIs/getProfileImageAPI.js');

  controllers21.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers24 = glob.sync(config.root + '/app/controllers/UsersAPIs/getRoomImageAPI.js');

  controllers24.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers25 = glob.sync(config.root + '/app/controllers/UsersAPIs/checkTokenExpiryAPI.js');

  controllers25.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers17 = glob.sync(config.root + '/app/controllers/socketConnectionAPI.js');

  controllers17.forEach(function (controller) {
    require(controller)(app);
  });

  var controllers1 = glob.sync(config.root + '/app/controllers/UsersAPIs/registrationAPI.js');

  controllers1.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers2 = glob.sync(config.root + '/app/controllers/UsersAPIs/authVerificationCodeAPI.js');

  controllers2.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers3 = glob.sync(config.root + '/app/controllers/UsersAPIs/verifyEmailAgainAPI.js');

  controllers3.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers4 = glob.sync(config.root + '/app/controllers/UsersAPIs/setPinCodeAPI.js');

  controllers4.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers5 = glob.sync(config.root + '/app/controllers/UsersAPIs/forgotPinAPI.js');

  controllers5.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers6 = glob.sync(config.root + '/app/controllers/UsersAPIs/loginAuthAPI.js');

  controllers6.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers8 = glob.sync(config.root + '/app/controllers/UsersAPIs/home.js');

  controllers8.forEach(function (controller) {
    require(controller)(app);
  });

  var controllers23 = glob.sync(config.root + '/app/controllers/UsersAPIs/getGroupIconAPI.js');

  controllers23.forEach(function (controller) {
    require(controller)(app);
  });

  var controllers7 = glob.sync(config.root + '/app/controllers/UsersAPIs/checkSessionTokenAPI.js');

  controllers7.forEach(function (controller) {
    require(controller)(app);
  });

  var controllers36 = glob.sync(config.root + '/app/controllers/UsersAPIs/updateDeviceIdAPI.js');

  controllers36.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers41 = glob.sync(config.root + '/app/controllers/UsersAPIs/getEmailContactsAPI.js');

  controllers41.forEach(function (controller) {
    require(controller)(app);
  });

  var controllers9 = glob.sync(config.root + '/app/controllers/UsersAPIs/uploadProfileImageAPI.js');

  controllers9.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers10 = glob.sync(config.root + '/app/controllers/UsersAPIs/createProfileAPI.js');

  controllers10.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers11 = glob.sync(config.root + '/app/controllers/UsersAPIs/getProfileAPI.js');

  controllers11.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers12 = glob.sync(config.root + '/app/controllers/UsersAPIs/retrieveContactsAPI.js');

  controllers12.forEach(function (controller) {
    require(controller)(app);
  });

  var controllers13 = glob.sync(config.root + '/app/controllers/UsersAPIs/createConversationRoomAPI.js');

  controllers13.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers14 = glob.sync(config.root + '/app/controllers/UsersAPIs/getConversationRoomAPI.js');

  controllers14.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers15 = glob.sync(config.root + '/app/controllers/UsersAPIs/getMessageHeadersAPI.js');

  controllers15.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers42 = glob.sync(config.root + '/app/controllers/UsersAPIs/getAllMessagesAPI.js');

  controllers42.forEach(function (controller) {
    require(controller)(app);
  });

  var controllers19 = glob.sync(config.root + '/app/controllers/UsersAPIs/uploadRoomImageAPI.js');

  controllers19.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers20 = glob.sync(config.root + '/app/controllers/UsersAPIs/getConversationGroupsAPI.js');

  controllers20.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers22 = glob.sync(config.root + '/app/controllers/UsersAPIs/updateGroupUsersAPI.js');

  controllers22.forEach(function (controller) {
    require(controller)(app);
  });

  var controllers30 = glob.sync(config.root + '/app/controllers/AdminAPIs/suspendAccountAPI.js');

  controllers30.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers34 = glob.sync(config.root + '/app/controllers/AdminAPIs/reinstateAccountAPI.js');

  controllers34.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers37 = glob.sync(config.root + '/app/controllers/AdminAPIs/retrieveNewUsersAPI.js');

  controllers37.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers39 = glob.sync(config.root + '/app/controllers/AdminAPIs/retrieveAllMessagesAPI.js');

  controllers39.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers40 = glob.sync(config.root + '/app/controllers/AdminAPIs/retrieveAllUsersAPI.js');

  controllers40.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers33 = glob.sync(config.root + '/app/controllers/AdminAPIs/retrieveBlockedAccountsAPI.js');

  controllers33.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers32 = glob.sync(config.root + '/app/controllers/AdminAPIs/retrieveUnblockAccountsAPI.js');

  controllers32.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers29 = glob.sync(config.root + '/app/controllers/AdminAPIs/sendMessageAPI.js');

  controllers29.forEach(function (controller) {
    require(controller)(app);
  });
  var controllers44 = glob.sync(config.root + '/app/controllers/AdminAPIs/retrieveOtherUsersAPI.js');

  controllers44.forEach(function (controller) {
    require(controller)(app);
  });


  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.send(err);
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
  });
};
