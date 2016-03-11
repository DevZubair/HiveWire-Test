var express = require('express'),
  router    = express.Router(),
  mongoose     = require('mongoose'),
  Registration = mongoose.model('Registration'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/admin', router);
};

router.post('/getAllUsersCode', function (req, res, next) {

  Registration.find({},{_id:0,__v:0,firstName:0,lastName:0,pinCode:0,sessionToken:0},
    function(err,allUsers) {

      if(err){
        res.send({
          code: 500,
          content : 'Internal Server Error',
          msg: 'API not called properly',
          token:  req.___new__token
        });
      }
      else if(allUsers!=null){
        for(var i=0;i<allUsers.length;i++){
          if(allUsers[i].emailAddress != "admin@admin.com") {

            AesEncryptDecrypt.decrypt(allUsers[i].emailAddress, function (emailAddress) {
              allUsers[i].emailAddress = emailAddress;

              if (i == allUsers.length - 1) {
                res.send({
                  code: 200,
                  content: allUsers,
                  msg: 'Users Code retrieved successfully',
                  token: req.___new__token
                });
              }
            });
          }
        }
      }
      else {
        res.send({
          code: 404,
          content: 'Not Found',
          msg: 'No User found',
          token:  req.___new__token
        });
      }
    })
});
