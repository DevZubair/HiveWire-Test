var express = require('express'),
  router    = express.Router(),
  mongoose = require('mongoose'),
  Profiles = mongoose.model('Profiles'),
  fs = require('fs'),
  busboy = require('connect-busboy');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/uploadImage', function (req, res, next) {

  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename);
    fstream = fs.createWriteStream("images/profile_pic/" + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
      res.redirect('back');
    });
  });
});
