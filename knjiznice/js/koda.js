
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

var podatkiPac;

var ehrIdTemp = [];
var ehrIdTab = [];
var bmiTab = [];
var bmiProc = [];
var pocutjeProc=[];
var tlakTab = [];
var tlakProc = [];

var bmiRazred = ["< 18.5 BMI (teža pod normalo)", "18.5 - 24.99 BMI (normalna teža)", "25 - 29.99 BMI (zvišana teža)", "30 - 34.99 BMI (debelost razred I)", 
"35 - 39.99 BMI (debelost razred II)", ">= 40 BMI (debelost razred III )"];
var tlakRazred = ["70/40 - 90/60 mmHg (Nizek krvni tlak)", "90/60 - 120/80 mmHg (Normalen krvni tlak)", "120/80 - 140/90 mmHg (Visoko normalen krvni tlak)", "140/90 - 190/100 mmHg (Visok krvni tlak)"];
var pocutjeRazred=["Spočit", "Utrujen", "Bolečina", "Poškodba"];
var bmiOsebka = [0, 0, 0, 0, 0, 0];
var pocutjeTab=[0, 0, 0, 0];
var tlakOsebka = [0, 0, 0, 0];

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
    
    setTimeout(function() {
      $('#sporociloB').html('');
    }, 15000);
}

