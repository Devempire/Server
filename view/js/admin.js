$("#ok").click(function(){
    $.post( "/widget/add",
                {
                    "widgetname": $( "#widget" ).val(),
                    "type": $( "#type" ).val(),
                    "size": $("#size").val(),
                    "resizeable":$("#resize").val(),
                    "draggable":$("#drag").val(),
                }
        )
        .done(function( data ) {
		  console.log("Successfully register!");
        }).fail(function(res){
            console.log("something wrong");
        });
    });