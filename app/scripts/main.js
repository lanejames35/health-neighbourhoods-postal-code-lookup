L.Icon.Default.imagePath = 'images/';
// Neighbourhood geometries from open data
/* create leaflet map */
var map = L.map('map').setView([43.898206, -78.940707], 9);
/* add default OSM tile layer */
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	minZoom: 0,
	maxZoom: 18,
	attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
}).addTo(map);
// Create the custom dialog to show the neighbourhood name
var info = L.control();
info.onAdd = function() {
	this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	this.update();
	return this._div;
};
// method that we will use to update the control based on feature properties passed
info.update = function(props) {
	this._div.innerHTML = '<h4>Neighbourhood name</h4>' +  (props ?
		'<b>' + props.COMMON_NAME + '</b>' : 'Hover over a neighbourhood');
};
// add the information controller
info.addTo(map);

// Highlight the area when hovered
function highlightFeature(e) {
	var layer = e.target;
	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});
	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
	info.update(layer.feature.properties);
}

var hnLayer;
// Reset the highlight when the mouse is moved out
function resetHighlight(e) {
	hnLayer.resetStyle(e.target);
	info.update();
}
// Zoom in on the neighbourhood when clicked
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}
function onEachFeature(feature, layer){
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}
// Create the neighbourhood geoJSON layer
hnLayer = L.geoJSON(hn, { onEachFeature: onEachFeature }).addTo(map);
