// déclaration de variables globales
	var data;
	var maxMonth;
	var maxValue;
	var maxYear;
	var minMonth;
	var minValue;
	var minYear;
	var anneeSelectionnee;

	var date = new Date();
	var anneeCourante = date.getFullYear();
	anneeSelectionnee = anneeCourante;
	var moisLettre = ["","janv", "fev", "mar", "avr", "mai", "jui", "jui", "aou", "sep", "oct", "nov", "dec"];

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
			 success: function(dataServeur) { 
			 	data=dataServeur;
			 	mettreAJourSelect(anneeCourante); // on met a jour les années du select
			 }, 
			 error : function(errorThrown) { 
			 alert(textStatus + " " + errorThrown) ; 
			 } 
		});

};



/* ----------------------------------------------------------------------------------------------------------------------
   Traite le json reçu du serveur, qui contient les stats
   ---------------------------------------------------------------------------------------------------------------------- */
function afficherGraphique(data) {

	maxMonth = data['max.month'];
	maxValue = data['max.value'];
	maxYear = data['max.year'];
	minMonth = data['min.month'];
	minValue = data['min.value'];
	minYear = data['min.year'];
	var nombre = data['numbers'];
	var width = 30;

	// On créée la scene qui va contenir les calques
	var scene = new Kinetic.Stage({
	    container: "kinetic",
	    width: 850,
	    height: 550,
	  });

	// On créée le calque
	var calque = new Kinetic.Layer();

	
	

    // Dessine les trait pour l'abscice et l'ordonnée
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

	// On dessine les fleche aux extrémités des lignes
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



	// On dessine le texte de l'abscisse et de l'ordonnée
	var txtAbscisse = new Kinetic.Text({
			x: 757,
			y: 485,
			text: "mois",
			fontSize: 11,
			fontFamily: "verdana",
			Fill: "dodgerblue",
			align: "center"
		});

		calque.add(txtAbscisse);

	var txtOrdonnee = new Kinetic.Text({
			x: 55,
			y: 15,
			text: "Rendez-vous",
			fontSize: 11,
			fontFamily: "verdana",
			Fill: "dodgerblue",
			align: "center",
			rotationDeg: 90
		});

		calque.add(txtOrdonnee);

	// création de l'échelle
	// La boucle va jusqu'a 500 pour parcourir entierement la ligne
		for(var i=0;i<=500;i=i+50){
		var valEchelle = maxValue - maxValue * i/500; // ce calcul permet d'adapter l'echelle en fonction de maxValue en utilisant le rapport i/500 
												//qui correspond au rapport entre chaque niveau de l'echelle
		valEchelle = valEchelle.toFixed(1); // permet de limiter a chiffres après la virgule
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
	var moisDessine = false; // bolléen qui me permet de savoir si le mois a déja été dessiné ou si il faut déssiner un mois vide
	for(var mois=1; mois<=12; mois++){

		for(var i=0; i<nombre.length; i++){	
			if(anneeSelectionnee == nombre[i].year && nombre[i].month == mois){				
					dessinerRectangle(nombre[i],calque,(mois-1));
					moisDessine = true;
			}
			
			if(!moisDessine){
				dessinerMoisVide(mois,calque,(mois-1))
			}
		}
		moisDessine = false;		
	}
	return calque;
}

function dessinerRectangle(nombre,calque,num){
	var fill = '#'+(Math.random()*0xFFFFFF<<0).toString(16); // Génération de couleurs aléatoire
	var width = 30;
	var height = nombre.number * (500/maxValue) ; // La taille s'adapte à la valeur max
	var x = 60 * (num+1);
	var y = 499-height;

	// On dessine le rectangle
	var rectangle = new Kinetic.Rect({
		x: x,
		y:y,
		width: width,
	    height: height,
	    fill: fill 
	});
	calque.add(rectangle);

	// On replace le y pour ecrir le texte en abscisse
	y = 505;
	// Ecriture du texte en abscisse qui correspond au rectangle dessiné précédemment
	var texte = new Kinetic.Text({
		x: x,
		y: y,
		text: moisLettre[nombre.month],
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
		text: moisLettre[mois],
		fontSize: 11,
		fontFamily: "verdana",
		Fill: fill,
		width: width,
		align: "center"
	});

	calque.add(texte);
}

function mettreAJourSelect(anneeCourante){
	var select = $("#annee");
	for(var annee=minYear; annee<=maxYear; annee++){
		if(annee == anneeCourante){
			select.append('<option value="' + annee + '" selected="selected">' + annee + '</option>');
		}else{
			select.append('<option value="' + annee + '">' + annee + '</option>');
		}

	}

	select.change(function(){
		anneeSelectionnee = select.val();
		$("#kinectic").empty();
		afficherGraphique(data);
	});
	
}