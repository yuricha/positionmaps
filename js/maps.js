/**
 * Created by Yuri on 26/05/2016.
 */
    /*
    ,apagar ventana flotante en cambio de direccion,, sesion
     */
//var pinColor = "FE7569";
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
var mapPosition =function(options,data){
    this.url=options.url;
    this.data = data;
    this.params = {header:null,body:null};
}
mapPosition.prototype.queryToken=function(){
    var date = this.convertDate(new Date());
    this.params.body = {
        fecha:date,
        codigo:this.data.codigo
    }
    var params = this.params;
    console.log(params);
   /* $.post(this.url+'', params, function(_result){
        if(_result.success){
        }
    });
    /**/
    this.initialize();

}
mapPosition.prototype.convertDate = function(inputFormat){
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}
mapPosition.prototype.drawLegend=function(){
    var legend = document.getElementById('legend');
    for (var key in icons) {
        var type = icons[key];
        var name = type.name;
        var icon = type.icon;
        var div = document.createElement('div');
        div.innerHTML = '<img src="' + icon + '"> ' + name;
        legend.appendChild(div);
    }

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
}

mapPosition.prototype.initialize = function () {
    //var data = {'codigo':5};
    //var options= {'url':'testurl'};
    //new mapPosition(options,data);

    var map_center = new google.maps.LatLng(-16.407009, -71.520284);
    this.map_center = map_center;
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        center: map_center,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapCanvas, mapOptions);
    this.drawPoints(map);
}

mapPosition.prototype.drawPoints = function(){
    var myArray = ["4387FD","03D4E5","E503C2","E51F03","E59203","C6E503"];
    var eventClick = [];
    var legend = document.getElementById('legend');
    path_bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < path_coords.length; i++) {
        var pinColor = myArray[Math.floor(Math.random() * myArray.length)];
        this.addMarker((i + 1).toString(), path_coords[i], map,pinColor);
        var div = document.createElement('div');

        div.innerHTML = '<div  id='+i+' style="width :100px;background-color:#'+pinColor+'"> ' +pinColor + '</div>';
        legend.appendChild(div);
        eventClick[i]= $('#'+i).click({OBJ:this,latlong:path_coords[i],map:map},function(e) {
            e.data.OBJ.selectMarker(e.data.latlong,e.data.map);
        });
        path_bounds.extend(
            new google.maps.LatLng(
                path_coords[i].lat,
                path_coords[i].lng));
    }
    //flightPath.setMap(map);
    this.resize(map);
    google.maps.event.addDomListener(window, 'resize',this.resize);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
    var container = document.getElementById('container-filter');
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(container);
    var container2 = document.getElementById('pleaseWaitDialog');
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(container2);
    this.status();
}

mapPosition.prototype.addMarker= function (label,location,map,pinColor) {
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));

    var marker = new google.maps.Marker({
        position: location,
        //label: label,// numeration
        map: map,
        icon: pinImage
        //shadow: pinShadow
    });

    var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">'+pinColor+'</h1>'+
        '<div id="bodyContent">'+
        '</div>'+
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
}

mapPosition.prototype.selectMarker= function (obj , map) {
    map.setZoom(17);      //
    map.setCenter(new google.maps.LatLng(obj.lat,obj.lng));
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
}

mapPosition.prototype.resize= function (map) {
    map.setCenter(this.map_center);
    map.fitBounds(path_bounds);
}


mapPosition.prototype.status= function () {
    var estadopreventa = [
        {
            codigo : 1,
            descripcion : "PENDIENTE DE VISITA",
            color : "#FAC905"
        },
        {
            codigo : 2,
            descripcion : "HIZO PEDIDO",
            color : "#FA0536"
        },
        {
            codigo : 3,
            descripcion : "NO HIZO PEDIDO : SIN STOCK",
            color : "#418716"
        },
        {
            codigo : 4,
            descripcion : "NO HIZO PEDIDO : SIN DINERO",
            color : "#2579CD"
        }
    ]
    this.estadopreventa = estadopreventa;
    var pleaseWaitDiv = $('<div class="modal hide" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false"><div class="modal-header"><h1>Processing status...</h1></div><div class="modal-body"><div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div></div></div>');
    pleaseWaitDiv.modal();
}
mapPosition.prototype.price= function () {

}
mapPosition.prototype.morosidad= function () {

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
