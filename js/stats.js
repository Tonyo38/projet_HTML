// déclaration de variables globales
	var maxMonth;
	var maxValue;
	var maxYear;
	var minMonth;
	var minValue;
	var minYear;

window.onload = function() {

var idIntervenant = "anthony.grassano@iut2.upmf-grenoble.fr" ;
var datastring = "idIntervenant=" + idIntervenant ; 

    $.ajax({ 

			 type: "POST", 
			 crossDomain : true, 
			 dataType: 'jsonp', 
			 data: datastring, 
			 jsonpCallback : 'afficherGraphique', 
			 url: "http://sil2.ouvaton.org/agenda/ajax/getStatNumbers.php", 
			 success: function(data, textStatus, jqXHR) { 
			 }, 
			 error : function(jqXHR, textStatus, errorThrown) { 
			 alert(textStatus + " " + errorThrown) ; 
			 } 
		});

};



/* ----------------------------------------------------------------------------------------------------------------------
   Traite le json reçu du serveur, qui contient les stats
   ---------------------------------------------------------------------------------------------------------------------- */
function afficherGraphique(data) {
	console.log(data);

	maxMonth = data['max.month'];
	maxValue = data['max.value'];
	maxYear = data['max.year'];
	minMonth = data['min.month'];
	minValue = data['min.value'];
	minYear = data['min.year'];
	var nombre = data['numbers'];
	var width = 30;

	var scene = new Kinetic.Stage({
	    container: "kinetic",
	    width: 850,
	    height: 550
	  });

	var calque = new Kinetic.Layer();

	
	

    // Ici on dessine sur le calque !
	var abscisse_ordonnee = new Kinetic.Line({
			points: [
			40,0, 
			40,500,
			800,500
			],
			strokeWidth: 2,
			stroke : "dodgerblue",
		});
	calque.add(abscisse_ordonnee);

	var fleche = new Kinetic.Line({
			points: [
			40,0, 
			30,10],
			strokeWidth: 2,
			stroke : "dodgerblue",
		});
	calque.add(fleche);

	fleche = new Kinetic.Line({
			points: [
			40,0, 
			50,10],
			strokeWidth: 2,
			stroke : "dodgerblue",
		});
	calque.add(fleche);

	fleche = new Kinetic.Line({
			points: [
			800,500, 
			790,490],
			strokeWidth: 2,
			stroke : "dodgerblue",
		});
	calque.add(fleche);

	fleche = new Kinetic.Line({
			points: [
			800,500, 
			790,510],
			strokeWidth: 2,
			stroke : "dodgerblue",
		});
	calque.add(fleche);




	var txtAbscisse = new Kinetic.Text({
			x: 760,
			y: 510,
			text: "mois/année",
			fontSize: 11,
			fontFamily: "verdana",
			Fill: "dodgerblue",
			align: "center"
		});

		calque.add(txtAbscisse);

	var txtOrdonnee = new Kinetic.Text({
			x: 4,
			y: 15,
			text: "RDV",
			fontSize: 11,
			fontFamily: "verdana",
			Fill: "dodgerblue",
			align: "center"
		});

		calque.add(txtOrdonnee);

	// création de l'échelle
		for(var i=0;i<=500;i=i+50){
		var valEchelle = maxValue - maxValue * i/500; // ce calcul permet d'adapter l'echelle en fonction de maxValue en utilisant le rapport i/500 
												//qui correspond au rapport entre chaque niveau de l'echelle
		valEchelle = valEchelle.toFixed(2); // permet de limiter a 2 chiffres après la virgule
		var echelle = new Kinetic.Text({
			x: 10,
			y: i,
			text: valEchelle,
			fontSize: 11,
			fontFamily: "verdana",
			Fill: "dodgerblue",
			align: "center"
		});

		calque.add(echelle);
		}

		
	// On appel la fonction creerRectangle qui renvoi le calque modifié
    calque = creerRectangle(nombre, calque);
    

  scene.add(calque);

}

// Fonction de création des rectangles
function creerRectangle(nombre, calque){
	var moisAvecRDV = 0; // j'utilise cette variable pour creer un décalage si un mois n'a pas de rdv
	for(var i=minMonth; i<=maxMonth; i++){
		var mois = i;
		if(i>=12) i=0;

		if(nombre[moisAvecRDV].month == mois){
			dessinerRectangle(nombre[moisAvecRDV],calque,i);
			moisAvecRDV++;	// On incremente cette variable seulement quand on trouve un moi avec un rdv	
		} else {
			dessinerMoisVide(mois,calque,i)
		}
		
	}		

	return calque;
}

function dessinerRectangle(nombre,calque,num){
	var fill = '#'+(Math.random()*0xFFFFFF<<0).toString(16); // Génération de couleurs aléatoire
	var width = 30;
	var height = nombre.number * (500/maxValue) ;
	var x = 60 * (num+1);
	var y = 499-height;

	var rectangle = new Kinetic.Rect({
		x: x,
		y:y,
		width: width,
	    height: height,
	    fill: fill 
	});
	calque.add(rectangle);

	y = 505;
	var texte = new Kinetic.Text({
		x: x,
		y: y,
		text: nombre.month,
		fontSize: 11,
		fontFamily: "verdana",
		Fill: fill,
		width: width,
		align: "center"
	});

	calque.add(texte);
			
}

function dessinerMoisVide(mois,calque,num){
	var fill = '#'+(Math.random()*0xFFFFFF<<0).toString(16); // Génération de couleurs aléatoire
	var width = 30;
	var height = 0 ;
	var x = 60 * (num+1);
	var y = 505;

	var texte = new Kinetic.Text({
		x: x,
		y: y,
		text: mois,
		fontSize: 11,
		fontFamily: "verdana",
		Fill: fill,
		width: width,
		align: "center"
	});

	calque.add(texte);
}
