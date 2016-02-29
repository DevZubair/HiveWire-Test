$(document).ready(function() {

  $.blockUI({ css: {
    border: 'none',
    padding: '15px',
    backgroundColor: '#000',
    '-webkit-border-radius': '10px',
    '-moz-border-radius': '10px',
    opacity: .5,
    color: '#fff'
  } });
  var inputvalue = localStorage.getItem("lastLogin");
  inputvalue = new Date(inputvalue);
  $('#lastLoginID').html(inputvalue.getDate() + '/' + (inputvalue.getMonth()+1) + '/' + inputvalue.getFullYear() + ' ' + inputvalue.getHours() + ':' + inputvalue.getMinutes() + ':' + inputvalue.getSeconds());

});

var _domain = "http://hivewiretest.azurewebsites.net/",
  _emailAddress = localStorage.getItem("emailAddress"),
  _token = localStorage.getItem("sessionToken");

var credentials = {
  "emailAddress" : _emailAddress,
  "token": _token
};

$.ajax({
  method: "POST",
  url: _domain + "checkExpiry",
  data: credentials
}).done(function(data) {
  console.log(data);
  if (data.code == 200) {
    //Token is not expired
    $.unblockUI();
  }
  else {
    window.location = _domain + 'admin';
    $.unblockUI();
  }
});
var socket = io.connect(_domain);
console.log('Connected with socket');
function sendMessage() {

  var admin_message = document.getElementById('message-textarea').value,
    _emailAddress = localStorage.getItem("emailAddress");

  var dataObject = {
    "emailAddress" : _emailAddress,
    "message" : admin_message,
    "token": _token

  };

  $.ajax({
    method: "POST",
    url: _domain + "admin/sendMessageAll",
    data: dataObject
  }).done(function(data) {
    console.log(data);
    if(data.code == 200){
      $.unblockUI();
//socket emitting method
      socket.emit('adminMessage',{
        admin_message: admin_message,
        emailAddress: _emailAddress,
        dateTime: new Date(),
        messageID : data.messageID
      });
      document.getElementById('message-textarea').value = '';
      console.log('Message is sent to all users');
      localStorage.setItem('sessionToken',data.token);
    }
    else{
      console.log('Room not found, message error' + data.code);
      localStorage.setItem('sessionToken',data.token);
      $.unblockUI();
    }
  });
}
document.getElementById("message-submit").addEventListener("click", sendMessage, false);