function generirajZacetne3Uporabnike() {
  var sporocilo = "";
  ehrIdTemp = [];
    for(i=1; i <= 3; i++) {
        ehr = generirajPodatke(i);
        console.log(ehr);
        ehrIdTemp.push(ehr);
        ehrIdTab.push(ehr);
    }
    console.log(ehrIdTab.length);
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
    
    setTimeout(function() {
      $('#sporociloB').html('');
    }, 15000);
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
    podatkiPac = "";
    // TODO: Potrebno implementirati
    if(stPacienta === 1) {
        ehrId = zacetniEHRzaPacienta("Janez", "Janša", "1975-06-13T01:25");
        $('#pacient').append('<a href="#" onclick="vnesiEHRID(\'' + ehrId + '\')">Janez Janša</a>');
        podatkiPac = {ehrIdPac: ehrId, imePac: "Janez", priimekPac: "Janša"};
        zacetneMeritve(ehrId, "2000-06-13T07:25", "170", "55.00", "36.30", "120", "60", "99", "Doktor", "0");
        zacetneMeritve(ehrId, "2002-06-13T08:35", "173", "62.00", "36.50", "115", "59", "92", "Sam", "1");
        zacetneMeritve(ehrId, "2004-06-13T06:17", "179", "65.20", "36.60", "130", "68", "89", "Mici", "0");
        zacetneMeritve(ehrId, "2007-06-13T06:17", "179", "75.50", "36.10", "160", "90", "99", "Teta Helga", "3");
    } else if(stPacienta === 2) {
        ehrId = zacetniEHRzaPacienta("Ana", "Karenina", "1985-06-12T07:55");
        $('#pacient').append('<a href="#" onclick="vnesiEHRID(\'' + ehrId + '\')">Ana Karenina</a>');
        podatkiPac = {ehrIdPac: ehrId, imePac: "Ana", priimekPac: "Karenina"};
        //zacetniEHRzaPacienta(ehrId, "1975-06-13T01:25", "175", "60.00", "36.30", "120", "60", "98", "Micka" );
        zacetneMeritve(ehrId, "1993-06-13T12:25", "120", "60.00", "36.30", "140", "80", "99", "Mamica", "1");
        zacetneMeritve(ehrId, "2004-06-13T13:25", "165", "52.00", "36.60", "120", "59", "94", "Sosedova Metka", "1");
        zacetneMeritve(ehrId, "2006-06-13T20:25", "169", "53.60", "36.70", "130", "74", "92", "Doktor", "2");
    }else if(stPacienta === 3) {
        ehrId = zacetniEHRzaPacienta("Amresh", "Linker", "2003-06-13T01:25");
        $('#pacient').append('<a href="#" onclick="vnesiEHRID(\'' + ehrId + '\')">Amresh Linker</a>');
        podatkiPac = {ehrIdPac: ehrId, imePac: "Amresh", priimekPac: "Linker"};
        //zacetniEHRzaPacienta(ehrId, "1975-06-13T01:25", "175", "60.00", "36.30", "120", "60", "98", "Micka" );
        zacetneMeritve(ehrId, "2004-06-15T09:25", "60", "15.00", "36.30", "110", "50", "95", "Doktor", "3");
        zacetneMeritve(ehrId, "2010-06-13T14:25", "115", "30.00", "36.30", "160", "90", "95", "Mamica", "3");
        zacetneMeritve(ehrId, "2016-04-13T19:25", "150", "75.00", "36.30", "140", "30", "95", "Helga", "3");
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
	
	//console.log(ime + " " + priimek + " " + datumRojstva);

	if (!ime || !priimek || !datumRojstva || ime.trim().length == 0 ||
      priimek.trim().length == 0 || datumRojstva.trim().length == 0) {
		$("#sporociloP").html("<span class='obvestilo label " +
      "label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
      
    	setTimeout(function() {
          $('#sporociloP').html('');
        }, 15000);
      
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
                    
                    setTimeout(function() {
			          $('#sporociloP').html('');
			        }, 15000);
                    
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
	bmiTab = [];

	var ehrId = $("#ehrIdP").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#sporociloB").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
      
      setTimeout(function() {
          $('#sporociloB').html('');
        }, 15000);
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
      	pridobiVisinoPacienta(ehrId);
          
        setTimeout(function() {
          $('#vrnisporociloP').html('');
        }, 15000);
			},
			error: function(err) {
				$("#vrnisporociloP").html("<span class='obvestilo label " +
          "label-danger fade-in'>Napaka '" +
          JSON.parse(err.responseText).userMessage + "'!");
          
          setTimeout(function() {
          $('#vrnisporociloP').html('');
        }, 15000);
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

function izbiraPacienta() {
    document.getElementById("pacient").classList.toggle("show");
}

function naloziPaciente() {
  if(ehrIdTab.length == 0)
    console.log("Ni pacientov");
  var y = 0;
  $('#pacient').html("");
  while(ehrIdTab.length > y) {
     $('#pacient').append('<a href="#" onclick="vnesiEHRID(\'' + ehrIdTab[y].ehrIdPac + '\')">' + ehrIdTab[y].imePac + ' ' + ehrIdTab[y].priimekPac + '</a>');
     y++;
  }
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
	if (!event.target.matches('.dropbtnP')) {

    var dropdowns = document.getElementsByClassName("dropdown-contentP");
    var i;
    //console.log(dropdowns);
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
  //console.log("nalagam podatke");
  $("#vnosPodatkov1").hide();
  $("#vnosPodatkov2").hide();
  $("#pacienti").hide();
  $("#prikazPodatkov1").show();
  $("#prikazPodatkov2").show();
  $("#prikazPodatkov3").show();
  $("#vrniGumb").show();
}

function nacin() {
  //console.log("vračam se na podatke");
  $("#visinaP").html('');
  $("#telesnaTezaP").html('');
  $("#tlakP").html('');
  $("#tlakL").html('');
  $("#kisikVKrviP").html('');
  $("#temperaturaP").html('');
  $("#pocutjeP").html('');
  $("#bmiP").html('');
  $("#pocutjeL").html('');
  $("#bmiL").html('');
  bmiTab = [];
  bmiProc = [];
  pocutjeProc=[];
  bmiOsebka = [0, 0, 0, 0, 0, 0];
  pocutjeTab=[0, 0, 0, 0];
  tlakTab = [];
  tlakProc = [];
  tlakOsebka = [0, 0, 0, 0];
  $("#vnosPodatkov1").show();
  $("#vnosPodatkov2").show();
  $("#prikazPodatkov1").hide();
  $("#prikazPodatkov2").hide();
  $("#prikazPodatkov3").hide();
  $("#pacienti").show();
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
	var pocutje = 0;
	
	if($("#spocit").attr("checked") == "checked") {
		//console.log("spocit");
		pocutje = 0;
	} else if($("#utrujen").attr("checked") == "checked") {
		//console.log("utrujen");
		pocutje = 1;
	} else if($("#bolecina").attr("checked") == "checked") {
		//console.log("bolecina");
		pocutje = 2;
	} else if($("#poskodba").attr("checked") == "checked") {
		//console.log("poskodba");
		pocutje = 3;
	}

	if (!ehrId || ehrId.trim().length == 0) {
		$("#sporociloM").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
      
      setTimeout(function() {
          $('#sporociloM').html('');
        }, 15000);
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		var podatki = {
		    "ctx/language": "en",
		    "ctx/territory": "SI",
		    "ctx/time": datumInUra,
		    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
		    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
		   	"vital_signs/body_temperature/any_event/temperature|magnitude": telesnaTemperatura,
		    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
		    "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak,
		    "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak,
		    "vital_signs/indirect_oximetry:0/spo2|numerator": nasicenostKrviSKisikom,
		    "vital_signs/pulse:0/any_event:0/rate|magnitude": pocutje,
  			"vital_signs/pulse:0/any_event:0/rate|unit": "/min"
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
		    	//console.log("Uspešno dodani podatki");
		    	$("#vpisiEhrId").val('');
	        	$("#vpisiDatumMeritev").val('');
	        	$("#vpisiTelesnaVisna").val('');
	        	$("#vpisiTeza").val('');
	        	$("#vpisiTemperatura").val('');
	        	$("#vpisiSisTlak").val('');
	        	$("#vpisiDiaTlak").val('');
	        	$("#vpisiKri").val('');
	        	$("#vpisiMerilec").val('');
	        	preveri('1');
		        		
		        $("#sporociloM").html("<span class='obvestilo " +
                          "label label-success fade-in'>Uspešno dodani podatki osebe z EHR '" +
                          ehrId + "'.</span>");
                          
                          setTimeout(function() {
                            $('#sporociloM').html("");
                          }, 6000);
		    },
		    error: function(err) {
		    	$("#sporociloM").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
            
	            setTimeout(function() {
		          $('#sporociloM').html('');
		        }, 15000);
		    }
		});
	}
}

function pridobiVisinoPacienta(ehrId) {
  sessionId = getSessionId();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#sporociloB").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
      
      setTimeout(function() {
          $('#sporociloB').html('');
        }, 15000);
        
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
			    	var visina = 0;
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
				        pridobiTezoPacienta(ehrId, res);
			    	} else {
			    		alert("Ni podatkov o teži pacienta!");
			    	}
			    },
			    error: function() {
			    	alert(JSON.parse(err.responseText).userMessage);
			    }
			  });
	    	},
			error: function(err) {
				$("#sporociloB").html("<span class='obvestilo label " +
          "label-danger fade-in'>Napaka '" +
          JSON.parse(err.responseText).userMessage + "'!");
          
          setTimeout(function() {
	          $('#sporociloB').html('');
	        }, 15000);
        
			}
		});	
	}
}


