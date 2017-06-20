$("#add").click(function(){

    $.post( "/widget/add",
                {
                    "widgetname": $( "#widget" ).val(),
                    "widgettype": JSON.stringify($( "#type" ).val()),
                    "w":$("#iw").val(),
                    "h":$("#ih").val(),
                    "x":$("#x").val(),
                    "y":$("#y").val(),
                    "minW":$("#minw").val(),
                    "minH":$("#minh").val(),
                    "maxW":$("#maxw").val(),
                    "maxH":$("#maxh").val(),
                    "resizeable":$("#resize").val(),
                    "draggable":$("#drag").val(),
                }
        )
        .done(function(data) {
            console.log(JSON.stringify($( "#type" ).val()));
		  console.log("Successfully register!");

        }).fail(function(res){
            console.log("something wrong");
        });
    });

$("#addC").click(function(){
    $.post( "/widget/addC",
                {
                    "name": $("#Cname").val(),
                    "detail":$("#detail").val()
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
       $('#load').append($('<option>', {value:res[i]._id, text:res[i].widgetname}));
    }
    
  }).fail(function(err){
    console.log("something wrong with the load widget");
  });

   $.get("/widget/showCategory").done(function(res){
    for (var i = 0; i < res.length; i++) {
       $('#type').append($('<option>', {value:res[i]._id, text:res[i].Name}));
    }
    
  }).fail(function(err){
    console.log("something wrong with the load Category");
  });

   

};
