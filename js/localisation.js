// contains the map
var g_Map;
// bounds of the map
var g_Bounds = new google.maps.LatLngBounds();

// defines the zoom level to change the type of markers to show
var g_ZoomLevelMarkersChangesState = 6;

// used to know which info window is open we can close it
var g_InfoWindowOpened;

//  array of place object, contains all informations related to a place:
// 'Movie' : title of the movie of the place
// 'City' : city of the place
// 'Country' : country of the place
// 'Coord' : google LatLng coordinate
// 'Marker' : the associated marker
var g_Places = [];

// array of markers representing countries where corresponding places exists
var g_MarkersByCountry = [];
// Marker
// Bounds


/* it all start from there when the page is loading */
function initialize() {
    // we build the map
    var defaultLocation = new google.maps.LatLng(0, 1);
    var mapOptions = {
        center: defaultLocation,
        zoom: 15,
        draggable: true,
        //disableDefaultUI: true
    };

    g_Map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

    // add a listener on the zoom_changed event
    google.maps.event.addListener(g_Map, 'zoom_changed', function() {
        console.log("zoom changed : " + g_Map.getZoom());
        zoomLevel = g_Map.getZoom();
        if (zoomLevel >= g_ZoomLevelMarkersChangesState) {
            displaySpotMarkers();
        } else {
            displayCountryMarkers();
        }
    });


    // then we retrieve places and for each we do the following:
    // find the latlgn -> create a marker -> fit the bounds of the map-> add an infowindow
    // first step, retrieve the places from the html document
    var placesCount = document.getElementById('placesCount');
    var count = placesCount.dataset.count;
    console.log("count data:" + count);
    //movie list by country
    var moviesByCountries = [];

    // for each movie, create a marker and an infowindow, also build the list of movies by country
    for(var index= 0; index < count; index++) {
        var place = document.getElementById('place'+index);
        var coord = new google.maps.LatLng(place.dataset.lat, place.dataset.lon);

        // we build the list of movies by country
        g_Places[index] = {
            Id:	place.dataset.mid,
            Movie: place.dataset.movie,
            City: place.dataset.city,
            Country: place.dataset.country,
            Coord: coord,
            Marker: setMarker(coord, getColor(place.dataset.movie,place.dataset.mid.split('')[1])),
        };
        g_Places[index]['Marker'].setVisible(true);

        var htmlContent = "<div class='infowindow'><a href=\"\details.php?idMovie="+g_Places[index]['Id']+"\">"+g_Places[index]['Movie']+"</a> </div>";
        // add an infowindow to the place's marker's click event
        var infowindow= new google.maps.InfoWindow({
            content: htmlContent
        });
        google.maps.event.addListener(g_Places[index]['Marker'], 'click', function(marker, infowindow) {
            return function() {
                if(g_InfoWindowOpened) {
                    g_InfoWindowOpened.close();
                }
                infowindow.open(g_Map,marker);
                g_InfoWindowOpened = infowindow;
            }
        }(g_Places[index]['Marker'], infowindow));

        if(place.dataset.country != "-") {
            if(!containsAssoc(moviesByCountries, place.dataset.country) ){
                moviesByCountries[place.dataset.country] = new Array(g_Places[index]);
            } else {
                mList = moviesByCountries[place.dataset.country];
                if(!contains(mList, g_Places[index])) {
                    mList.push(g_Places[index]);
                }
            }
        }

        g_Bounds.extend(coord);
    }

    // we create a markers by country linked with an infowwindow containing the list
    // of the movies where there are places of this country
    for(var country in moviesByCountries) {
        var mList = "<ul>";
        for(var i = 0; i < moviesByCountries[country].length; i++) {
            item = "<li><a href=\"\details.php?idMovie="+moviesByCountries[country][i]['Id']+"\">"+moviesByCountries[country][i]['Movie']+"</a></li>";
            mList += item;
        }
        mList += "</ul>";

        var htmlContent = "<div class='infowindow'><h2>"+country + "</h2> <p>films dans ce pays: " + mList + "</p> </div>";
        var infowindow= new google.maps.InfoWindow({
            content: htmlContent
        });
        // we need to geaocode each country, we did not store the lat/lng for each.
        // the end of the process is done in setmarker_geocode_cb
        // called once we have the coordinate for the spot to mark
        geocode(country, setmarker_geocode_cb, infowindow);
    }

    // set a nice view of the map
    fitMap();
    console.log("nbMarkers:" + g_Places.length);


}

