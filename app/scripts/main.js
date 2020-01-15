L.Icon.Default.imagePath = 'images/';
// Neighbourhood geometries from open data
/* create leaflet map */
var map = L.map('map').setView([43.898206, -78.940707], 9);
/* add default OSM tile layer */
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	minZoom: 0,
	maxZoom: 18,
	attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a> | Postal Code data © Canada Post Corporation'
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
		'<b>' + props.COMMON_NAME + '</b>' : 'Hover a neighbourhood border');
};
// add the information controller
info.setPosition('bottomright').addTo(map);

// Create the FSA layer
const fsaLayer = L.geoJSON(fsa, {
	style: function() {
		return { color: '#d95f02', fill: true };
	},
	onEachFeature: function(feature, layer){
		layer.bindTooltip(layer.feature.properties.FSA, { sticky: true, interactive: true });
		layer.on({
			mouseover: function(e){
				e.target.openTooltip();
			},
			mouseout: function(e){
				e.target.closeTooltip();
			},
			click: function(e){
				e.target.bringToFront();
			}
		})
	}
}).addTo(map);
// Create the neighbourhood geoJSON layer
const hnLayer = L.geoJSON(hn, {
	style: function(){
		return { color: '#3388ff', fill: false};
	},
	onEachFeature: function(feature, layer){
		layer.on({
			mouseover: function(e){
				const currentColour = (e.target.options.color == '#1eb300' ? '#1eb300' : '#666');
				layer.setStyle({
					weight: 5,
					color: currentColour,
				});
				info.update(layer.feature.properties);
			},
			mouseout: function(e){
				const currentColour = (e.target.options.color == '#1eb300' ? '#1eb300' : '#3388ff');
				layer.setStyle({
					weight: 3,
					color: currentColour
				});
				info.update();
			},
			click: function(e){
				const currentColour = (e.target.options.color == '#1eb300' ? '#666' : '#1eb300');
				layer.setStyle({
					color: currentColour
				});
				layer.bringToFront();
			}
		})
	}
}).addTo(map);

/*
 * Layer toggle control
 */
const overlays = {
	"Postal Code": fsaLayer,
	"Health Neighbourhood": hnLayer
};
L.control.layers(false, overlays).addTo(map);
