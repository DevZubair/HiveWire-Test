var express    = require('express'),
  router       = express.Router(),
  mongoose     = require('mongoose'),
  Profiles = mongoose.model('Profiles'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/retrieveContacts', function (req, res, next) {

  var  _emailAddress = req.body.emailAddress || req.query.emailAddress || req.headers['x-access-emailAddress'];

  AesEncryptDecrypt.encrypt(_emailAddress,function(userEmail){
    var _encryptEmailAddress  = userEmail.content;

    Profiles.find({ emailAddress: { $ne: _encryptEmailAddress } }, function (err,users) {
      if(err){
        res.send({
          code: 500,
          content : 'Internal Server Error',
          msg: 'API not called properly',
          token:  req.___new__token
        });
      }
      else {
        if (users.length != 0) {

          for (var i = 0; i < users.length; i++) {
            AesEncryptDecrypt.decrypt(users[i].firstName, function (firstName) {
              users[i].firstName = firstName;
              AesEncryptDecrypt.decrypt(users[i].lastName, function (lastName) {
                users[i].lastName = lastName;
                AesEncryptDecrypt.decrypt(users[i].emailAddress, function (emailAddress) {
                  users[i].emailAddress = emailAddress;
                  AesEncryptDecrypt.decrypt(users[i].hospitalName, function (hospitalName) {
                    users[i].hospitalName = hospitalName;
                    AesEncryptDecrypt.decrypt(users[i].grade, function (grade) {
                      users[i].grade = grade;
                      AesEncryptDecrypt.decrypt(users[i].speciality, function (speciality) {
                        users[i].speciality = speciality;
                        AesEncryptDecrypt.decrypt(users[i].role, function (role) {
                          users[i].role = role;
                          AesEncryptDecrypt.decrypt(users[i].gmcNumber, function (gmcNumber) {
                            users[i].gmcNumber = gmcNumber;
                            AesEncryptDecrypt.decrypt(users[i].job, function (job) {
                              users[i].job = job;
                              AesEncryptDecrypt.decrypt(users[i].ward, function (ward) {
                                users[i].ward = ward;
                                if (i == users.length - 1) {
                                  res.send({
                                    code: 200,
                                    content: users,
                                    msg: 'Users retrieved successfully',
                                    token: req.___new__token

                                  });
                                }
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          }
        }
        else{
          res.send({
            code: 200,
            content: users,
            msg: 'Users retrieved successfully',
            token: req.___new__token

          });
        }
      }
    })
  })
});
