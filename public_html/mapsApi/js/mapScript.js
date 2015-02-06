var map;
var lastClicked;
var weatherLayer;
var infowindow = [];
var marker = [];
var isAddingPolygon;
var requestedAreaColor;
var requestedAreaCoords = [];
var userDrawnAreas = []
var customArea;

function initialize() {
    var mapCanvas = document.getElementById('map-canvas');
    var mapOptions = {
        center: new google.maps.LatLng(51.5020117, -0.1402181),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        disableDefaultUI: true
    }
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    addLondonMarks();
    google.maps.event.addListener(map, 'click', function(e) {
        lastClicked = e.latLng;
        if (isAddingPolygon) {
            addPolygonNode(e.latLng);
        }
    });

    google.maps.event.addListener(map, 'dblclick', function(e) {
        constructArea();
    });
}

function introduceArea()
{

	// Center map first
    var mapOptions = {
        center: new google.maps.LatLng(51.5020117, -0.1402181),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        disableDefaultUI: true
    }

    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);


	 drawTimedInfoBox("<h6>London</h6>", 4000,  51.4892266, -0.1052487);
	 drawTimedInfoBox("<h6>Kingston Upon Thames</h6>", 4000,  51.4103, -0.2995);
	 drawTimedInfoBox("<h6>Heathrow Airport</h6>", 4000,  51.4775, -0.4614);

	 window.setTimeout(function() {
      	smoothZoom(map, 15, map.getZoom());
      	drawTimedInfoBox("<h6>Westminster Bridge</h6>", 5000,  51.5008, -0.1219);
       	drawTimedInfoBox("<h6>Horse Guards Parade</h6>", 5000,  51.5047, -0.1283);
      	drawTimedInfoBox("<h6>Hyde Park</h3>", 5000,  51.5086, -0.1636);       	      	     	      	
    }, 4000);

	 window.setTimeout(function() {
      	smoothZoom(map, 17, map.getZoom());
		drawTimedInfoBox("<h6>Green Park</h6><br><img src=\"http://upload.wikimedia.org/wikipedia/en/6/66/Green_Park,_London,_England_and_Constitution_Hill.jpg\" height=\"90\" width=\"90\">", 6000, 51.5037091, -0.1438467);
		drawTimedInfoBox("<h6>Palace of Westminster</h6><br><img src=\"http://i.imgur.com/0mhNx19.jpg\" height=\"90\" width=\"90\">", 6000, 51.4992, -0.1247);	
		drawTimedInfoBox("<h6>Westminster Abbey</h6><br><img src=\"http://upload.wikimedia.org/wikipedia/commons/4/47/Westminster-Abbey.JPG\" height=\"90\" width=\"90\">", 6000, 51.4994, -0.1275);		
			
    }, 9000);

	 window.setTimeout(function() {
      	smoothZoom(map, 19, map.getZoom());
       	drawTimedInfoBox("<h6>Buckingham Palace</h6><br><iframe width=\"150\" height=\"150\" src=\"https://www.youtube.com/embed/p8Y8rhLirRw?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>", 20000, 51.5013077, -0.1418893);      
		drawTimedInfoBox("<h6>Victoria Memorial Fountain</h6><br><iframe width=\"150\" height=\"150\" src=\"https://www.youtube.com/embed/0tlMmlvj6ok?autoplay=1\" frameborder=\"0\" allowfullscreen></iframe>", 20000, 51.5018056, -0.1406124);
      	drawTimedInfoBox("<h6>St Jame's Park</h3><br><iframe width=\"150\" height=\"150\" src=\"https://www.youtube.com/embed/ADGaITO4am8?autoplay=1\" frameborder=\"0\" allowfullscreen>", 20000,  51.5016999, -0.1374928);
      	drawTimedInfoBox("<h6>The Mall</h3><br><iframe width=\"150\" height=\"150\" src=\"https://www.youtube.com/embed/6uXdIaAOELE?autoplay=1\" frameborder=\"0\"  allowfullscreen>", 20000,  51.5026566, -0.1385664);       	      	     	      	      	       	      	     	      			             		      	
    }, 15000);	 
}

