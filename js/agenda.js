function initialiserAgenda() {
	// Création du "tableau" des heures
	var agenda = document.getElementById('agenda') ;

	// Ligne de titres
	var ligne = document.createElement("div") ;
	ligne.className = "ligne" ;

	// Cellule en haut à gauche (vide)
	var cellule = document.createElement("div") ;
	cellule.className = "cellule nepasafficher" ;
	ligne.appendChild(cellule) ;
	for (var numDay = 1 ; numDay <= 31; numDay++) {
		cellule = document.createElement("div") ;
		cellule.className = "enteteColonne" ;
		cellule.id = "jour" + numDay ;
		cellule.innerHTML = numDay;
		cellule.addEventListener("mouseenter", coloriserColonne, false);
		cellule.addEventListener("mouseleave", decoloriserColonne, false);
		ligne.appendChild(cellule) ;
	}
	agenda.appendChild(ligne) ;

	for (var numHour = 0; numHour<=23; numHour++) {
		ligne = document.createElement("div") ;
		ligne.className = "ligne" ;
		ligne.id = "ligne_heure" + numHour ;
		
		cellule = document.createElement("div") ;
		cellule.className = "enteteLigne" ;
		cellule.id = "heure" + numHour ;
		cellule.innerHTML = "de " + (numHour < 10 ? "0" : "") + numHour + ":00" + " à " + (numHour < 10 ? "0" : "") + (numHour) + ":59";
		cellule.addEventListener("mouseenter", coloriserLigne, false);
		cellule.addEventListener("mouseleave", decoloriserLigne, false);
		ligne.appendChild(cellule) ;
		
		for (var numDay = 1 ; numDay <= 31; numDay++) {
			cellule = document.createElement("div") ;
			cellule.className = "cellule" ;
			cellule.setAttribute("jour", numDay) ;
			cellule.setAttribute("heure", numHour) ;
			cellule.id = "heure" + numHour + "_jour" + numDay ;
			cellule.innerHTML = "&nbsp;";
			//cellule.addEventListener("mouseup", creerRdv, false);
			ligne.appendChild(cellule) ;
		}
		agenda.appendChild(ligne) ;
	}
	
	// Variables globales
	idIntervenant = "anthony.grassano@iut2.upmf-grenoble.fr" ;
	var dateCourante = new Date(); 
	annee = dateCourante.getFullYear() ;
	mois = dateCourante.getMonth() + 1 ;
	jour = 0 ;
	heure = 0 ;
	heureMinTravaille = 12;
	heureMaxTravaille = 12;

	document.getElementById("wait").style.display = "none";
	document.getElementById("calendar").style.display = "block";

	$("#nextMonth").mouseup(function(){
		mois = mois +1;
		// test de dépassement
		if(mois>12){
			mois = 1;
			annee = annee +1;
		}
		$("[activite=travail]").empty(); // On vide les rendez-vous du mois precedent
		$("[cache=true]").show(); // on affiche toutes les cellules qui étaient cachées
		$("[cache=true]").removeAttr("cache"); // on supprime l'attribut qui permettait de les différencier
		mettreAJourAgenda();
	})
	$("#previousMonth").mouseup(function(){
		mois = mois -1;
		// test de dépassement
		if(mois<1){
			mois = 12;
			annee = annee -1;
		}
		$("[activite=travail]").empty();
		$("[cache=true]").show();
		$("[cache=true]").removeAttr("cache");
		mettreAJourAgenda();
	})
	
	// Remplir l'agenda
	mettreAJourAgenda() ;


}

// ----------------------------------------------------------------------------------------------------------------------
// Réinitialise l'agenda
// Appel au serveur pour récupérer les propriétés des jours du mois et les rendez-vous
// ----------------------------------------------------------------------------------------------------------------------
function mettreAJourAgenda() {
    var datastring = "idIntervenant=" + idIntervenant + "&annee=" + annee + "&mois=" + mois ; 
    $.ajax({ 

			 type: "POST", 
			 crossDomain : true, 
			 dataType: 'jsonp', 
			 data: datastring, 
			 jsonpCallback : 'traiterJsonAgenda', 
			 url: "http://sil2.ouvaton.org/agenda/ajax/getListCalendars.php", 
			 success: function(data, textStatus, jqXHR) { 
			 }, 
			 error : function(jqXHR, textStatus, errorThrown) { 
			 alert(textStatus + " " + errorThrown) ; 
			 } 
		});
}

