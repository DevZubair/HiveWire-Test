var express = require('express'),
  router    = express.Router(),
  mongoose     = require('mongoose'),
  Profiles = mongoose.model('Profiles'),
  AesEncryptDecrypt = require('../../users-functions/aes-functions.js');

module.exports = function (app) {
  app.use('/admin', router);
};

router.post('/getAllUsers', function (req, res, next) {

  Profiles.find({},{_id:0,__v:0},
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
            AesEncryptDecrypt.decrypt(allUsers[i].firstName, function (firstName) {
              allUsers[i].firstName = firstName;
              AesEncryptDecrypt.decrypt(allUsers[i].lastName, function (lastName) {
                allUsers[i].lastName = lastName;
                AesEncryptDecrypt.decrypt(allUsers[i].emailAddress, function (emailAddress) {
                  allUsers[i].emailAddress = emailAddress;
                  AesEncryptDecrypt.decrypt(allUsers[i].hospitalName, function (hospitalName) {
                    allUsers[i].hospitalName = hospitalName;
                    AesEncryptDecrypt.decrypt(allUsers[i].grade, function (grade) {
                      allUsers[i].grade = grade;
                      AesEncryptDecrypt.decrypt(allUsers[i].speciality, function (speciality) {
                        allUsers[i].speciality = speciality;
                        AesEncryptDecrypt.decrypt(allUsers[i].role, function (role) {
                          allUsers[i].role = role;
                          AesEncryptDecrypt.decrypt(allUsers[i].gmcNumber, function (gmcNumber) {
                            allUsers[i].gmcNumber = gmcNumber;
                            AesEncryptDecrypt.decrypt(allUsers[i].job, function (job) {
                              allUsers[i].job = job;
                              AesEncryptDecrypt.decrypt(allUsers[i].ward, function (ward) {
                                allUsers[i].ward = ward;
                                if (i == allUsers.length - 1) {
                                  res.send({
                                    code: 200,
                                    content: allUsers,
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
