localStorage.clear();
var _domain = "http://hivewire1.cloudapp.net/";

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
      console.log('Username/Password incorrect' + data.code);
    }
  });
}
document.getElementById("loginSubmit").addEventListener("click", loginSubmit, false);