/* ----------------------------------------------------------------------------------------------------------------------
   Traite le json reçu du serveur, qui contient le nom de la personne, ses horaires de travail, ses rendez-vous...
   ---------------------------------------------------------------------------------------------------------------------- */
function traiterJsonAgenda(data) {
	listRdv = data.data.rendezvous;
	if (data.erreur) {
		alert(data.message) ;
	} else {
		// Fonctions de mise a jour
		MaJTitre(data.data);
		MaJColonne(data.data.agenda.length+1);
		MaJRepos(data.data.agenda);
		MaJRDV(listRdv);
		MaJWeekendEtFerie(data.data.agenda);
		JourCourant();

	}

}

/* ----------------------------------------------------------------------------------------------------------------------
   Colorise toutes les cellules d'une colonne (rollover sur entête de colonne)
   ---------------------------------------------------------------------------------------------------------------------- */
function coloriserColonne(event) {
		// On récupère le numéro du jour en splittant l'id de l'evement
		var numJour = event.currentTarget.id.split("jour")[1];
		// On ajoute l'attribut a tous les element qui ont l'attribut du jour
		$("[jour=" + numJour + "]").attr("coloriage","hover");


}

/* ----------------------------------------------------------------------------------------------------------------------
   décolorise toutes les cellules d'une colonne (rollover sur entête de colonne)
   ---------------------------------------------------------------------------------------------------------------------- */
function decoloriserColonne(event) {

		// On récupère le numéro du jour en splittant l'id de l'evement
		var numJour = event.currentTarget.id.split("jour")[1];
		// On supprime l'attribut a tous les element qui ont l'attribut du jour
		$("[jour=" + numJour + "]").removeAttr("coloriage");


}

/* ----------------------------------------------------------------------------------------------------------------------
   Colorise toutes les cellules d'une ligne (rollover sur entête de ligne)
   ---------------------------------------------------------------------------------------------------------------------- */
function coloriserLigne(event) {
		// On récupère le numéro du jour en splittant l'id de l'evement
		var numHeure = event.currentTarget.id.split("heure")[1];
		// On ajoute l'attribut a tous les element qui ont l'attribut du jour
		$("[heure=" + numHeure + "]").attr("coloriage","hover");
	
}

/* ----------------------------------------------------------------------------------------------------------------------
   décolorise toutes les cellules d'une ligne (rollover sur entête de ligne)
   ---------------------------------------------------------------------------------------------------------------------- */
function decoloriserLigne(event) {
		// On récupère le numéro du jour en splittant l'id de l'evement
		var numHeure = event.currentTarget.id.split("heure")[1];
		// On supprime l'attribut a tous les element qui ont l'attribut du jour
		$("[heure=" + numHeure + "]").removeAttr("coloriage");

}

/* ----------------------------------------------------------------------------------------------------------------------
   Ouvre la fenêtre de création d'un nouveau rendez-vous
   ---------------------------------------------------------------------------------------------------------------------- */
function creerRdv(event) {
	// On crée les variables gràce aux données déja affichés
	var annee = $("#dateAffichee").text().split("/")[1];
	var mois = $("#dateAffichee").text().split("/")[0];
	// On se sert des attributs pour le reste des variables
	var jour =  event.currentTarget.getAttribute("jour");
	var heureDebut = event.currentTarget.getAttribute("heure");

	// un nombre en dessous de 10 est composé d'un caractère. Ici on ajoute le 0 pour faire deux caractères.
	// Formatage obligatoire pour les input de type time et pour l'envoi au serveur
	if(jour.length == 1) jour = "0" + jour;
	if(heureDebut.length == 1) heureDebut = "0" + heureDebut;


	var date = annee + "-" + mois + "-" + jour;

	$("#rendezvous input").val("");
    $("#date").val(date);
    $("#date").datepicker({ dateFormat: "yy-mm-dd" });
    
    $("#debut").val(heureDebut + ":00");
    $("#fin").val(heureDebut + ":59");

    $("#idIntervenant").val(idIntervenant);
	$("#rendezvous").removeAttr("title");
    $("#rendezvous").attr("title","Nouveau rendez-vous");

    $("#rendezvous").dialog({
      autoOpen: false,
      height: 400,
      width: 350,
      modal: true,
      buttons: {
      	"Creer rendez vous" :{
      	click : function() {
      		var datastring = $("#formRdv").serialize();
		    $.ajax({ 

					 type: "POST", 
					 crossDomain : true, 
					 dataType: 'jsonp', 
					 data: datastring, 
					 url: "http://sil2.ouvaton.org/agenda/ajax/insertNewEvent.php", 
					});
          	$( this ).dialog( "close" );
       	 },
       	 text : "Creer un nouveau rendez-vous",
       	 id : "submitRDV",

    	}} 
	});


     $( "#rendezvous" ).dialog( "open" );



}


