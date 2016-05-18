
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";


/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}
ehrIdTab = [];
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
    if(stPacienta === 1)
        ehrId = "123456";
    else if(stPacienta === 2)
        ehrId = "234567";
    else if(stPacienta === 3)
        ehrId = "345678";
    return ehrId;
}


// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija
