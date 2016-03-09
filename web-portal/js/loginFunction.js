localStorage.clear();
var _domain = "http://hivewiretest.azurewebsites.net/";

function loginSubmit() {
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
  });

  var url = _domain + 'admin/dashboard';
  var user_name = document.getElementById('username').value;
  var user_pass = document.getElementById('password').value;
  var dataObject = {
    "username" : user_name,
    "password" : user_pass

  };
  $.ajax({
    method: "POST",
    url: _domain + "admin/adminLogin",
    data: dataObject
  }).done(function(data) {
    console.log(data);
    if(data.code == 200){
      console.log(data);
      $.unblockUI();
      localStorage.setItem('sessionToken',data.token);
      localStorage.setItem('emailAddress',user_name);
      localStorage.setItem('lastLogin',data.last_login);

      window.location = url;
    }
    else{
      $.unblockUI();
      alert('Username/Password incorrect');
      console.log('Username/Password incorrect' + data.code);
    }
  });
}
function changePass(){
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
  });

  var url = _domain + 'admin/changePassword';
  var dataObject = {
    "emailAddress" : "admin@admin.com"
  };
  $.ajax({
    method: "POST",
    url: _domain + "admin/sendVerifyCode",
    data: dataObject
  }).done(function(data) {
    console.log(data);
    if(data.code == 200){
      console.log(data);
      $.unblockUI();
      alert('Please check your email. Verification code has been sent');
      window.location = url;
    }
    else{
      $.unblockUI();
      alert('Error in calling API!' + data.code);
    }
  });
}
document.getElementById("loginSubmit").addEventListener("click", loginSubmit, false);
document.getElementById("changePassword").addEventListener("click", changePass, false);
