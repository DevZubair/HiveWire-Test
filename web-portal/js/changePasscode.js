localStorage.clear();
var _domain = "http://hivewiretest.azurewebsites.net/";

function changePassSubmit() {
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

  var url = _domain + 'admin';
  var new_pass = document.getElementById('newPassword').value;
  var confirm_pass = document.getElementById('confirmPassword').value;
  var verify_code = document.getElementById('passcode').value;
  var dataObject = {
    "emailAddress" : 'admin@admin.com',
    "password" : new_pass,
    "verificationCode" : verify_code
  };

  if(new_pass === confirm_pass){
    $.ajax({
      method: "POST",
      url: _domain + "admin/adminChangePass",
      data: dataObject
    }).done(function(data) {
      console.log(data);
      if(data.code == 200){
        console.log(data);
        $.unblockUI();
        alert('Password Changed Successfully!');
        window.location = url;
      }
      else{
        $.unblockUI();
        alert('Error! Verification Code Error!');
        console.log('Verification Code Error');
      }
    });
  }
  else{
    alert('Error! Confirm Password mismatch')
  }

}
document.getElementById("changeSubmit").addEventListener("click", changePassSubmit, false);
