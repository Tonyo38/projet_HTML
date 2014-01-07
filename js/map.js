
var map;
var panel;
var initialize;
var calculate;
var direction;
var positionActuelle;


if(navigator.geolocation) {
  // L'API est disponible

	navigator.geolocation.getCurrentPosition(affichePosition,erreurPosition);
  
  
} else {
  // Pas de support, proposer une alternative ?
  mapSansGeoloc();
  
}

	// Fonction de callback en cas de succès
function affichePosition(position) {

	// On instancie un nouvel objet LatLng pour Google Maps
	positionActuelle = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	initialize();
}

// Fonction de callback en cas d’erreur
function erreurPosition(error) {
	var info = "Erreur lors de la géolocalisation : ";
	switch(error.code) {
	case error.TIMEOUT:
		info += "Timeout !";
	break;
	case error.PERMISSION_DENIED:
		info += "Vous n’avez pas donné la permission";
	break;
	case error.POSITION_UNAVAILABLE:
		info += "La position n’a pu être déterminée";
	break;
	case error.UNKNOWN_ERROR:
		info += "Erreur inconnue";
	break;
	}
	
  mapSansGeoloc();
}


// Fonction d'initialisation de la carte
initialize = function(){
  var latLng = new google.maps.LatLng(45.315000,5.59685); // Correspond au coordonnées de Lille
  var myOptions = {
    zoom      : 14, // Zoom par défaut
    center    : latLng, // Coordonnées de départ de la carte de type latLng 
    mapTypeId : google.maps.MapTypeId.HYBRID, // Type de carte, différentes valeurs possible HYBRID, ROADMAP, SATELLITE, TERRAIN
    maxZoom   : 20
  };
  
  map      = new google.maps.Map(document.getElementById('map'), myOptions);
  panel    = document.getElementById('panel');
  
  
  direction = new google.maps.DirectionsRenderer({
    map   : map,
    panel : panel // Dom element pour afficher les instructions d'itinéraire
  });

    origin      = positionActuelle; // Le point départ
    destination = "Trixell, 460 Rue du Pommarin, 38430 Moirans"; // Le point d'arrivé
    if(origin && destination){
        var request = {
            origin      : origin,
            destination : destination,
            travelMode  : google.maps.DirectionsTravelMode.DRIVING // Mode de conduite
        }
        var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
        directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
            if(status == google.maps.DirectionsStatus.OK){
                direction.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
            }
        });
    }

    var address = "460 rue du pommarin 38430 Moirans";
  // creation objet Geocoder
  var geocoder = new google.maps.Geocoder();
  // appel methode geocode
  geocoder.geocode( { 'address': address}, function( data, status) {
    // reponse OK
    if( status == google.maps.GeocoderStatus.OK){
      // recup. position
      var pos = data[0].geometry.location;
      // creation d'un marker
      var marker = new google.maps.Marker({
        map : map,
        position : pos,
        title : "Trixell"
      });
      // centrage de la carte
      map.setCenter(pos);
    }
    else {
      alert("La récupération de l'adresse n'a pas réussi pour cette raison : " + status);
    }
  });
};


function mapSansGeoloc(){
// Position par défaut
var centerpos = new google.maps.LatLng(45.315000,5.59685);

// Ansi que des options pour la carte, centrée sur latlng
var optionsGmaps = {
	center:centerpos,
	navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	zoom: 15
};

// Initialisation de la carte avec les options
var map = new google.maps.Map(document.getElementById("map"), optionsGmaps);

  var address = "460 rue du pommarin 38430 Moirans";
  // creation objet Geocoder
  var geocoder = new google.maps.Geocoder();
  // appel methode geocode
  geocoder.geocode( { 'address': address}, function( data, status) {
    // reponse OK
    if( status == google.maps.GeocoderStatus.OK){
      // recup. position
      var pos = data[0].geometry.location;
      // creation d'un marker
      var marker = new google.maps.Marker({
        map : map,
        position : pos,
        title : "Trixell"
      });
      // centrage de la carte
      map.setCenter(pos);
    }
    else {
      alert("La récupération de l'adresse n'a pas réussi pour cette raison : " + status);
    }
  });

}