function pridobiTezoPacienta(ehrId, resV) {
	if (!ehrId || ehrId.trim().length == 0) {
		$("#sporociloB").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
      
      setTimeout(function() {
          $('#sporociloB').html('');
        }, 15000);
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				
				//telesna teža
				$.ajax({
			    url: baseUrl + "/view/" + ehrId + "/" + "weight",
			    type: 'GET',
			    headers: {"Ehr-Session": sessionId},
			    success: function (res) {
			    	var bmi = 0;
			    	if (res.length > 0) {
				    	var results = "<table class='table table-striped " +
                "table-hover'><tr><th>Datum in ura</th>" +
                "<th class='text-right'>Telesna teža</th></tr>";
				        for (var i in res) {
				            results += "<tr><td>" + res[i].time +
                      "</td><td class='text-right'>" + res[i].weight +
                      " " + res[i].unit + "</td>";
                      	bmi = vrniBmi(resV[i].height, res[i].weight);
                      	bmiTab.push(bmi);
				        }
				        results += "</table>";
				        $("#telesnaTezaP").append(results);
			    	} else {
			    		alert("Ni podatkov o višini pacienta!");
			    	}
			    },
			    error: function() {
			    	alert(JSON.parse(err.responseText).userMessage);
			    }
			  });
					
				//klic funkcije za pridobitev tlaka
				pridobiTlakPacienta(ehrId);
			},
			error: function(err) {
				$("#sporociloB").html("<span class='obvestilo label " +
          "label-danger fade-in'>Napaka '" +
          JSON.parse(err.responseText).userMessage + "'!");
          
          setTimeout(function() {
	          $('#sporociloB').html('');
	        }, 15000);
	        
			}
		});
	}
}