/* ----------------------------------------------------------------------------------------------------------------------
   Affichage du nouveau rendez-vous
   ---------------------------------------------------------------------------------------------------------------------- */
function afficherNouveauRDV(element) {
	$("#rendezvous").dialog('close');
	var date = element.newEvent.date;
	var endTime = element.newEvent.endTime;
	var startTime = element.newEvent.startTime;

	var moisAnnee = date.split("-")[1] + "/" + date.split("-")[0];
	if(moisAnnee == $("#dateAffichee").text()){
		startTime = parseInt(startTime.split(":")[0]);
		endTime = parseInt(endTime.split(":")[0]) + 1;

		for(var i = startTime; i<endTime;i++){
			var id="heure" + i + "_jour" + parseInt(date.split("-")[2]);
			console.log(id);
			$("#" + id).removeAttr("activite");
			$("#" + id).attr("activite","travail");
			$("#" + id).unbind("click");
			var img = document.createElement("img");
			img.src="img/icone-rendezvous.png";
			$("#" + id).empty();
			$("#" + id).append(img);
			$("#" + id).attr("idMeeting", element.newEvent.idMeeting);
			$("#" + id).click(afficherRDV);
		}
	}

}


/* ----------------------------------------------------------------------------------------------------------------------
   Affichage du nouveau rendez-vous
   ---------------------------------------------------------------------------------------------------------------------- */
function afficherRDV(event) {
	var idMeeting = event.currentTarget.getAttribute("idMeeting");

	// On recherche dans notre liste de RDV celui qui correspond à l'idMeeting puis on met a jour les champs correspondants
	for(var meeting = 0; meeting< listRdv.length ; meeting++){

		if(listRdv[meeting].idMeeting == idMeeting){
			$("#name").val(listRdv[meeting].identity);
			$("#mail").val(listRdv[meeting].mail);
			$("#object").val(listRdv[meeting].object);
			$("#date").val(listRdv[meeting].date);
			$("#tel").val(listRdv[meeting].phone);
			$("#debut").val(listRdv[meeting].startTime);
			$("#fin").val(listRdv[meeting].endTime);

		}
	}


    $("#formRdv input").attr("readonly","true");
    $("#rendezvous").removeAttr("title");
    $("#rendezvous").attr("title","Rendez-vous");
    
      $("#rendezvous").dialog({
      autoOpen: false,
      height: 400,
      width: 350,
      modal: true,
      buttons: {
      	"Creer rendez vous" :{
	      	click : function() {
	      		var datastring = $("#formRdv").serialize();
			    $.ajax({ 

						 type: "POST", 
						 crossDomain : true, 
						 dataType: 'jsonp', 
						 data: datastring, 
						 url: "http://sil2.ouvaton.org/agenda/ajax/insertNewEvent.php", 
						});
	          	$( this ).dialog( "close" );
	       	 },
	       	 text : "Creer un nouveau rendez-vous",
	       	 id : "submitRDV",

	    	}},
	    close : function(){
	    	$("#formRdv input").removeAttr("readonly");
	    },

	});

    $( "#rendezvous" ).dialog( "open" );
	$("#submitRDV").hide();

}
//nb correspond a data.data.agenda.length+1
function MaJColonne(nb){
	// boucle qui commence au dernier jour trouvé jusqu'au jour 31 et les supprimes
	for(var i=nb;i<=31;i++){
		var id="jour"+i;
		$("[jour=" + i + "]").hide();
		$("[jour=" + i + "]").attr("cache","true");
		$("#jour" + i).hide();
		$("#jour" + i).attr("cache","true");
	}		
}

//pour supprimer les ligne ou il n'y a aucune heure travaillé
function MaJLigne(){

	for(var i=0;i<heureMinTravaille;i++){
		var id=i;
		$("[heure=" + i + "]").hide();
		$("[heure=" + i + "]").attr("cache","true");
		$("[heure=" + i + "]").css("height","0");
		$("#heure" + i).hide();
		$("#heure" + i).attr("cache","true");
		$("#ligne_heure" + i).attr("cache","true");

	}

	for(var i=heureMaxTravaille;i<24;i++){
		var id=i;
		$("[heure=" + i + "]").hide();
		$("[heure=" + i + "]").attr("cache","true");
		$("#heure" + i).hide();
		$("#heure" + i).attr("cache","true");
		$("#ligne_heure" + i).attr("cache","true");
	}			
}

