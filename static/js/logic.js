let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
    // createMarker(data.point)
});

function createFeatures(earthquakeData){
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Earthquake Location: ${feature.properties.place}</h3>
                        <hr><p>Earthquake Magnitude: ${feature.properties.mag}
                        <hr><p>Earthquake Latitude: ${feature.geometry.coordinates[0]}
                        <hr><p>Earthquake Longitude: ${feature.geometry.coordinates[1]}
                        <hr><p>Earthquake Depth: ${feature.geometry.coordinates[2]}`);       
    }        
    
    function pointToLayer(feature, latlng){
        var geojasonMarkerOptions = {
                radius: markerSize(feature.properties.mag),
                color: markerColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.5,
                stroke: false,
            }; 
        return L.circleMarker(latlng, geojasonMarkerOptions);
    } 
                        
    
    // let earthquakes = L.geoJSON(earthquakeData);
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });
    
    createMap (earthquakes);
}
// }

function markerSize(magnitude){
    return magnitude * 5;
}

function markerColor(depth){
    if (depth < 10) {return '#1a9850';}
    else if(depth < 30) {return '#91cf60';}
    else if(depth < 50) {return '#d9ef8b';}
    else if(depth < 70) {return '#fee08b';}
    else if(depth < 90) {return '#fc8d59';}
    else {return '#d73027';}
    // return depth < 10 ? '#FEB24C':
    //         depth < 30 ? '#FD8D3C':
    //         depth < 50 ? '#FC4E2A':
    //         depth < 70 ? '#E31A1C':
    //         depth < 90 ? '#FEB24C':
    //         '#FFEDA0';
}

function createMap(earthquakes) {

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

    let baseMaps = {
        'Street Map': street,
        'Topographic Map': topo
    };

    let overlayMaps = {
        Earthquakes: earthquakes
    };

    let myMap = L.map('map', {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map){
        var div = L.DomUtil.create('div', 'info legend'),
            ranges = [0, 10, 30, 50, 70, 90],
            labels = [];

            for (var i =0; i<ranges.length; i++){
                div.innerHTML +=
                    '<i style= "background:' + markerColor(ranges[i] + 1) + '"></i> ' +
                    ranges[i] + (ranges[i + 1] ? '&ndash;' + ranges[i + 1] + '<br>' : '+');
            }
            return div;
    }

    legend.addTo(myMap);

}
