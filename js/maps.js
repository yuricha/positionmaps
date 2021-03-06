/**
 * Created by Yuri on 26/05/2016.
 */

var path_bounds;
var mapPosition =function(options,data){
	this.options=options;
    this.url=options.url;
    this.hostname=options.hostname;
    this.service=options.service;
    this.data = data;
    this.params = {header:null,body:null};
    this.markers =[];
    this.pathCoord=[];
    this.paginationPosition =0;
    this.update=true;
    this.events();
}
mapPosition.prototype.queryToken=function(){
    var date = this.convertDate(new Date());
    this.params = { body :{
		fecha:date,
        'trabajador':{ codigo:this.data.codigo}
		}        
    }
    var params = this.params;
    var $this = this;
    var ruta = this.hostname+this.service+this.url;
    /*
        $.ajax({
                data:  JSON.stringify(params),
                url:   ruta,
				dataType: 'json',
				contentType: 'application/json',
                type:  'post',
                beforeSend: function () {
                },
                success:  function (response) {
				    var data = response.body;
					if(data.visitacliente.length>0){
						$this.account= data.visitacliente;
					}
					$this.status();
                }
        });
    /**/

    $this.account= account.body.visitacliente;
    $this.status();
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

    var map_center = new google.maps.LatLng(-16.407009, -71.520284); //aqp
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

mapPosition.prototype.drawPoints = function(map){
    var arrayColor = [];
    //var legend = document.getElementById('legend');
    var legend = $('#legend-content');
    legend.html('');
    path_bounds = new google.maps.LatLngBounds();
    this.totalCoord = this.account.length;
    var account = this.account;
    $('.total').html('TOTAL: '+this.totalCoord);
    $('.actual').html('Actual: '+this.totalCoord);
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
            legend.append(div);
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

    //this.status();
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
	if(cliente.titular!==null) $('.titular').html(cliente.titular.nombres+','+cliente.titular.apellidos);
    
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
  
	var $this =this;
    /*
	var ruta = this.hostname+this.service+this.options.urlestadopreventa;
	        $.ajax({
                //data:  JSON.stringify(params),
                url:   ruta,
				dataType: 'json',
				contentType: 'application/json',
                type:  'get',
                beforeSend: function () {
                       
                },
                success:  function (response) {
						$('#idstatus').html('').append($('<option>', {
							value: 0,
							text : 'Todos'
						}));
					if(response.body.estadopreventa.length>0){
						$this.estadopreventa= response.body.estadopreventa;
						insetHtmlSelect('idstatus',response.body.estadopreventa);
						$this.price();
					
					}

                }
        });
    /**/

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
    this.estadopreventa=estadopreventa;
    this.price();
}
mapPosition.prototype.price= function () {
var $this =this;
    /*
		var ruta = this.hostname+this.service+this.options.urltipoprecio;
	        $.ajax({
                //data:  JSON.stringify(params),
                url:   ruta,
				dataType: 'json',
				contentType: 'application/json',
                type:  'get',
                beforeSend: function () {
                       
                },
                success:  function (response) {
                    console.log(response);
					$('#idtipoprecio').html('').append($('<option>', {
							value: 0,
							text : 'Todos'
					}));
					if(response.body.tipoprecio.length>0){
						$this.tipoprecio= response.body.tipoprecio;
						var tipoprecio = response.body.tipoprecio;
						//insetHtmlSelect('idtipoprecio',response.body.tipoprecio);
						for(var i in tipoprecio){
							$('#idtipoprecio').append($('<option>', {
								value: tipoprecio[i].codigo,
								text : tipoprecio[i].nombre
							}));
						}
						$this.morosidadLoad();
					}
                }
        });
    /**/
    this.morosidadLoad();
}
mapPosition.prototype.morosidadLoad= function () {

	var $this =this;
    /*
			var ruta = this.hostname+this.service+this.options.urlmorosidad;
	        $.ajax({
                //data:  JSON.stringify(params),
                url:   ruta,
				dataType: 'json',
				contentType: 'application/json',
                type:  'get',
                beforeSend: function () {
                       
                },
                success:  function (response) {
                        //console.log(response);
						$('#idmorosidad').html('').append($('<option>', {
							value: 0,
							text : 'Todos'
						}));
					if(response.body.estadomorosidad.length>0){
						$this.morosidad= response.body.estadomorosidad;
						insetHtmlSelect('idmorosidad',response.body.estadomorosidad);
						    if($this.update){
								$this.initialize();
							}
					}

                }
        });
    /**/
    this.initialize();
}

mapPosition.prototype.events = function(){
    $('.alert-info').unbind();
    $('.alert-info').click({OBJ:this},function(e){
        e.data.OBJ.resize(e.data.OBJ.map);
    });
    $('.alert-link').unbind();
    $('.alert-link').click({OBJ:this},function(e){
        e.data.OBJ.updateStatus();
    });
    $('#idstatus').unbind();
    $('#idstatus').change({OBJ:this},function(e) {
        e.data.OBJ.filter(this,'status');
    });
    $('#idtipoprecio').unbind();
    $('#idtipoprecio').change({OBJ:this},function(e) {
        e.data.OBJ.filter(this,'precio');
    });
    $('#idmorosidad').unbind();
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
    var find = 0;
    for (var i = 0; i < this.markers.length; i++) {
        var marker = this.markers[i];
        marker.setVisible(false);
        var type = this.markers[i].type;

        if(f1!==0){
            if(f2!==0){
                if(f3!==0){
                    if(f1===type.status&&f2===type.precio&&f3===type.morosidad){
                        marker.setVisible(true);
                        find++;
                    }
                }else{
                    if(f1===type.status&&f2===type.precio){
                        marker.setVisible(true);
                        find++;
                    }
                }
            }else{
                if(f3!==0){
                    if(f1===type.status&&f3===type.morosidad){
                        marker.setVisible(true);
                        find++;
                    }
                }else{
                    if(f1===type.status){
                        marker.setVisible(true);
                        find++;
                    }
                }

            }
        } else{
            if(f2!==0){
                if(f3!==0){
                    if(f2===type.precio&&f3===type.morosidad){
                        marker.setVisible(true);
                        find++;
                    }
                }else{
                    if(f2===type.precio){
                        marker.setVisible(true);
                        find++;
                    }
                }
            }else{
                if(f3!==0){
                    if(f3===type.morosidad){
                        marker.setVisible(true);
                        find++;
                    }
                }
            }
        }
        
    }
    $('#actual').html(find);
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

    var params = this.params;
    var $this = this;
    var ruta = this.hostname+this.service+this.url;
    $.ajax({
        data:  JSON.stringify(params),
        url:   ruta,
        dataType: 'json',
        contentType: 'application/json',
        type:  'post',
        beforeSend: function () {
        },
        success:  function (response) {
            //console.log(response);
            var data = response.body;
            if(data.visitacliente.length>0){
                $this.account= data.visitacliente;
            }
            $this.status();

        }
    });
/*
     $.post(this.urlStatus+'', params, function(_result){
     if(_result.success){
     }
     });
     /**/
	 /*
    this.clearMarkers();

    var data = account2.body;
    if(data.visitacliente.length>0){
        this.account= data.visitacliente;
    }
    this.markers=[];

    this.status();
    this.price();
    this.update=false;
    this.morosidadLoad();

    this.events();
    this.drawPoints(this.map);
	/**/
}

mapPosition.prototype.clearMarkers = function () {
    for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