function setmarker_geocode_cb(coord, infowindow) {
    var marker = setMarker(coord, getRandomColor());
    google.maps.event.addListener(marker, 'click', function(marker, infowindow) {
        return function() {
            if(g_InfoWindowOpened) {
                g_InfoWindowOpened.close();
            }
            infowindow.open(g_Map,marker);
            g_InfoWindowOpened = infowindow;
        }
    }(marker, infowindow));
    marker.setVisible(true);
    g_MarkersByCountry.push(marker);
}

// geocode the country and call callback with infowindow as argument to mark the country and add the infowindow
// to the marker's click event
function geocode(country, callback, infowindow) {
    geocoder = new google.maps.Geocoder();
    if( geocoder ) {
        geocoder.geocode({'address':country}, function(infowindow) {
            return (function(results, status){
                if (status == google.maps.GeocoderStatus.OK) {
                    var latlng = results[0].geometry.location;
                    callback(latlng, infowindow);
                }
            });
        }(infowindow));
    }
}

// renvoie une couleur identique pour une string et un index identique
function getColor(string,index) {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    while(string.length < 6) {
        string += 'a';
    }
    var code = string.split('');
    for (var i = 0; i < 6; i++ ) {
        color += letters[(code[i].charCodeAt(0)*index) % 16];
    }
    return color;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/* Set a marker at coord */
function setMarker(coord, color) {
    var colorUsed = "#F00";
    if(color) {
        colorUsed = color;
    }

    var marker = new google.maps.Marker({
        position: coord,
        map: g_Map,
        visible: false,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8.5,
            fillColor: colorUsed,
            fillOpacity: 0.8,
            strokeWeight: 1.5
        },
    });
    return marker;
}

function fitMap() {
    if(g_Map != 'undefined') {
        g_Map.fitBounds(g_Bounds);
        if(g_InfoWindowOpened) {
            g_InfoWindowOpened.close();
        }
    }
}

// test if the associative array a contains the object obj
function containsAssoc(a, obj) {
    for (var v in a) {
        if (v === obj) {
            return true;
        }
    }
    return false;
}

// test if the array of movies contains the movie movie
// the movie is a reference to a g_Place array item
function contains(movieArray, movie) {
    for (var i = 0; i < movieArray.length; i++) {
        if (movieArray[i]['Id'] === movie['Id']) {
            return true;
        }
    }
    return false;
}

// display all spots markers and hide the country's one
function displaySpotMarkers() {
    // turn off country markers
    if(typeof g_MarkersByCountry != 'undefined' ) {
        for(var i=0; i<g_MarkersByCountry.length; i++) {
            g_MarkersByCountry[i].setVisible(false);
        }
    }

    if(typeof g_Places != 'undefined') {
        // turn on spot markers
        for(var i=0; i< g_Places.length; i++) {
            g_Places[i]['Marker'].setVisible(true);
        }
    }
    if(g_InfoWindowOpened) {
        g_InfoWindowOpened.close();
    }
}

// display all country's markers and hide the others
function displayCountryMarkers() {
    if(typeof g_Places != 'undefined') {
        // turn off spot markers
        for(var i=0; i< g_Places.length; i++) {
            g_Places[i]['Marker'].setVisible(false);
        }
    }

    if(typeof g_MarkersByCountry != 'undefined' ) {
        // turn on country markers
        for(var i=0; i<g_MarkersByCountry.length; i++) {
            g_MarkersByCountry[i].setVisible(true);
        }
    }
    if(g_InfoWindowOpened) {
        g_InfoWindowOpened.close();
    }
}



google.maps.event.addDomListener(window, 'load', initialize);