function vrniBmi(visina, teza) {
	var bmiT = 0;
	bmiT = teza*10000/(visina*visina);
	return bmiT.toFixed(2);
}

function pridobiTlakPacienta(ehrId) {
  sessionId = getSessionId();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#sporociloB").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
      
      setTimeout(function() {
          $('#sporociloB').html('');
        }, 15000);
      
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				
				//Tlak pacienta
				$.ajax({
			    url: baseUrl + "/view/" + ehrId + "/" + "blood_pressure",
			    type: 'GET',
			    headers: {"Ehr-Session": sessionId},
			    success: function (res) {
			    	if (res.length > 0) {
				        for (var i in res) {
				            tlakTemp = {sisTlak: res[i].systolic, diaTlak: res[i].diastolic};
				            tlakTab.push(tlakTemp);
				        }
				        prilepiTlak(tlakTab);
			    	} else {
			    		alert("Ni podatkov o tlaku pacienta!");
			    	}
			    },
			    error: function() {
			    	alert(JSON.parse(err.responseText).userMessage);
			    }
			  });
				
				//klic za pridobitev temperature in kisika v krvi pacienta
				pridobiTempKisikPacienta(ehrId);
					
			},
			error: function(err) {
				$("#sporociloB").html("<span class='obvestilo label " +
          "label-danger fade-in'>Napaka '" +
          JSON.parse(err.responseText).userMessage + "'!");
          
          setTimeout(function() {
	          $('#sporociloB').html('');
	        }, 15000);
          
			}
		});
	}
}

function prilepiTlak(tTab) {
	for (var i in tTab) {
    	if(tTab[i].sisTlak < 90 || tTab[i].diaTlak < 60)
    		tlakOsebka[0]++;
    	else if(tTab[i].sisTlak < 120 || tTab[i].diaTlak < 80)
    		tlakOsebka[1]++;
        else if(tTab[i].sisTlak < 140 || tTab[i].diaTlak < 90)
    		tlakOsebka[2]++;
    	else if(tTab[i].sisTlak < 190 || tTab[i].diaTlak < 100)
    		tlakOsebka[3]++;
    }
    
    for(i = 0; i < 4; i++) {
    	povpTlak = (tlakOsebka[i]/tTab.length)*100;
    	tlakProc.push(povpTlak.toFixed(2));
    }
    //console.log(tlakProc);
    showGraf("tlak", tlakProc, tlakRazred);
}


