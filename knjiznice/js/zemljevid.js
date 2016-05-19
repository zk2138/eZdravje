var map;
var service;
var infowindow;

var iAt = null;
var markers = [];

var rad = '4000';
var type = ["park", "cafe", "stadium"];
//pharmacy, physiotherapist, spa, dentist
var ustanove = "Prostočasne ustanove v bližini";
var defSetup = 0;

function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(45.0234456, 12.343798),
        zoom: 14
    });
    infowindow = new google.maps.InfoWindow();
}

google.maps.event.addDomListener(window, 'load', initialize);

getLocation(defSetup);

function getLocation(setup) {
    //console.log("klicanje");
    if(setup == 0) {
        type = ["park", "cafe", "stadium"];
        rad = '4000';
        ustanove = "Prostočasne ustanove v bližini";
        $('#panel-title-zemljevid').text(ustanove);
        deleteMarkers();
    }else if(setup == 1) {
        type = ["hospital", "health"];
        rad = '1300';
        ustanove = "Zdravstvene ustanove v bližini";
        $('#panel-title-zemljevid').text(ustanove);
        deleteMarkers();
    } else if(setup == 2) {
        type = ["spa"];
        //type = ["cafe", "library"];
        rad = '3000';
        ustanove = "Sprostilne ustanove v bližini";
        $('#panel-title-zemljevid').text(ustanove);
        deleteMarkers();
        //console.log("neki dela");
    } else if(setup == 3) {
        type = ["pharmacy", "physiotherapist", "dentist"];
        rad = '1800';
        ustanove = "Ustanove za pomoč v bližini";
        $('#panel-title-zemljevid').text(ustanove);
        deleteMarkers();
        //console.log("neki dela");
    }
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        window.alert("Vklopi geolociranje!");
    }
}

function showPosition(position) {
    
    iAt = position;
    var myLocation = new google.maps.LatLng(iAt.coords.latitude, iAt.coords.longitude);
            
    var iconBase = 'https://maps.google.com/mapfiles/kml/paddle/';
    var marker = new google.maps.Marker({
      position: myLocation,
      map: map,
      icon: iconBase + 'grn-blank.png'
    });
    
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent("Trenutno se nahajaš tu!");
        infowindow.open(map, this);
    });
    
    map.setCenter(myLocation);
    var request = {
        location: myLocation,
        radius: rad,
        types: type
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var pyrmont = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: pyrmont
    });

    markers.push(marker);
    
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

