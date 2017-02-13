$(function() {
	
//alert("start");
	
if (document.cookie.match(/^(.*;)?token=[^;]+(.*)?$/)) {
//alert("cookie");
    var cookie =  document.cookie.split(';');
    var token;
    //get token from cookie
    for (var i = 0;i<cookie.length; i++) {
        var name = cookie[i].split('=')[0].replace(' ','');
      if (name == "token"){
          token = cookie[i].split('=')[1];

      }
    }
    //check token avaliable
    $.post( "/profile/load",
                {'token' :token

                }
        )
        .done(function(data) {
            //get user profile by user id
          $.get("/profile/"+data._id +"/info").done(function(d){
            $("#card-prof").css("display", "block");
			
			$("#member").html('<button class="red darken-3 btn dropdown-toggle" type="button" id="dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-user"></i> '+d.username.toLowerCase()+'</button><div class="dropdown-menu dropdown-dark" aria-labelledby="dropdown" data-dropdown-in="fadeIn" data-dropdown-out="fadeOut"><a class="dropdown-item" href="/profile/">My Profile</a><hr style="margin-bottom: 0px; margin-top: 0px;"><a class="dropdown-item" id="logout" onclick="logout();">Log out</a></div>');
			$("#member").css({"transform": "translate(0px, 0%)", "position": "relative", "z-index": "9999", "font-family": "\'Open Sans\'", "color": "white"});

        });

        })
        .fail(function() {
		$("#member").css({"transform": "translate(0px, 35%)", "position": "relative", "z-index": "9999", "font-family": "\'Open Sans\'", "color": "white"});
		$("#member").html('<a class="nav-link" href="/login/" >Login</a>');
        });
}else{
//alert("no cookie");
$("#member").css({"transform": "translate(0px, 35%)", "position": "relative", "z-index": "9999", "font-family": "\'Open Sans\'", "color": "white"});
$("#member").html('<a class="nav-link" href="/login/" >Login</a>');
	
}
//alert("end");
$('[data-toggle="tooltip"]').tooltip();

});

function logout(){
		  document.cookie="token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
          //AWS
         window.location.href = "http://gamempire.net";
         //Heroku
         //window.location.href = "https://gamempire.herokuapp.com";
}


/*
$(function() {
	alert("start");
	if (sessionStorage.getItem('status') != null)){
		$("#card-prof").css("display", "block");
		$("#member").html('<a href="/profile/"><i class="fa fa-user"></i> '+d.username+'</a>');
		$("#member").css({"transform": "translate(0px, 35%)", "position": "relative", "z-index": "9999", "font-family": "\'Open Sans\'", "color": "white"});
	}else{
		$("#member").css({"transform": "translate(0px, 35%)", "position": "relative", "z-index": "9999", "font-family": "\'Open Sans\'", "color": "white"});
		$("#member").html('<a class="nav-link" href="/login/" >Login</a>');
    }
	alert("end");
});
*/