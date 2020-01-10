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
info.setPosition('bottomright').addTo(map);

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
	console.log("the mouse is in");
	info.update(layer.feature.properties);
}

var hnLayer, fsaLayer;
// Reset the highlight when the mouse is moved out
function resetHighlight(e) {
	hnLayer.resetStyle(e.target);
	info.update();
	console.log("the mouse is out");
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
// Create the FSA layer
fsaLayer = L.geoJSON(fsa, {
	style: function() {
		const colours = ['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02'];
		const idx = Math.floor(Math.random() * 6);
		return { color: colours[idx], fill: true };
	},
	onEachFeature: function(feature, layer){
		layer.bindTooltip(layer.feature.properties.FSA, { sticky: true, interactive: true });
		layer.on({
			mouseover: function(e){
				e.target.openTooltip();
				console.log("Mouseover");
			},
			mouseout: function(e){
				e.target.closeTooltip();
				console.log("Mouse is out");
			},
			click: function(e){
				e.target.toggleTooltip();
				e.target.bringToFront();
			}
		})
	}
}).addTo(map);
// Create the neighbourhood geoJSON layer
hnLayer = L.geoJSON(hn, { onEachFeature: onEachFeature }).addTo(map);

/*
 * Layer toggle control
 */
const overlays = {
	"Postal Code": fsaLayer,
	"Health Neighbourhood": hnLayer
};
L.control.layers(false, overlays).addTo(map);
