/**
 * Created by Yuri on 26/05/2016.
 */
    /*
    ,apagar ventana flotante en cambio de direccion,, sesion
     */
//var pinColor = "FE7569";

var account= [
    {
        codigo : 14,
        orden : 1,
        nombres : "CARMEN DOROTEA",
        apellidos : "AGUEDO URDAY",
        direccion : "MCDO.SAN CAMILO PTO.5 CERCADO",
        latitud : "-16.402472781080736",
        longitud : "-71.5349422768486",
        deudatotal : 0,
        lineacredito : 1000,
        titular : {
            codigo : 5,
            nombres : "OSCAR",
            apellidos : "GUZMAN"
        },
        tipoprecio : {
            codigo : 1
        },
        estadopreventa : {
            codigo : 1
        },
        morosidad : {
            codigo : 3
        },
        visitaclientedetalle : [
        ]
    },
    {
        codigo : 28,
        orden : 2,
        nombres : "GERARDO",
        apellidos : "AMBROSIO SUCASACA",
        direccion : "MCDO.ZAMACOLA PTO.21 C.COLORADO",
        latitud : "-16.35162272072182",
        longitud : "-71.56288016594772",
        deudatotal : 3500,
        lineacredito : 4000,
        titular : {
            codigo : 5,
            nombres : "OSCAR",
            apellidos : "GUZMAN"
        },
        tipoprecio : {
            codigo : 2
        },
        estadopreventa : {
            codigo : 2
        },
        morosidad : {
            codigo : 1
        },
        visitaclientedetalle : [
        ]
    },
    {
        codigo : 32,
        orden : 3,
        nombres : "REGINA",
        apellidos : "HANCO QUISPE",
        direccion : "MCDO.STA ROSA PTO.102 CONO SUR TACNA",
        latitud : "-16.398006919391225",
        longitud : "-71.53760433197021",
        deudatotal : 500,
        lineacredito : 1000,
        titular : {
            codigo : 5,
            nombres : "OSCAR",
            apellidos : "GUZMAN"
        },
        tipoprecio : {
            codigo : 1
        },
        estadopreventa : {
            codigo : 4
        },
        morosidad : {
            codigo : 2
        },
        visitaclientedetalle : [
        ]
    },
    {
        codigo : 34,
        orden : 4,
        nombres : "BERTHA REYNA",
        apellidos : "ANGELO GUTIERREZ",
        direccion : "AV AVIACION 203-A ZAMACOLA",
        latitud : "-16.354916051799975",
        longitud : "-71.56721331193694",
        deudatotal : 0,
        lineacredito : 0,
        titular : {
            codigo : 5,
            nombres : "OSCAR",
            apellidos : "GUZMAN"
        },
        tipoprecio : {
            codigo : 1
        },
        estadopreventa : {
            codigo : 1
        },
        morosidad : {
            codigo : 3
        },
        visitaclientedetalle : [
        ]
    }
]
/*
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
/**/
var path_bounds;
var mapPosition =function(options,data){
    this.url=options.url;
    this.data = data;
    this.params = {header:null,body:null};
    this.markers =[];
    this.events();
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

    this.status();
    this.price();
    this.morosidad();

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
    this.map=map;

    this.drawPoints(map);
}

mapPosition.prototype.drawPoints = function(){
    //var myArray = ["4387FD","03D4E5","E503C2","E51F03","E59203","C6E503"];
    var eventClick = [];
    var arrayColor = [];
    var legend = document.getElementById('legend');
    path_bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < account.length; i++) {
        //var pinColor = myArray[Math.floor(Math.random() * myArray.length)];
        var arrayObjectPosition = arrayObjectIndexOf(this.estadopreventa, account[i].estadopreventa.codigo, "codigo");

        var pinColor = this.estadopreventa[arrayObjectPosition].color;
        var path_coords ={lat:parseFloat(account[i].latitud) ,lng: parseFloat(account[i].longitud)};
        var type = {status:account[i].estadopreventa.codigo,precio:account[i].tipoprecio.codigo,morosidad:account[i].morosidad.codigo}
        this.addMarker(String(account[i].estadopreventa.codigo), path_coords, map,pinColor.substring(1),type,i);

        if(arrayColor.indexOf(arrayObjectPosition)==-1){
            arrayColor.push(arrayObjectPosition);
            var div = document.createElement('div');
            div.innerHTML = '<div  id='+i+' style="width :100px;background-color:'+pinColor+'"> '+account[i].estadopreventa.codigo+'&nbsp;</div>';
            legend.appendChild(div);
         /*   eventClick[i]= $('#'+i).click({OBJ:this,latlong:path_coords,map:map},function(e) {
                e.data.OBJ.selectMarker(e.data.latlong,e.data.map);
            });
            /**/
        }
        path_bounds.extend(
            new google.maps.LatLng(
                account[i].latitud,
                account[i].longitud));
        /**/
    }
    //flightPath.setMap(map);

    this.resize(map);
    google.maps.event.addDomListener(window, 'resize',this.resize);
    //map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

    //var container = document.getElementById('container-filter');
    //map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(container);

    /*----------------------material--------------------*/
    var material = document.getElementById('wrapper');
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(material);


    this.status();
}

