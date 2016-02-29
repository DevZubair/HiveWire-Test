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

  }
});

function getAllRooms(){
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

  $.ajax({
    method: "POST",
    url: _domain + "admin/getAllRooms",
    data: credentials
  }).done(function(data) {
    console.log(data);
    if (data.code == 200) {
      //Token is not expired
      console.log(data);

      var csvContent = data.content;
      csvContent.forEach(function(__content__){
        //__content__.Users = "["+__content__.Users.toString()+"]/";
        __content__.ChatMessages = JSON.stringify(__content__.ChatMessages);
        var __userEmail__ = "";
        __content__.Users.forEach(function(userEmail,index){
          __userEmail__+= userEmail;

          if(__content__.Users.length-1>index){
            __userEmail__+="|";
          }
        });

        __content__.Users = __userEmail__;
      });
      var __convertCSV = ConvertToCSV(csvContent);

      function ConvertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
          var line = '';
          for (var index in array[i]) {
            if (line != '') line += ',';

            line += array[i][index];
          }

          str += line + '\r\n';
        }

        return str;
      }

      $.unblockUI();
      var blob = new Blob([["ID","ADMIN ROOM ID","ROOM NAME","CREATE DATE","USERS","CHAT MESSAGES","\r\n"],__convertCSV], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "CSV_RoomsFile.csv");

    }
    else {
      console.log('Error in fetching rooms data from db');
      $.unblockUI();
    }
  });
}
function getAllUsers() {
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

  $.ajax({
    method: "POST",
    url: _domain + "admin/getAllUsers",
    data: credentials
  }).done(function(data) {
    console.log(data);
    if (data.code == 200) {
      //Token is not expired
      console.log(data);

      var csvContent = data.content;
      var __convertCSV = ConvertToCSV(csvContent);

      function ConvertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
          var line = '';
          for (var index in array[i]) {
            if (line != '') line += ',';

            line += array[i][index];
          }

          str += line + '\r\n';
        }

        return str;
      }

      $.unblockUI();
      var blob = new Blob([["USER ID","FIRST NAME","LAST NAME","EMAIL ADDRESS","HOSPITAL NAME","GRADE","SPECIALITY","ROLE","GMC NUMBER","JOB","WARD","PROFILE PIC","UPDATED AT","\r\n"],__convertCSV], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "CSV_UsersFile.csv");

    }
    else {
      console.log('Error in fetching users data from db');
      $.unblockUI();
    }
  });

}

document.getElementById("get-message-rooms").addEventListener("click", getAllRooms, false);
document.getElementById("get-register-users").addEventListener("click", getAllUsers, false);