function drawTimedInfoBox(html, time, latitude, longitude)
{


  var infoBox = new google.maps.InfoWindow({
        content: html
    });

  var point = new google.maps.LatLng(latitude, longitude);

  var marker = new google.maps.Marker({
      position: point,
      map: map,
  });

  infoBox.open(map, marker);

  window.setTimeout(function() {
      	infoBox.close();
      	marker.setMap(null);
    }, time);


}

// Sesmi-Smooth Zoom Code, Thanks to Herman Schaaf at SO ~ http://stackoverflow.com/questions/4752340/how-to-zoom-in-smoothly-on-a-marker-in-google-maps
function smoothZoom (map, max, cnt) {
    if (cnt >= max) {
            return;
        }
    else {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 1);
        });
        setTimeout(function(){map.setZoom(cnt)}, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
}  



function constructArea() {
    isAddingPolygon = false;
    polygon = new google.maps.Polygon({
        paths: requestedAreaCoords,
        strokeColor: requestedAreaColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: requestedAreaColor,
        fillOpacity: 0.35
    });

    for (i=0; i < requestedAreaCoords.length; i++)
    {
        var longitude = requestedAreaCoords[i].lng();
        var latitude = requestedAreaCoords[i].lat();
        var text = "<iframe src=\"https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d9939.84408209225!2d"+longitude.toString()+"!3d"+latitude.toString()+"!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2suk!4v1422932436441\" width=\"600\" height=\"450\" frameborder=\"0\" style=\"border:0\"></iframe>";

    	drawPolygonalNodeMarker(requestedAreaCoords[i], text);
    }

    drawCentralMarker(requestedAreaCoords);

    userDrawnAreas.push(polygon);
    requestedAreaCoords = [];
    polygon.setMap(map);
}

function addPolygonNode(position) {
    requestedAreaCoords.push(position);
}

function addLondonMarks() {

    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=info|0066FF",
        new google.maps.Size(34, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));

    createMarker(pinImage, 51.5008, -0.1247, "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/yjY7ICwDQ2Y\" frameborder=\"0\" allowfullscreen></iframe><br><h3>Big Ben</h3><br>Big Ben is the nickname for the Great Bell of the clock at the north end of the Palace of Westminster in London, and often extended to refer to the clock and the clock tower<br><a href=http://en.wikipedia.org/wiki/Big_Ben>Click here to read more</a>");

    createMarker(pinImage, 51.5033, -0.1197, "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/SXk-7tA21Kw\" frameborder=\"0\" allowfullscreen></iframe><br><h3>London Eye</h3><br>The London Eye is a giant Ferris wheel on the South Bank of the River Thames in London. Also known as the Millennium Wheel, its official name was originally published as the British Airways London Eye, then the Merlin Entertainments London Eye, then the EDF Energy London Eye. Since mid-January 2015 it has been known in branding as the Coca-Cola London Eye, following an agreement signed in September 2014.<br><a href=http://en.wikipedia.org/wiki/London_Eye>Click here to read more</a>");

    createMarker(pinImage, 51.5010, -0.1416, "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/xqLk-HVStQg\" frameborder=\"0\" allowfullscreen></iframe><br><h3>Buckingham Palace</h3><br>Buckingham Palace is the London residence and principal workplace of the monarchy of the United Kingdom. Located in the City of Westminster, the palace is often at the centre of state occasions and royal hospitality. It has been a focus for the British people at times of national rejoicing.<br><a href=http://en.wikipedia.org/wiki/Buckingham_Palace>Click here to read more</a>");
}

function drawPolygonalNodeMarker(point, html) {
    var newmarker = new google.maps.Marker({
        position: point,
        map: map,
        title: html
    });

    newmarker['infowindow'] = new google.maps.InfoWindow({
        content: html
    });

    google.maps.event.addListener(newmarker, 'click', function() {
        this['infowindow'].open(map, this);
    });

    marker.push(newmarker);
}

