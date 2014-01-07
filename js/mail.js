
$(document).ready( function() {

	$("#formulaire").submit(function(){
	var datastring = $("#formulaire").serialize();
			    $.ajax({ 
						 type: "POST", 
						 data: datastring, 
						 url: "php/mail.php", 
						 success: function(data, textStatus, jqXHR) { 
						 	alert("Votre email a bien été envoyé");
						 }, 
						 error : function(jqXHR, textStatus, errorThrown) { 
						 alert(textStatus + " " + errorThrown) ; 
						 } 
						});
	});
});