function pridobiTempKisikPacienta(ehrId) {
  sessionId = getSessionId();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#sporociloB").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
      
      setTimeout(function() {
          $('#sporociloB').html('');
        }, 15000);
        
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				
				//Telesna temperatura
				$.ajax({
			    url: baseUrl + "/view/" + ehrId + "/" + "body_temperature",
			    type: 'GET',
			    headers: {"Ehr-Session": sessionId},
			    success: function (res) {
			    	if (res.length > 0) {
				    	var results = "<table class='table table-striped " +
                "table-hover'><tr><th>Datum in ura</th>" +
                "<th class='text-right'>Telesna temperatura</th></tr>";
				        for (var i in res) {
				            results += "<tr><td>" + res[i].time +
                      "</td><td class='text-right'>" + res[i].temperature +
                      " " + res[i].unit + "</td>";
				        }
				        results += "</table>";
				        $("#temperaturaP").append(results);
			    	} else {
			    		alert("Ni podatkov o telesni temperaturi pacienta!");
			    	}
			    },
			    error: function() {
			    	alert(JSON.parse(err.responseText).userMessage);
			    }
			  });
				
				//kisik v krvi
				$.ajax({
			    url: baseUrl + "/view/" + ehrId + "/" + "spO2",
			    type: 'GET',
			    headers: {"Ehr-Session": sessionId},
			    success: function (res) {
			    	if (res.length > 0) {
				    	var results = "<table class='table table-striped " +
                "table-hover'><tr><th>Datum in ura</th>" +
                "<th class='text-right'>Kisik v krvi</th></tr>";
				        for (var i in res) {
				            results += "<tr><td>" + res[i].time +
                      "</td><td class='text-right'>" + res[i].spO2 +
                      " " + "%" + "</td>";
				        }
				        results += "</table>";
				        $("#kisikVKrviP").append(results);
			    	} else {
			    		alert("Ni podatkov o nasičenisti krvi s kisikom pacienta!");
			    	}
			    },
			    error: function() {
			    	alert(JSON.parse(err.responseText).userMessage);
			    }
			  });
			  
			  pridobiPocutjePacienta(ehrId);
			  
			},
			error: function(err) {
				$("#sporociloB").html("<span class='obvestilo label " +
          "label-danger fade-in'>Napaka '" +
          JSON.parse(err.responseText).userMessage + "'!");
          
        	setTimeout(function() {
		          $('#sporociloB').html('');
		        }, 15000);
          
			}
		});
	}
}

function pridobiPocutjePacienta(ehrId) {
  sessionId = getSessionId();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#sporociloB").html("<span class='obvestilo label label-warning " +
      "fade-in'>Prosim vnesite zahtevan podatek!");
      
      setTimeout(function() {
          $('#sporociloB').html('');
        }, 15000);
      
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				
				//Počutje pacienta iz pulza
				$.ajax({
			    url: baseUrl + "/view/" + ehrId + "/" + "pulse",
			    type: 'GET',
			    headers: {"Ehr-Session": sessionId},
			    success: function (res) {
			    	if (res.length > 0) {
				        for (var i in res) {
				        	if(res[i].pulse == 0)
				        		pocutjeTab[0]++;
				        	else if(res[i].pulse == 1)
				        		pocutjeTab[1]++;
				        	else if(res[i].pulse == 2)
				        		pocutjeTab[2]++;
				        	else if(res[i].pulse == 3)
				        		pocutjeTab[3]++;
				        }
				        
				        for(i in pocutjeTab) {
				        	var pocutjePovp = (pocutjeTab[i]/res.length)*100;
				        	pocutjeProc.push(pocutjePovp.toFixed(2));
				        }
				        
				        showGraf("pocutje", pocutjeProc, pocutjeRazred);
				        var index = 0;
				        var pocutjeMax = 0;
				        for(i in pocutjeTab) {
				        	if(pocutjeTab[i] > pocutjeMax) {
				        		pocutjeMax = pocutjeTab[i];
				        		index = i;
				        	}
				        }
				        //console.log(index + " " +pocutjeTab[index]);
				        getLocation(index);
			    	} else {
			    		alert("Ni podatkov o počutju pacienta!");
			    	}
			    },
			    error: function() {
			    	alert(JSON.parse(err.responseText).userMessage);
			    }
			  });
			  
			  prilepiBmi() ;
			  
			},
			error: function(err) {
				$("#sporociloB").html("<span class='obvestilo label " +
          "label-danger fade-in'>Napaka '" +
          JSON.parse(err.responseText).userMessage + "'!");
          
          setTimeout(function() {
	          $('#sporociloB').html('');
	        }, 15000);
          
			}
		});
	}
}

