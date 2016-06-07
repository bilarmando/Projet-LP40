// contains the map
var g_Map;
// bounds of the map
var g_Bounds = new google.maps.LatLngBounds();
// contains the panorama
var g_Panorama;

//  array of place object, contains all informations related to a place:
// 'Name' : name of the place
// 'Coord' : google LatLng coordinate
// 'StreetViewStatus' : 1, 0 or -1, with order, available, not checked, not available
// it's important to note that places are stored in a specific order, to match the visual
// list order, so we can retrieve them with ease
var g_Places = [];

// used to know which info window is open we can close it
var g_InfoWindowOpened;


/* this is for experimentation only 			*/
/* stop the whole loading of the page for ms ms */
function delay( ms ){
    var end = new Date().getTime() + ms;
    while ( end > new Date().getTime() );
};

function test() {
    alert("test");
}

/* search a location and center the map on it.     					*/
function searchAndCenter(toSearch) {
    if (typeof g_Map != 'undefined') {
        geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': toSearch},
            function(arrResults){
                var pos = arrResults[0].geometry.location;
                g_Map.setCenter(pos);
            }
        );

    }

}

/* Alternative to searchAndCenter, uses previously obtained latlng */
/* and does not perform the research again						   */
/* link it to the on click event in php and give it the index to   */
/* make it work													   */
function centerMap(index) {
    if (typeof g_Map != 'undefined') {
        g_Panorama.setVisible(false);
        g_Map.setCenter(g_Places[index]['Coord']);
        g_Map.setZoom(18);
        if(g_InfoWindowOpened) {
            g_InfoWindowOpened.close();
        }
    }
}

function fitMap() {
    if(g_Map != 'undefined') {
        g_Map.fitBounds(g_Bounds);
        if(g_InfoWindowOpened) {
            g_InfoWindowOpened.close();
        }
    }
}

/* This function check if streetview is avaiblable for the place of the index */
/* results can be used by checking the StreetViewStatus, if it contains 1     */
/* street view is available for index, -1 not, and 0 means it has not been    */
/* checked yet																  */
/* Each time we get a result form the google api, we also add a marker on the */
/* Map for this spot														  */
function streetViewAvailable(index) {
    var streetViewService = new google.maps.StreetViewService();
    var STREETVIEW_MAX_DISTANCE = 100;
    streetViewService.getPanoramaByLocation(g_Places[index]['Coord'], STREETVIEW_MAX_DISTANCE, function (index) {
        return (function(streetViewPanoramaData, status) {
            if (status === google.maps.StreetViewStatus.OK) {
                g_Places[index]['StreetViewStatus'] = 1;
            } else {
                g_Places[index]['StreetViewStatus'] = -1;
            }
            setMarker(index);
        });
    }(index));
}

/* Set the infoWindow for the index place and markers, requires Coord and StreetViewStatus to be filled,a map and a marker */
function setInfoWindow(index, marker) {
    // test if streetview can be enabled, if it can, add a button to switch to streetview
    var htmlContent;
    var title = g_Places[index]['Name'];

    var streetView;
    if(g_Places[index]['StreetViewStatus'] == 1) {
        streetView = "<input type=\"button\" value=\"Street View\" onclick=\"toggleStreetView("+index+");\"></input>";
    } else {
        streetView = "Street View is not available for this place";
    }

    htmlContent = "<div class='infoWindow'> "+title+" <br/>"+streetView+"</div>";

    var infowindow= new google.maps.InfoWindow({
        content: htmlContent
    });
    google.maps.event.addListener(marker, 'click', function(marker, infowindow) {
        return function() {
            if(g_InfoWindowOpened) {
                g_InfoWindowOpened.close();
            }
            infowindow.open(g_Map,marker);
            g_InfoWindowOpened = infowindow;
        }
    }(marker, infowindow));
}

/* Set a marker for the index place, requires Coord and StreetViewStatus to be filled (and a map) */
function setMarker(index) {
    if (typeof g_Map != 'undefined') {
        var marker = new google.maps.Marker({
            position: g_Places[index]['Coord'],
            map: g_Map
        });
        g_Bounds.extend(g_Places[index]['Coord']);
        g_Map.fitBounds(g_Bounds);
        setInfoWindow(index, marker);
    }
}

/* Add markers for every place available for the movie 				*/
function setMarkers() {
    for(var i= 0; i < g_PlacesName.length; i++) {
        setMarker(index);
    }
}

/* function that handle turning on and off the streetview panorama */
function toggleStreetView(index) {
    var toggle = g_Panorama.getVisible();
    if (toggle == false) {
        g_Panorama.setPosition(g_Places[index]['Coord']);
        g_Panorama.setVisible(true);
    } else {
        g_Panorama.setVisible(false);
    }
}

/* it all start from there when the page is loading */
function initialize() {
    // we build the map
    var defPlace= document.getElementById('place0');
    var defaultLocation = new google.maps.LatLng(defPlace.dataset.lat, defPlace.dataset.lon);
    var mapOptions = {
        center: defaultLocation,
        zoom: 15,
        draggable: true,
        //disableDefaultUI: true
    };

    g_Map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

    // We get the map's default panorama and set up some defaults.
    // Note that we don't yet set it visible.
    g_Panorama = g_Map.getStreetView();
    g_Panorama.setPosition(defaultLocation);
    g_Panorama.setPov(/** @type {google.maps.StreetViewPov} */({
        heading: 265,
        pitch: 0
    }));

    // then we retrieve places and for each we do the following:
    // find the latlgn -> check for street view -> create a marker -> fit the bounds of the map-> add an infowindow

    // first step, retrieve the places from the html document
    var context = document.getElementById("placesList");
    var HTMLplaces = context.getElementsByTagName("li");

    for(var i= 0; i < HTMLplaces.length; i++) {
        // second step, for each place add it to the array
        var place = document.getElementById('place'+i);
        g_Places[i] = {
            Name: HTMLplaces[i].innerHTML,
            Coord: new google.maps.LatLng(place.dataset.lat, place.dataset.lon),
            StreetViewStatus: 0
        };
        // check for street view, async call, the rest is done under the call back
        streetViewAvailable(i);
    }
}

google.maps.event.addDomListener(window, 'load', initialize);

/* No longer needed, was used to geocode using google api
 function geocode(g_PlacesCoord, index ) {
 geocoder = new google.maps.Geocoder();
 if( geocoder ) {
 // we use a closure to keep the index and be able to retrieve what results matches what address
 geocoder.geocode({'address':g_PlacesName[index]}, function(g_PlacesCoord, index){
 return(function(results, status){
 if (status == google.maps.GeocoderStatus.OK) {
 var latlng = results[0].geometry.location;
 g_PlacesCoord[index] = latlng;
 // check for street view, then this function will set markers etc...
 streetViewAvailable(index);
 }
 });
 }(g_PlacesCoord, index));
 }
 }
 */





