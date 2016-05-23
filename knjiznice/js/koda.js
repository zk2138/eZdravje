
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

var ehrIdTemp = [];
var ehrIdTab = [];

function generirajZacetne3UporabnikeOnLoad() {
  if(ehrIdTab.length != 0)
    return;
  var sporocilo = "";
  $("#prikazPodatkov").hide();
  ehrIdTemp = [];
    for(i=1; i <= 3; i++) {
        ehr = generirajPodatke(i);
        //console.log(ehr);
        ehrIdTemp.push(ehr);
        ehrIdTab.push(ehr);
    }
    /*
    for(i=0; i <= 2; i++) {
        //ehr = generirajPodatke(i);
        console.log(ehrIdTab[i]);
        //ehrIdTab.push(ehr);
    }
    */
    sporocilo = "<span class='obvestilo label label-success fade-in'>Uspešno kreirani EHR: <br />";
    for(i=0; i < 3; i++) {
      sporocilo += ehrIdTemp[i].ehrIdPac + "<br /> ";
    }
    sporocilo +=  "</span>";
    $("#sporociloB").html(sporocilo);
    
    i = 0;
    while(ehrIdTab.length > i) {
      console.log(ehrIdTab[i]);
      i++;
    }
    
    setTimeout(function() {
      $('#sporociloB').html('');
    }, 15000);
}

function generirajZacetne3Uporabnike() {
  var sporocilo = "";
  ehrIdTemp = [];
    for(i=1; i <= 3; i++) {
        ehr = generirajPodatke(i);
        //console.log(ehr);
        ehrIdTemp.push(ehr);
        ehrIdTab.push(ehr);
    }
    /*
    for(i=0; i <= 2; i++) {
        //ehr = generirajPodatke(i);
        console.log(ehrIdTab[i]);
        //ehrIdTab.push(ehr);
    }
    */
    sporocilo = "<span class='obvestilo label label-success fade-in'>Uspešno kreirani EHR: <br />";
    for(i=0; i < 3; i++) {
      sporocilo += ehrIdTemp[i].ehrIdPac + "<br /> ";
    }
    sporocilo +=  "</span>";
    $("#sporociloB").html(sporocilo);
    
    i = 0;
    while(ehrIdTab.length > i) {
      console.log(ehrIdTab[i]);
      i++;
    }
    
    setTimeout(function() {
      $('#sporociloB').html('');
    }, 15000);
}

var podatkiPac;

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
    podatkiPac = "";
    // TODO: Potrebno implementirati
    if(stPacienta === 1) {
        ehrId = zacetniEHRzaPacienta("Janez", "Janša", "1975-06-13T01:25");
        $('#pacient').append('<a href="#" onclick="vnesiEHRID(\'' + ehrId + '\')">Janez Janša</a>');
        podatkiPac = {ehrIdPac: ehrId, imePac: "Janez", priimekPac: "Janša"};
        zacetneMeritve(ehrId, "1975-06-13T01:25", "175", "60.00", "36.30", "120", "60", "95", "Micka");
    } else if(stPacienta === 2) {
        ehrId = zacetniEHRzaPacienta("Ana", "Karenina", "1965-06-12T01:25");
        $('#pacient').append('<a href="#" onclick="vnesiEHRID(\'' + ehrId + '\')">Ana Karenina</a>');
        podatkiPac = {ehrIdPac: ehrId, imePac: "Ana", priimekPac: "Karenina"};
        //zacetniEHRzaPacienta(ehrId, "1975-06-13T01:25", "175", "60.00", "36.30", "120", "60", "98", "Micka" );
        zacetneMeritve(ehrId, "1975-06-13T01:25", "175", "60.00", "36.30", "120", "60", "95", "Micka");
    }else if(stPacienta === 3) {
        ehrId = zacetniEHRzaPacienta("Amresh", "Linker", "2003-06-13T01:25");
        $('#pacient').append('<a href="#" onclick="vnesiEHRID(\'' + ehrId + '\')">Amresh Linker</a>');
        podatkiPac = {ehrIdPac: ehrId, imePac: "Amresh", priimekPac: "Linker"};
        //zacetniEHRzaPacienta(ehrId, "1975-06-13T01:25", "175", "60.00", "36.30", "120", "60", "98", "Micka" );
        zacetneMeritve(ehrId, "1975-06-13T01:25", "175", "60.00", "36.30", "120", "60", "95", "Micka");
    }
    return podatkiPac;
}

function EHRzaPacienta() {
	sessionId = getSessionId();
  var ehrId = null;
	var ime = $("#vpisiIme").val();
	var priimek = $("#vpisiPriimek").val();
	var datumRojstva = $("#vpisiDatumR").val();
	podatkiPac = "";
	
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
                          
                          setTimeout(function() {
                            $('#sporociloP').html("");
                          }, 6000);
                          
		                    $("#ehrIdP").val(ehrId);
		                    podatkiPac = {ehrIdPac: ehrId, imePac: ime, priimekPac: priimek};
		                    ehrIdTab.push(podatkiPac);
		                    naloziPaciente();
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
  $("#vpisiEhrId").val(ehrId);
}

function pridobiEhrPacienta() {
	sessionId = getSessionId();

	var ehrId = $("#ehrIdP").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#sporociloB").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				
        setTimeout(function() {
          naloziPodatke();
        }, 200);
        
        $("#vrnisporociloP").html("<span class='obvestilo label " +
          "label-success fade-in'>Uspešno naloženi podatki bolnika '" + party.firstNames + " " +
          party.lastNames + "', ki se je rodil '" + party.dateOfBirth +
          "'.</span>");
        
        $("#vrniIme").val(party.firstNames);
      	$("#vrniPriimek").val(party.lastNames);
      	$("#vrniDatumR").val(party.dateOfBirth);
      	$("#vrniEhrIdP").val(ehrId);
      	pridobiTezoinVisinoPacienta(ehrId);
          
        setTimeout(function() {
          $('#vrnisporociloP').html('');
        }, 15000);
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

function naloziPaciente() {
  if(ehrIdTab.length == 0)
    console.log("Ni pacientov");
  x = 0;
  $('#pacient').html("");
  while(ehrIdTab.length > x) {
     $('#pacient').append('<a href="#" onclick="vnesiEHRID(\'' + ehrIdTab[x].ehrIdPac + '\')">' + ehrIdTab[x].imePac + ' ' + ehrIdTab[x].priimekPac + '</a>');
     x++;
  }
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

/**
 * Funkciji za preklaplanje med prikazom in skrivanjem vnosnih polj in prikaza podatkov pacienta
 */
function naloziPodatke() {
  console.log("nalagam podatke");
  $("#vnosPodatkov1").hide();
  $("#vnosPodatkov2").hide();
  $("#vnosPodatkov3").hide();
  $("#prikazPodatkov").show();
  $("#vrniGumb").show();
}

function nacin() {
  console.log("vračam se na podatke");
  $("#vnosPodatkov1").show();
  $("#vnosPodatkov2").show();
  $("#vnosPodatkov3").show();
  $("#prikazPodatkov").hide();
  $("#vrniGumb").hide();
}


function dodajMeritve() {
	//console.log("klic funkcije");
	sessionId = getSessionId();
	
	var ehrId = $("#vpisiEhrId").val();
	var datumInUra = $("#vpisiDatumMeritev").val();
	var telesnaVisina = $("#vpisiTelesnaVisna").val();
	var telesnaTeza = $("#vpisiTeza").val();
	var telesnaTemperatura = $("#vpisiTemperatura").val();
	var sistolicniKrvniTlak = $("#vpisiSisTlak").val();
	var diastolicniKrvniTlak = $("#vpisiDiaTlak").val();
	var nasicenostKrviSKisikom = $("#vpisiKri").val();
	var merilec = $("#vpisiMerilec").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#sporociloM").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		var podatki = {
			// Struktura predloge je na voljo na naslednjem spletnem naslovu:
      // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
		    "ctx/language": "en",
		    "ctx/territory": "SI",
		    "ctx/time": datumInUra,
		    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
		    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
		   	"vital_signs/body_temperature/any_event/temperature|magnitude": telesnaTemperatura,
		    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
		    "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak,
		    "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak,
		    "vital_signs/indirect_oximetry:0/spo2|numerator": nasicenostKrviSKisikom
		};
		var parametriZahteve = {
		    ehrId: ehrId,
		    templateId: 'Vital Signs',
		    format: 'FLAT',
		    committer: merilec
		};
		$.ajax({
		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(podatki),
		    success: function (res) {
		    	console.log("Uspešno dodani podatki");
		    	$("#vpisiEhrId").val('');
        	$("#vpisiDatumMeritev").val('');
        	$("#vpisiTelesnaVisna").val('');
        	$("#vpisiTeza").val('');
        	$("#vpisiTemperatura").val('');
        	$("#vpisiSisTlak").val('');
        	$("#vpisiDiaTlak").val('');
        	$("#vpisiKri").val('');
        	$("#vpisiMerilec").val('');
		    },
		    error: function(err) {
		    	$("#sporociloM").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
		    }
		});
	}
}


function pridobiTezoinVisinoPacienta(ehrId) {
  sessionId = getSessionId();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#sporociloB").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				
				//Telesna višina
				$.ajax({
			    url: baseUrl + "/view/" + ehrId + "/" + "height",
			    type: 'GET',
			    headers: {"Ehr-Session": sessionId},
			    success: function (res) {
			    	if (res.length > 0) {
				    	var results = "<table class='table table-striped " +
                "table-hover'><tr><th>Datum in ura</th>" +
                "<th class='text-right'>Telesna višina</th></tr>";
				        for (var i in res) {
				            results += "<tr><td>" + res[i].time +
                      "</td><td class='text-right'>" + res[i].height +
                      " " + res[i].unit + "</td>";
				        }
				        results += "</table>";
				        $("#visinaP").append(results);
			    	} else {
			    		alert("ni podatkov!");
			    	}
			    },
			    error: function() {
			    	alert(JSON.parse(err.responseText).userMessage);
			    }
			  });
				
				//telesna teža
				$.ajax({
			    url: baseUrl + "/view/" + ehrId + "/" + "weight",
			    type: 'GET',
			    headers: {"Ehr-Session": sessionId},
			    success: function (res) {
			    	if (res.length > 0) {
				    	var results = "<table class='table table-striped " +
                "table-hover'><tr><th>Datum in ura</th>" +
                "<th class='text-right'>Telesna teža</th></tr>";
				        for (var i in res) {
				            results += "<tr><td>" + res[i].time +
                      "</td><td class='text-right'>" + res[i].weight +
                      " " + res[i].unit + "</td>";
				        }
				        results += "</table>";
				        $("#telesnaTezaP").append(results);
			    	} else {
			    		alert("ni podatkov!");
			    	}
			    },
			    error: function() {
			    	alert(JSON.parse(err.responseText).userMessage);
			    }
			  });
					
			},
			error: function(err) {
				$("#preberiSporocilo").html("<span class='obvestilo label " +
          "label-danger fade-in'>Napaka '" +
          JSON.parse(err.responseText).userMessage + "'!");
			}
		});
	}
}