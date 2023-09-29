// GeoJSON data URL
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';

// Leaflet tile layer
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Leaflet map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [streets]
});

// Defining basemaps as streetmap
let baseMaps = {
    "Streets": streets
};

// Earthquake layer group
let earthquake_data = new L.LayerGroup();

// Adds a control layer
L.control.layers(baseMaps, { "Earthquakes": earthquake_data }).addTo(myMap);

// Earthquake point styling
function styleInfo(feature) {
    return {
        color: chooseColor(feature.geometry.coordinates[2]),
        radius: chooseRadius(feature.properties.mag), 
        fillColor: chooseColor(feature.geometry.coordinates[2]) 
    };
}

// Fill color of earthquake point by depth
function chooseColor(depth) {
    if (depth <= 10) return "purple";
    else if (depth <= 25) return "pink";
    else if (depth <= 40) return "yellow";
    else if (depth <= 55) return "orange";
    else if (depth <= 70) return "red";
    else return "white";
}

// Radius definition of each earthquake marker
function chooseRadius(magnitude) {
    return magnitude * 5;
}

// Earthquake data with D3 from the specified URL
d3.json(url).then(function (data) {
    // Adds earthquake data to the earthquake_data layergroup
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {
            return L.circleMarker(latlon).bindPopup(feature.id); 
        },
        style: styleInfo
    }).addTo(earthquake_data);
    earthquake_data.addTo(myMap);
});

// Creates legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Depth Color Legend</h4>";
    div.innerHTML += '<i style="background: purple"></i><span>(Depth < 10)</span><br>';
    div.innerHTML += '<i style="background: pink"></i><span>(10 < Depth <= 25)</span><br>';
    div.innerHTML += '<i style="background: yellow"></i><span>(25 < Depth <= 40)</span><br>';
    div.innerHTML += '<i style="background: orange"></i><span>(40 < Depth <= 55)</span><br>';
    div.innerHTML += '<i style="background: red"></i><span>(55 < Depth <= 70)</span><br>';
    div.innerHTML += '<i style="background: white"></i><span>(Depth > 70)</span><br>';

    return div;
};

// Adds the legend to the map
legend.addTo(myMap);