function MaJRepos(data){
	// On boucle sur tous les jours
for(var i=0; i<(data.length);i++){
	// On déclare nos variables en récupérant le début de l'heure

		// Si un jour existe les variables sont définis
		if((data[i].matin_de && data[i].matin_a) || (data[i].aprem_de && data[i].aprem_a)){

				// On déclare nos variables en récupérant le début de l'heure
				var matinDe = parseInt(data[i].matin_de.split(':')[0]);
				var matinA = parseInt(data[i].matin_a.split(':')[0]);
				var apremDe = parseInt(data[i].aprem_de.split(':')[0]);
				var apremA = parseInt(data[i].aprem_a.split(':')[0]);
				var jour = i+1;

				// Mise a jour du matin
				
				for(var k=matinDe;k<matinA;k++){
					$("[jour=" + jour + "][heure=" + k + "]").attr("activite","repos");
					$("[jour=" + jour + "][heure=" + k + "]").click(creerRdv);
				}
				// Mise a jour de l'après-midi
				for(var k=apremDe;k<apremA;k++){
					$("[jour=" + jour + "][heure=" + k + "]").attr("activite","repos");
					$("[jour=" + jour + "][heure=" + k + "]").click(creerRdv);
				}

				// On comble les vides en mettant disponible
				for(var k=0;k<matinDe;k++){
					$("[jour=" + jour + "][heure=" + k + "]").attr("activite","disponible");

				}

				for(var k=matinA;k<apremDe;k++){
					$("[jour=" + jour + "][heure=" + k + "]").attr("activite","disponible");
				}

				for(var k=apremA;k<24;k++){
					$("[jour=" + jour + "][heure=" + k + "]").attr("activite","disponible");
				}

				// On récupère l'heure minimal travaillé et l'heure maximal travaillé
				// Ces données servent à la fonction MaJLigne()
				if(matinDe<heureMinTravaille) heureMinTravaille = matinDe;
				if(apremA>heureMaxTravaille) heureMaxTravaille = apremA;

		}

	}
	// Maintenant que nos attributs sont bien placé on peut mettre à jour les lignes
	MaJLigne();
}

function MaJWeekendEtFerie(data){
	for(var i=0; i<data.length;i++){
		//Aucune variable n'est défini donc c'est soit un weekend soit un jour ferie
		if(data[i].matin_de == undefined && data[i].matin_a == undefined && data[i].aprem_de == undefined && data[i].aprem_a == undefined){
			var jour = parseInt(data[i].date.split('-')[2]);
				$("[jour=" + jour + "]").removeAttr("activite");
				$("[jour=" + jour + "]").attr("activite","disponible");
		}
			

	}
}

function MaJRDV(data){
	
	//On parcours tous les RDV
	for(var i=0; i<data.length;i++){
		var jour = parseInt(data[i].date.split('-')[2]);
		var debut = parseInt(data[i].startTime.split(':')[0]);
		var fin = parseInt(data[i].endTime.split(':')[0]);
		fin = fin + 1;
		//Pour chaque RDV on ajoute l'attribut activite=travail 
		for(var j=debut;j<fin;j++){
			var id="heure" + j + "_jour" + jour;
			$("#" + id).removeAttr("activite");
			$("#" + id).attr("activite","travail");
			$("#" + id).unbind("click");
			$("#" + id).click(afficherRDV);
			$("#" + id).attr("idMeeting", data[i].idMeeting);
			var img = document.createElement("img");
			img.src="img/icone-rendezvous.png";
			$("#" + id).empty(); // On vide car de base la cellule contient un caractere
			$("#" + id).append(img);

		}
	}
}

function JourCourant(){
	//On récupere la date courante
	var date = new Date();
	if(mois == (date.getMonth() + 1)){
		$("[jour=" + date.getDate() + "]").attr("jourCourant","1");
		$("#" + "jour" + date.getDate()).attr("jourCourant","1");
	} else{
		$("[jourCourant=1]").removeAttr("jourCourant");
	}

}

function MaJTitre(data){
	//Mise a jours du titre
	$("#nom").text(data.identite.nom);
	$("#prenom").text(data.identite.prenom);
	$("#dateAffichee").text(data.agenda[0].date.split('-')[1] + "/" + data.agenda[0].date.split('-')[0]);		
}