function drawCentralMarker(points)
{
	var latitude =0; 
	var longitude =0; 
    for (i=0; i < points.length; i++)
    {
        pointsLang = points[i].lng();
        pointsLat = points[i].lat();
    	latitude = latitude + pointsLat;
    	longitude = longitude + pointsLang; 
    }	 

    latitude = latitude/points.length;
    longitude = longitude/points.length; 
    var text = "<iframe src=\"https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d9939.84408209225!2d"+longitude.toString()+"!3d"+latitude.toString()+"!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2suk!4v1422932436441\" width=\"600\" height=\"450\" frameborder=\"0\" style=\"border:0\"></iframe>";

    drawPolygonalNodeMarker(new google.maps.LatLng(latitude, longitude), text);

}

function createMarker(icon, latitude, longitude, html) {
    var point = new google.maps.LatLng(latitude, longitude);

    var newmarker = new google.maps.Marker({
        icon: icon,
        position: point,
        map: map,
        title: html
    });

    newmarker['infowindow'] = new google.maps.InfoWindow({
        content: html
    });

    google.maps.event.addListener(newmarker, 'click', function() {
        this['infowindow'].open(map, this);
    });

    marker.push(newmarker);
}

function magnify(requestedZoom) {
    var zoomLevel = map.getZoom();

    var mapOptions = {
        center: map.getCenter(),
        zoom: zoomLevel + requestedZoom,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        disableDefaultUI: true
    }
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

function setAreaColour() {
    isAddingPolygon = true;
    requestedAreaColor = document.getElementById("selectedCustomPlacedAreaColour").value;
}



function addCustomWeather() {
    weatherLayer = new google.maps.weather.WeatherLayer();
    weatherLayer.setMap(map);
}

function navigate_to_coords() {
    var latitude = document.getElementById("requestedLatitude").value;
    var longitude = document.getElementById("requestedLongitude").value;
    var center = new google.maps.LatLng(latitude, longitude);

    map.panTo(center);
}

function addCustomMarkers() {
    var pinImage;
    var number = document.getElementById("selectedCustomPlacedMarkerNumber").value;
    var selectedMarker = document.getElementById("selectedCustomPlacedMarker").value;
    var selectedColour = document.getElementById("selectedCustomPlacedMarkerColour").value;

    if (selectedColour == null) {
        selectedColour = FFFFFF;
    }

    if (number != "none") {
        var pinImage = new google.maps.MarkerImage(number + selectedColour,
            new google.maps.Size(34, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34));
    } else {
        var pinImage = new google.maps.MarkerImage(selectedMarker + selectedColour,
            new google.maps.Size(34, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34));

    }


    var marker = new google.maps.Marker({
        position: lastClicked,
        icon: pinImage,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: name
    });

}

function addMarkers() {
    var pinImage;
    var longitude = document.getElementById("requestedMarkerLatitude").value;
    var latitude = document.getElementById("requestedMarkerLongitude").value;
    var number = document.getElementById("selectedMarkerNumber").value;
    var selectedMarker = document.getElementById("selectedMarker").value;
    var point = new google.maps.LatLng(longitude, latitude);
    var selectedColour = document.getElementById("selectedMarkerColour").value;

    if (selectedColour == null) {
        selectedColour = FFFFFF;
    }

    if (number != "none") {
        var pinImage = new google.maps.MarkerImage(number + selectedColour,
            new google.maps.Size(34, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34));
    } else {
        var pinImage = new google.maps.MarkerImage(selectedMarker + selectedColour,
            new google.maps.Size(34, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34));

    }


    var marker = new google.maps.Marker({
        position: point,
        icon: pinImage,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: name
    });
}




// Prompt to show bootstrap modal for co-ords
$('#coordsPrompt').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget)
    var recipient = button.data('whatever')
    var modal = $(this)
    modal.find('.modal-title').text('New message to ' + recipient)
    modal.find('.modal-body input').val(recipient)
})