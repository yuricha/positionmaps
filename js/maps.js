/**
 * Created by Yuri on 26/05/2016.
 */


var path_coords = [{
    lat: -16.417672,
    lng: -71.517980
}, {
    lat: -16.411908,
    lng: -71.521075
}, {
    lat: -16.407502,
    lng: -71.524402
}, {
    lat: -16.405176,
    lng: -71.521638
}];

var path_bounds;
function initialize() {
    map_center = new google.maps.LatLng(-16.407009, -71.520284);
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        center: map_center,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapCanvas, mapOptions);
    addRoute(map);
}

function addMarker(label, location, map) {
    var marker = new google.maps.Marker({
        position: location,
        label: label,
        map: map
    });
}

function addRoute(map) {
    var lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
    };
    var flightPath = new google.maps.Polyline({
        path: path_coords,
        geodesic: true,
        icons: [{
            icon: lineSymbol,
            offset: '100%'
        }],
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    path_bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < path_coords.length; i++) {
        addMarker((i + 1).toString(), path_coords[i], map);
        path_bounds.extend(
            new google.maps.LatLng(
                path_coords[i].lat,
                path_coords[i].lng));
    }

    flightPath.setMap(map);
    resize();

    google.maps.event.addDomListener(window, 'resize',
        resize);
}

function resize() {
    map.setCenter(map_center);
    map.fitBounds(path_bounds);
}

initialize();