mapPosition.prototype.addMarker= function (label,location,map,pinColor,type,i) {
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));

    var marker = new google.maps.Marker({
        position: location,
        label: label,// numeration
        map: map,
        icon: pinImage,
        //shadow: pinShadow
        type:type
        //type:type.status
        //type2:type.precio,
        //type3:type.morosidad
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
    this.markers[i]=marker;
}

mapPosition.prototype.selectMarker= function (obj , map) {
    map.setZoom(17);      //
    map.setCenter(new google.maps.LatLng(obj.lat,obj.lng));
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
}

mapPosition.prototype.resize= function (map) {
    map.setCenter(this.map_center);
    //show markers
 /*   for (var i = 0; i < this.markers.length; i++) {
        var marker = this.markers[i];
        if (!marker.getVisible()) {
            marker.setVisible(true);
        } else {
            marker.setVisible(false);
        }
    }
    /**/
    map.fitBounds(path_bounds);
    this.cleanFilter();

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
    $('#idstatus').html('').append($('<option>', {
        value: 0,
        text : 'Todos'
    }));
    insetHtmlSelect('idstatus',estadopreventa);
    //var pleaseWaitDiv = $('<div class="modal hide" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false"><div class="modal-header"><h1>Processing status...</h1></div><div class="modal-body"><div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div></div></div>');
    //pleaseWaitDiv.modal();
}
mapPosition.prototype.price= function () {
 var tipoprecio = [
        {
            codigo : 1,
            nombre : "ESPECIAL 1"
        },
        {
            codigo : 2,
            nombre : "CLIENTE VIP"
        },
        {
            codigo : 3,
            nombre : "MAYORISTA"
        },
        {
            codigo : 4,
            nombre : "MINORISTA"
        },
        {
            codigo : 5,
            nombre : "VETERINARIO"
        }
    ]
    this.tipoprecio= tipoprecio;
    $('#idtipoprecio').html('').append($('<option>', {
        value: 0,
        text : 'Todos'
    }));
    for(var i in tipoprecio){
        $('#idtipoprecio').append($('<option>', {
            value: tipoprecio[i].codigo,
            text : tipoprecio[i].nombre
        }));
    }
    //insetHtmlSelect('idtipoprecio',tipoprecio);
}
mapPosition.prototype.morosidad= function () {
var morosidad = [
        {
            codigo : 1,
            descripcion : "DEUDAS QUE SUPERAN LA FECHA DE VENCIMIENTO"
        },
        {
            codigo : 2,
            descripcion : "DEUDA NORMAL"
        },
        {
            codigo : 3,
            descripcion : "SIN DEUDA"
        },
    ]
    this.morosidad = morosidad;
    $('#idmorosidad').html('').append($('<option>', {
        value: 0,
        text : 'Todos'
    }));
    insetHtmlSelect('idmorosidad',morosidad);
    this.initialize();
}

mapPosition.prototype.events = function(){
    $('.alert-info').click({OBJ:this},function(e){
        e.data.OBJ.resize(e.data.OBJ.map);
    });
    $('#idstatus').change({OBJ:this},function(e) {
        e.data.OBJ.filter(this,'status');
    });
    $('#idtipoprecio').change({OBJ:this},function(e) {
        e.data.OBJ.filter(this,'precio');
    });
    $('#idmorosidad').change({OBJ:this},function(e) {
        e.data.OBJ.filter(this,'morosidad');
    });

    $('.prev').click({OBJ:this},function(e){
        e.data.OBJ.pagination();
    });
    $('.next').click({OBJ:this},function(e){
        e.data.OBJ.pagination();
    });
}
mapPosition.prototype.filter = function ($this,selectFilter) {
    var f1,f2,f3;
    var status = $('#idstatus');
    var precio = $('#idtipoprecio');
    var morosidad = $('#idmorosidad');
    switch(selectFilter) {
        case 'status':
            f1=$this.value;
            f2=precio.val();
            f3=morosidad.val();
            break;
        case 'precio':
            f1=status.val();
            f2=$this.value;
            f3=morosidad.val();
            break;
        case 'morosidad':
            f1=status.val();
            f2=precio.val();
            f3=$this.value;
            break;
    }
    if(parseInt(f1)===0&&parseInt(f2)===0&&parseInt(f3)===0) this.cleanFilter();
    else this.toggleGroup(parseInt(f1),parseInt(f2),parseInt(f3));

}
function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

function insetHtmlSelect(container,arrayList){
    for(var i in arrayList){
        $('#'+container).append($('<option>', {
            value: arrayList[i].codigo,
            text : arrayList[i].descripcion
        }));
    }
}
mapPosition.prototype.toggleGroup = function (f1,f2,f3){
    for (var i = 0; i < this.markers.length; i++) {
        var marker = this.markers[i];
        marker.setVisible(false);
        var type = this.markers[i].type;
        if(f1!==0){
            if(f2!==0){
                if(f3!==0){
                    if(f1===type.status&&f2===type.precio&&f3===type.morosidad) marker.setVisible(true);
                }else{
                    if(f1===type.status&&f2===type.precio) marker.setVisible(true);
                }
            }else{
                if(f3!==0){
                    if(f1===type.status&&f3===type.morosidad) marker.setVisible(true);
                }else{
                    if(f1===type.status) marker.setVisible(true);
                }

            }
        } else{
            if(f2!==0){
                if(f3!==0){
                    if(f2===type.precio&&f3===type.morosidad) marker.setVisible(true);
                }else{
                    if(f2===type.precio) marker.setVisible(true);
                }
            }else{
                if(f3!==0){
                    if(f3===type.morosidad) marker.setVisible(true);
                }
            }
        }

    }
}
mapPosition.prototype.cleanFilter = function () {
    for (var i = 0; i < this.markers.length; i++) {
        var marker = this.markers[i];
        if (!marker.getVisible()) {
            marker.setVisible(true);
        }
    }
}
mapPosition.prototype.pagination = function () {
    
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
