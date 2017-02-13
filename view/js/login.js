$(function() {

  $("form[name='registration']").validate({
    rules: {
    	username:"required",
      	firstname: "required",
      	lastname: "required",
      	email: {
        	required: true,
     
        	email: true
      	},
      	password: {
        	required: true,
        	minlength:6
      	}
    },
    messages: {
    	username:"Your username is required",
      	firstname: "Your first name is required",
     	 lastname: "Your last name is required",
     	 password: {
        	required: "Your password is required",
       	 minlength: "Your password must be at least 6 characters long"
      	},
      	email: {
     	 required: "Your email is required",
     	 email:"Your email is not in format"
     	}
    },

    submitHandler: function(form) {
      $.post( "/login/add",
                {
                    "username": $( "#ru" ).val(),
                    "password": $( "#rp" ).val(),
                    "lastname": $("#rln").val(),
                    "firstname":$("#rfn").val(),
                    "birthday":$("#birth").val(),
					//"birthday":"2015-01-01",
                    "email":$("#re").val()
                }
        )
        .done(function( data ) {
		  alert("Successfully register!");
			//trigger email verification send
			//trigger pop up for user to verify email
			
		  // clears registration form and shows login screen again
		  $( "#user_id" ).val($( "#ru" ).val());
		  $('#user_id').focusin();
          $( "#ru" ).val('');
          $( "#rp" ).val('');
          $("#rln").val('');
          $("#rfn").val('');
          $("#re").val('');
		  $("#register").hide();
		  $("#loginpage").show();
        	
        })
        .fail(function() {
			$('#regmsg').html('<center>Username or email already exist</center>');
			$("#regmsg").css("padding:30px;");
			$("#regmsg").effect( "shake", { direction: "up", times: 2, distance: 50}, 1000 );
        });
    }
  });
});


//If 'enter / return' key pressed whithin 'card' div will trigger login button click 
$("#enter").keypress(function (e) {
  if(e.keyCode=='13') //Keycode for "Return"
     $('#login').click();
  });

// Login Logic.
// Checks for empty fields If either field is empty returns error.
// find API to see if user exists. If yes login, If no error.
$("#login").click(function(){
	
	var user_id = $('#user_id').val();
	var pwrd = $('#password').val();
	if (user_id==null || user_id=="" || pwrd==null || pwrd=="")
      {
		$('#loginmsg').html('<center>All fields must be filled in</center>');
		$("#loginmsg").css("padding:30px;");
		$("#loginmsg").removeClass('bg-danger').addClass('bg-warning');
		$("#loginmsg").effect( "shake", { direction: "up", times: 2, distance: 30}, 500 );
      return false;
      }

	 $.post( "/login/find",
                {
                    "username": $( "#user_id" ).val(),
                    "password": $( "#password" ).val()
                }
        )
        .done(function( data ) {
        	//alert("Successfully logged in!");
        	document.cookie="token=" + data + "; path=/;";
          $( "#user_id" ).val('');
          $( "#password" ).val('');
        	window.location.href = "/profile/";
        })
        .fail(function() {
			$('#loginmsg').html('<center>Username or password incorrect</center>');
			$("#loginmsg").css("padding:30px;");
			$("#loginmsg").removeClass('bg-warning').addClass('bg-danger');
			$("#loginmsg").effect( "shake", { direction: "up", times: 2, distance: 30}, 500 );
        });

    });

$("#signup").click(function(){
	$("#register").show();
	$("#loginpage").hide();
	$('#user_id').val('');
	$('#user_id').focusout();
	$('#password').val('');
	$('#password').focusout();
	
});

$("#back").click(function(){
	$("#register").hide();
	$("#loginpage").show();
	$('#regmsg').html('');
	$('#loginmsg').html('');
	$('#regmsg').html('');
	$('#ru').val('');
	$('#rp').val('');
	$('#rln').val('');
	$('#rfn').val('');
	$('#re').val('');
	$('#ru').focusout();
	$('#rp').focusout();
	$('#rln').focusout();
	$('#rfn').focusout();
	$('#re').focusout();
	var validator = $( "form[name='registration']" ).validate();
	validator.resetForm();
});