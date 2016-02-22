//Encryption and Decryption Code
var crypto = require('crypto'),
  algorithm = 'aes-256-gcm',
  password = '3zTvzr3p67VC61jmV54rIYu1545x4TlY',
  iv = '60iP0h6vJoEa';

exports.encrypt = function(text) {
  var cipher = crypto.createCipheriv(algorithm, password, iv);
  var encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  var tag = cipher.getAuthTag();
  return {
    content: encrypted,
    tag: tag
  };
};

exports.decrypt = function(encrypted) {
  var decipher = crypto.createDecipheriv(algorithm, password, iv);
  decipher.setAuthTag(encrypted.tag);
  var dec = decipher.update(encrypted.content, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};
