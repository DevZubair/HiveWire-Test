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
  $('#lastLoginID').html(inputvalue.getDate() + '/' + (inputvalue.getMonth()+1)+ '/' + inputvalue.getFullYear() + ' ' + inputvalue.getHours() + ':' + inputvalue.getMinutes() + ':' + inputvalue.getSeconds());

});

var _domain = "http://hivewiretest.azurewebsites.net/",
  _emailAddress = localStorage.getItem("emailAddress"),
  _token = localStorage.getItem("sessionToken"),
  usersArray = [];

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
    retrieveContactsCode();

  }
  else {
    window.location = _domain + 'admin';
  }
});

function retrieveContactsCode(){
  $.blockUI({ css: {
    border: 'none',
    padding: '15px',
    backgroundColor: '#000',
    '-webkit-border-radius': '10px',
    '-moz-border-radius': '10px',
    opacity: .5,
    color: '#fff'
  } });
  $("ol#listOfUsers").html('');
  $.ajax({
    method: "POST",
    url: _domain + "admin/getAllUsersCode",
    data: credentials
  }).done(function(data) {
    console.log(data);
    if(data.code == 200){
      localStorage.setItem('sessionToken',data.token);
      console.log('Users Code retrieved');
      usersArray = data.content;
      var inHTML = "",
        newItem = '';

      $.each(usersArray, function(index, value){
        newItem = "<li><a>"+ value.emailAddress + ' ' + "<br>" + "code = " + value.verificationCode +"</a></li>";
        inHTML += newItem;
      });
      $.unblockUI();
      $("ol#listOfUsers").html(inHTML);
    }
    else{
      localStorage.setItem('sessionToken',data.token);
      console.log('Users code are not retrieved');
      $.unblockUI();
    }
  });
}
document.getElementById("refreshContacts").addEventListener("click", retrieveContactsCode, false);
