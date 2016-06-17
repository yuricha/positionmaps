/**
 * Created by Yuri on 26/05/2016.
 */
    /*

     */
var accountold= [
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

var path_bounds;
var mapPosition =function(options,data){
    this.url=options.url;
    this.data = data;
    this.params = {header:null,body:null};
    this.markers =[];
    this.pathCoord=[];
    this.paginationPosition =0;
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
    var mydata = account;
    console.log(mydata);
   /* $.post('account.json', params, function(_result){
        console.log(_result);
        if(_result.success){
        }
    });
    /**/

   // this.status();
   // this.price();
   // this.morosidad();

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

    //var map_center = new google.maps.LatLng(-16.407009, -71.520284); //aqp
    var map_center = new google.maps.LatLng(-12.069900, -77.122142); //callao
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
    var arrayColor = [];
    var legend = document.getElementById('legend');
    path_bounds = new google.maps.LatLngBounds();
    this.totalCoord = account.length;
    this.account = account;
    $('.total').html('TOTAL: '+this.totalCoord);
    for (var i = 0; i < account.length; i++) {
        //var pinColor = myArray[Math.floor(Math.random() * myArray.length)];
        var arrayObjectPosition = arrayObjectIndexOf(this.estadopreventa, account[i].estadopreventa.codigo, "codigo");

        var pinColor = this.estadopreventa[arrayObjectPosition].color;
        var path_coords ={lat:parseFloat(account[i].latitud) ,lng: parseFloat(account[i].longitud)};
        var type = {pos:i,status:account[i].estadopreventa.codigo,precio:account[i].tipoprecio.codigo,morosidad:account[i].morosidad.codigo,$this:this};
        this.addMarker(String(account[i].estadopreventa.codigo), path_coords, map,pinColor.substring(1),type,i);
        this.pathCoord[i]=path_coords;
        if(arrayColor.indexOf(arrayObjectPosition)==-1){
            arrayColor.push(arrayObjectPosition);
            var div = document.createElement('div');
            div.innerHTML = '<div  id='+i+' style="width :100px;background-color:'+pinColor+'"> '+account[i].estadopreventa.codigo+'&nbsp;</div>';
            legend.appendChild(div);
        }
        path_bounds.extend(
            new google.maps.LatLng(
                account[i].latitud,
                account[i].longitud));
    }
    //flightPath.setMap(map);

    this.resize(map);
    google.maps.event.addDomListener(window, 'resize',this.resize);

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
    marker.addListener('click', function(e) {
        //infowindow.open(map, marker);
        //e.data.OBJ.loadInfoWindow(e.data.pos);
        marker.type.$this.loadInfoWindow(marker);
    });
    this.markers[i]=marker;
}

mapPosition.prototype.loadInfoWindow = function (marker) {
    var cliente = this.account[marker.type.pos];
    $('.cliente').html('Cliente: '+cliente.nombres+','+cliente.apellidos);
    $('.direccion').html(cliente.direccion);
    $('.orden').html(cliente.orden);
    $('.deuda').html(cliente.deudatotal);
    $('.titular').html(cliente.titular.nombres+','+cliente.titular.apellidos);
    $('.credito').html(cliente.lineacredito);


    $('.precio').html(this.tipoprecio[arrayObjectIndexOf(this.tipoprecio, cliente.tipoprecio.codigo, "codigo")].nombre);
    $('.estado').html(this.estadopreventa[arrayObjectIndexOf(this.estadopreventa, cliente.estadopreventa.codigo, "codigo")].descripcion);

    $('.morosidad').html(this.morosidad[arrayObjectIndexOf(this.morosidad, cliente.morosidad.codigo, "codigo")].descripcion);
    $('#modalmpas').modal('show');

}

mapPosition.prototype.selectMarker= function (obj , map) {
    map.setZoom(17);      //
    map.setCenter(new google.maps.LatLng(obj.lat,obj.lng));
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
}

mapPosition.prototype.resize= function (map) {
    map.setCenter(this.map_center);
    //show markers
    map.fitBounds(path_bounds);
    this.cleanFilter();
    this.bindCustom();
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
    this.bindCustom();
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
    if(parseInt(f1)===0&&parseInt(f2)===0&&parseInt(f3)===0){
        this.cleanFilter();
        this.bindCustom();
    } else{
        this.unbindCustom();
        this.toggleGroup(parseInt(f1),parseInt(f2),parseInt(f3));
    }

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
    $('#idstatus').val(0);
    $('#idtipoprecio').val(0);
    $('#idmorosidad').val(0);
    $('#position').html(0);
    this.paginationPosition =0;
}
mapPosition.prototype.pagination = function (action) {
    var pos = 0;
    var total = this.totalCoord;
    if(this.paginationPosition<=total){
        if(action==1)pos = this.paginationPosition+ 1;
        else{
            if(this.paginationPosition==0){
                pos = this.totalCoord;
            }else{
                if(this.paginationPosition==1) pos = total;
                else pos = this.paginationPosition -1;
            }
        }
    }

    if(total>=pos)this.paginationPosition=pos;
    else{
        pos =1;
        this.paginationPosition=pos;
    }
    this.selectMarker(this.pathCoord[pos-1],this.map);
    $('#position').html(pos);
}

mapPosition.prototype.unbindCustom = function () {
    $('.prev').unbind();
    $('.next').unbind();
}
mapPosition.prototype.bindCustom = function (){
    $('.prev').unbind();
    $('.prev').click({OBJ:this},function(e){
        e.data.OBJ.pagination(0);
    });
    $('.next').unbind();
    $('.next').click({OBJ:this},function(e){
        e.data.OBJ.pagination(1);
    });
}
mapPosition.prototype.updateStatus = function (){

     $.post(this.urlStatus+'', params, function(_result){
     if(_result.success){
     }
     });
     /**/
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
