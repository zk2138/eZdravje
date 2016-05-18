
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";

var sessionT = null;

/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    if(sessionT != null)
      return sessionT;
    
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}

var ehrIdTab = [];

function generirajZacetne3Uporabnike() {
    for(i=1; i <= 3; i++) {
        ehr = generirajPodatke(i);
        //console.log(ehr);
        ehrIdTab.push(ehr);
    }
    /*
    for(i=0; i <= 2; i++) {
        //ehr = generirajPodatke(i);
        console.log(ehrIdTab[i]);
        //ehrIdTab.push(ehr);
    }
    */
    var sporocilo = "<span class='obvestilo " +
                          "label label-success fade-in'>Uspešno kreirani EHR: <br />";
    for(i=0; i < 3; i++) {
      sporocilo += ehrIdTab[i] + "<br /> ";
    }
    sporocilo +=  "</span>";
    $("#sporociloB").html(sporocilo);
    
}


/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
function generirajPodatke(stPacienta) {
    ehrId = "";
    
    // TODO: Potrebno implementirati
    if(stPacienta === 1) {
        ehrId = zacetniEHRzaPacienta("Janez", "Janša", "1975-06-13T01:25");
        $('#pacient').append('<a href="#" onclick="vnesiEHRID(\'' + ehrId + '\')">Janez Janša</a>');
    } else if(stPacienta === 2) {
        ehrId = zacetniEHRzaPacienta("Bolnik", "Bolni", "1965-06-12T01:25");
        $('#pacient').append('<a href="#" onclick="vnesiEHRID(\'' + ehrId + '\')">Bolnik Bolni</a>');
    }else if(stPacienta === 3) {
        ehrId = zacetniEHRzaPacienta("Polomljeni", "Bumbar", "2003-06-13T01:25");
        $('#pacient').append('<a href="#" onclick="vnesiEHRID(\'' + ehrId + '\')">Polomljeni Bumbar</a>');
    }
    return ehrId;
}

function EHRzaPacienta() {
	sessionId = getSessionId();
  var ehrId = null;
	var ime = $("#vpisiIme").val();
	var priimek = $("#vpisiPriimek").val();
	var datumRojstva = $("#vpisiDatumR").val();
	
	console.log(ime + " " + priimek + " " + datumRojstva);

	if (!ime || !priimek || !datumRojstva || ime.trim().length == 0 ||
      priimek.trim().length == 0 || datumRojstva.trim().length == 0) {
		$("#sporociloP").html("<span class='obvestilo label " +
      "label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		$.ajax({
		    url: baseUrl + "/ehr",
		    type: 'POST',
		    async: false,
		    success: function (data) {
		        ehrId = data.ehrId;
		        var partyData = {
		            firstNames: ime,
		            lastNames: priimek,
		            dateOfBirth: datumRojstva,
		            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
		        };
		        $.ajax({
		            url: baseUrl + "/demographics/party",
		            type: 'POST',
		            contentType: 'application/json',
		            data: JSON.stringify(partyData),
		            async: false,
		            success: function (party) {
		                if (party.action == 'CREATE') {
		                    $("#sporociloP").html("<span class='obvestilo " +
                          "label label-success fade-in'>Uspešno kreiran EHR '" +
                          ehrId + "'.</span>");
		                    $("#ehrIdP").val(ehrId);
		                    $('#pacient').append('<a href="#" onclick="vnesiEHRID(\'' + ehrId + '\')">' + ime + ' ' + priimek + '</a>');
		                }
		            },
		            error: function(err) {
		            	$("#sporociloP").html("<span class='obvestilo label " +
                    "label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
		            }
		        });
		    }
		});
	}
}


function vnesiEHRID(ehrId) {
  $("#ehrIdP").val(ehrId);
}

function pridobiEhrPacienta() {
	sessionId = getSessionId();

	var ehrId = $("#preberiEHRid").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiSporocilo").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				$("#preberiSporocilo").html("<span class='obvestilo label " +
          "label-success fade-in'>Bolnik '" + party.firstNames + " " +
          party.lastNames + "', ki se je rodil '" + party.dateOfBirth +
          "'.</span>");
			},
			error: function(err) {
				$("#preberiSporocilo").html("<span class='obvestilo label " +
          "label-danger fade-in'>Napaka '" +
          JSON.parse(err.responseText).userMessage + "'!");
			}
		});
	}
}


// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija

/**
 *  Dropdown menu code 
 */
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function izbiraNacina() {
    document.getElementById("nacin").classList.toggle("show");
}

function izbiraPacienta() {
    document.getElementById("pacient").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtnI') && !event.target.matches('.dropbtnP')) {

    var dropdownsI = document.getElementsByClassName("dropdown-contentI");
    var dropdownsP = document.getElementsByClassName("dropdown-contentP");
    var i;
    for (i = 0; i < dropdownsI.length; i++) {
      var openDropdown = dropdownsI[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
    for (i = 0; i < dropdownsP.length; i++) {
      var openDropdown = dropdownsP[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  } 
  else if (!event.target.matches('.dropbtnI')) {

    var dropdowns = document.getElementsByClassName("dropdown-contentI");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  } 
  else if (!event.target.matches('.dropbtnP')) {

    var dropdowns = document.getElementsByClassName("dropdown-contentP");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function izbira(stNacina) {
    if(stNacina == 0) {
        //TODO: funkcija za generiranje 3
        generirajZacetne3Uporabnike();
        console.log( "Generiraj podatke" );
        //alert( "Generiraj podatke" );
    }
    else if(stNacina == 1) {
        //TODO: funkcija za vnos podatkov
        console.log( "Vnesite podatke" );
        //alert( "Vnesite podatke" );
    }
}