function prilepiBmi() {
    for (var i in bmiTab) {
    	if(bmiTab[i] < 18.5)
    		bmiOsebka[0]++;
    	else if(bmiTab[i] >= 18.5 && bmiTab[i] < 24.99)
    		bmiOsebka[1]++;
        else if(bmiTab[i] > 25 && bmiTab[i] <= 29.99)
    		bmiOsebka[2]++;
    	else if(bmiTab[i] >= 30 && bmiTab[i] <= 34.99)
    		bmiOsebka[3]++;
    	else if(bmiTab[i] >= 35 && bmiTab[i] <= 39.99)
    		bmiOsebka[4]++;	
    	else if(bmiTab[i] >= 40)
    		bmiOsebka[5]++;
    }
    
    for(i = 0; i < 6; i++) {
    	povpBmi = (bmiOsebka[i]/bmiTab.length)*100;
    	bmiProc.push(povpBmi.toFixed(2));
    }
    showGraf("bmi", bmiProc, bmiRazred);
}

function preveri(knof) {
	
	if(knof == '1') {
		//console.log("spocit");
		$("#utrujen").removeAttr("checked");
		$("#bolecina").removeAttr("checked");
		$("#poskodba").removeAttr("checked");
		$("#kNov").attr("checked", "checked");
		document.getElementById("kNov").checked = true;
	} else if(knof == '2') {
		//console.log("utrujen");
		$("#kNov").removeAttr("checked");
		$("#bolecina").removeAttr("checked");
		$("#poskodba").removeAttr("checked");
		$("#utrujen").attr("checked", "checked");
		document.getElementById("utrujen").checked = true;
	} else if(knof == '3') {
		//console.log("bolecina");
		$("#kNov").removeAttr("checked");
		$("#utrujen").removeAttr("checked");
		$("#poskodba").removeAttr("checked");
		$("#bolecina").attr("checked", "checked");
		document.getElementById("bolecina").checked = true;
	} else if(knof == '4') {
		//console.log("poskodba");
		$("#kNov").removeAttr("checked");
		$("#utrujen").removeAttr("checked");
		$("#bolecina").removeAttr("checked");
		$("#poskodba").attr("checked", "checked");
		document.getElementById("poskodba").checked = true;
	}
}

function showGraf(imeApp, tabProc, tabRazred) {
	var salesData =[];
	var podatki=[];
	
	for(i in tabProc) {
		if(tabProc[i] > 0) {
			if(tabProc[i] == 100.00)
				tabProc[i] = 99;
			var color = getRandomColor();
			var data1 = {color: color, value: tabProc[i]};
			salesData.push(data1);
			var podatki1 = {color: color, value: i};
			podatki.push(podatki1);
		}
	}
	
	var svg = d3.select("#" + imeApp + "P").append("svg").attr("width",700).attr("height",300);
	svg.append("g").attr("id", imeApp+"Donut");
	Donut3D.draw(imeApp+"Donut", randomData(), 150, 150, 130, 100, 30, 0.4);
	//console.log(salesData);
	//console.log(podatki);
	
	
	var results = "<table class='table table-striped " +
                "table-hover'><tr><th>Legenda: </th>";
	for(i in podatki) {
		results += "<tr><td style='color:white; background-color:"+ podatki[i].color 
		+ "'>" + tabRazred[podatki[i].value] +
                      "</td>";
	}
	results += "</table>";
	$("#" + imeApp + "L").append(results);
	
	
	function randomData(){
		return salesData.map(function(d){ 
			return {value:d.value, color:d.color};});
	}

}


function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
