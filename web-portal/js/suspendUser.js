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

    retrieveContacts();

  }
  else {
    window.location = _domain + 'admin';
  }
});

function retrieveContacts(){
  $.blockUI({ css: {
    border: 'none',
    padding: '15px',
    backgroundColor: '#000',
    '-webkit-border-radius': '10px',
    '-moz-border-radius': '10px',
    opacity: .5,
    color: '#fff'
  } });
  //loader call
  $("ol#listOfUsers").html('');
  $.ajax({
    method: "POST",
    url: _domain + "retrieveUnblockContacts",
    data: credentials
  }).done(function(data) {
    console.log(data);
    if(data.code == 200){
      localStorage.setItem('sessionToken',data.token);
      console.log('User retrieved');
      usersArray = data.content;
      var inHTML = "",
        newItem = '';

      $.each(usersArray, function(index, value){
        newItem = "<li><a>"+ value.emailAddress + "</a></li>";
        inHTML += newItem;
      });
      $.unblockUI();
      $("ol#listOfUsers").html(inHTML);
    }
    else{
      localStorage.setItem('sessionToken',data.token);
      console.log('User are not retrieved');
      $.unblockUI();
    }
  });
}

function suspendUser(index) {

  var _blockingEmail = usersArray[index].emailAddress;

  var dataObject = {
    "emailAddress" : _emailAddress,
    "token": _token,
    "blockUserEmail" : _blockingEmail
  };

  $.ajax({
    method: "POST",
    url: _domain + "admin/suspendAccount",
    data: dataObject
  }).done(function(data) {
    console.log(data);
    if(data.code == 200){
      retrieveContacts();
      localStorage.setItem('sessionToken',data.token);
      console.log('User is blocked');
    }
    else{
      retrieveContacts();
      localStorage.setItem('sessionToken',data.token);
      console.log('User is not blocked');
    }
  });
}

document.getElementById("refreshContacts").addEventListener("click", retrieveContacts, false);

$("#listOfUsers").on("click", "li", function() {
  var indexOfUser =  $(this).index();
  $(function() {
    $( "#dialog-confirm" ).dialog({
      resizable: false,
      modal: true,
      buttons: {
        "Block": function() {
          suspendUser(indexOfUser);
          $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });
  });
});


