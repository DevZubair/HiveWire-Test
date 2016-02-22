var inputvalue = localStorage.getItem("lastLogin");
inputvalue = new Date(inputvalue);

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

    $('#lastLoginID').html(inputvalue.getDate() + '/' + (inputvalue.getMonth()+1) + '/' + inputvalue.getFullYear() + ' ' + inputvalue.getHours() + ':' + inputvalue.getMinutes() + ':' + inputvalue.getSeconds());

});

var _domain = "http://hivewire1.cloudapp.net/",
    _emailAddress = localStorage.getItem("emailAddress"),
    _token = localStorage.getItem("sessionToken"),
    newUsersArray = [];

var credentials = {
    "emailAddress" : _emailAddress,
    "token": _token,
    "lastLogin" : localStorage.getItem("lastLogin")
};

$.ajax({
    method: "POST",
    url: _domain + "checkExpiry",
    data: credentials
}).done(function(data) {
        console.log(data);
        if (data.code == 200) {
            retrieveNewContacts();
        }
        else {
            window.location = _domain + 'admin';
        }
    });

function retrieveNewContacts(){
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
        url: _domain + "retrieveNewContacts",
        data: credentials
    }).done(function(data) {
            console.log(data);
            if(data.code == 200){
                localStorage.setItem('sessionToken',data.token);
                console.log('New Users retrieved');
              newUsersArray = data.content;
                var inHTML = "",
                    newItem = '';

                $.each(newUsersArray, function(index, value){
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

