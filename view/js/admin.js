$("#add").click(function(){
    $.post( "/widget/add",
                {
                    "widgetname": $( "#widget" ).val(),
                    "type": $( "#type" ).val(),
                    "initial_width":$("#iw").val(),
                    "initial_height":$("#ih").val(),
                    "min_width":$("#minw").val(),
                    "min_height":$("#minh").val(),
                    "max_width":$("#maxw").val(),
                    "max_height":$("#maxh").val(),
                    "resizeable":$("#resize").val(),
                    "draggable":$("#drag").val(),
                }
        )
        .done(function(data) {
		  console.log("Successfully register!");
        }).fail(function(res){
            console.log("something wrong");
        });
    });

$("#delete").click(function(){
    $.post( "/widget/remove",
                {
                    "_id": $( "#load option:selected" ).val()
                    
                }
        )
        .done(function(data) {
          console.log("Successfully delete!");
        }).fail(function(res){
            console.log("something wrong with delete");
        });
    });

window.onload = function() {
  $.get("/widget/show").done(function(res){
    for (var i = 0; i < res.length; i++) {
       $('select').append($('<option>', {value:res[i]._id, text:res[i].widgetname}));
    }
    
  }).fail(function(err){
    console.log("something wrong with the load widget");
  });
};
