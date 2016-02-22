var mongoose     = require('mongoose'),
  Registration = mongoose.model('Registration'),
  jwt          = require('jsonwebtoken'),
  AesEncryptDecrypt = require('../users-functions/aes-functions.js');

exports.checkExpiryToken = function (userEmail,token,callBack) {

// decode token
  if (token && userEmail) {
    if(userEmail == "admin@admin.com"){

      Registration.findOne({emailAddress : userEmail , sessionToken:token}, function (err,user) {
        if(err){
          console.log(err);
        }
        else if(user!=null){
          if(user._doc.block == false){
            jwt.verify(token, "gregsmartdoctorapp", function(err, decoded) {
              if (err) {
                var tokensError = "Token Expired";
                callBack(tokensError);
              } else {
                var myDate = '';
                if(decoded[0] !=undefined){
                  myDate = new Date(decoded[0].__timeStamp);
                }
                else{
                  myDate = new Date(decoded.__timeStamp);
                }
                // myDate.setMinutes(myDate.getMinutes());
                var secondsDiff = new Date().getTime() - myDate.getTime();
                var Seconds_from_T1_to_T2 = secondsDiff / 1000;
                var Minutes_Between_Dates = Math.floor(Seconds_from_T1_to_T2)/60;

                if (Seconds_from_T1_to_T2 >= 0 && Minutes_Between_Dates <= 170) {
                  callBack(token);
                }
                else if(Minutes_Between_Dates >= 180){
                  var tokenError = "Token Expired";
                  callBack(tokenError);
                }
                else {
                  // issue a new token
                  delete user._doc.sessionToken;
                  user._doc.__timeStamp = new Date();
                  var refreshed_token = jwt.sign(user, "gregsmartdoctorapp", {expiresInMinutes: 180});
                //  req.___new__token = refreshed_token;
                  Registration.update({"emailAddress": userEmail}, {

                    "sessionToken": refreshed_token

                  }, function () {
                    callBack(refreshed_token);
                  });
                }
              }
            });
          }
          else{
            console.log('Account blocked');
          }
        }
        else{
          console.log("Email and token mismatch");
        }
      });
    }
    else{

      AesEncryptDecrypt.encrypt(userEmail,function(Email) {
        var _encryptEmailAddress = Email.content;

        Registration.findOne({emailAddress : _encryptEmailAddress , sessionToken:token}, function (err,user) {
          if(err){
            console.log(err);
          }
          else if(user!=null){
            if(user._doc.block == false){
              jwt.verify(token, "gregsmartdoctorapp", function(err, decoded) {
                if (err) {
                  var tokensError = "Token Expired";
                  callBack(tokensError);
                } else {
                  var myDate = '';
                  if(decoded[0] !=undefined){
                    myDate = new Date(decoded[0].__timeStamp);
                  }
                  else{
                    myDate = new Date(decoded.__timeStamp);
                  }
                  // myDate.setMinutes(myDate.getMinutes());
                  var secondsDiff = new Date().getTime() - myDate.getTime();
                  var Seconds_from_T1_to_T2 = secondsDiff / 1000;
                  var Minutes_Between_Dates = Math.floor(Seconds_from_T1_to_T2)/60;

                  if (Seconds_from_T1_to_T2 >= 0 && Minutes_Between_Dates <= 170) {
                    callBack(token);
                  }
                  else if(Minutes_Between_Dates >= 180){
                    var tokenError = "Token Expired";
                    callBack(tokenError);
                  }
                  else {
                    // issue a new token
                    delete user._doc.sessionToken;
                    user._doc.__timeStamp = new Date();
                    var refreshed_token = jwt.sign(user, "gregsmartdoctorapp", {expiresInMinutes: 180});
                   // req.___new__token = refreshed_token;
                    Registration.update({"emailAddress": _encryptEmailAddress}, {

                      "sessionToken": refreshed_token

                    }, function () {
                      callBack(refreshed_token);
                    });
                  }
                }
              });
            }
            else{
              console.log('Account blocked');
              var tokensErrorBlock = "Token Expired";
              callBack(tokensErrorBlock);
            }
          }
          else{
            console.log("Email and token mismatch");
            var tokensErrorMismatch = "Token Expired";
            callBack(tokensErrorMismatch);
          }
        });
      })
    }
  }
  else {
    console.log('Missing token');
    var tokensErrorMissing = "Token Expired";
    callBack(tokensErrorMissing);
  }
};
