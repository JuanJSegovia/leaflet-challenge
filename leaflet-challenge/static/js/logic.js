const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(data => {
    createFeatures(data.features);
});

const myMap = L.map("map").setView([37.09, -95.71], 5); // Adjust latitude, longitude, and zoom as needed

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data &copy; OpenStreetMap contributors"
}).addTo(myMap);

function createFeatures(earthquakeData) {
    earthquakeData.forEach(feature => {
        const coords = feature.geometry.coordinates;
        const magnitude = feature.properties.mag;
        const depth = coords[2];  // Depth is the third coordinate

        L.circle([coords[1], coords[0]], {
            radius: magnitude * 20000,  // Adjust scale as necessary
            color: getColor(depth),
            fillOpacity: 0.75
        }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth} km</p>`)
        .addTo(myMap);
    });
}

function getColor(depth) {
    return depth > 90 ? "#800026" :    // Darkest red for deepest earthquakes
           depth > 70 ? "#BD0026" :
           depth > 50 ? "#E31A1C" :
           depth > 30 ? "#FC4E2A" :
           depth > 10 ? "#FD8D3C" :
                        "#FEB24C";    // Lightest red for shallowest earthquakes
}





// Define the legend as a Leaflet control
const legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
    const div = L.DomUtil.create("div", "info legend");
    const depths = [0, 10, 30, 50, 70, 90];  // Define depth intervals
    const colors = [
        "#FEB24C",  // Lightest red
        "#FD8D3C",
        "#FC4E2A",
        "#E31A1C",
        "#BD0026",
        "#800026"   // Darkest red
    ];

    // Add a title to the legend box if desired
    div.innerHTML += "<h4>Depth (km)</h4>";

    // Loop through the depth intervals and assign a color to each range
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            `<i style="background:${colors[i]}; width: 18px; height: 18px; display:inline-block; margin-right: 5px;"></i> ` +
            depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
    }

    return div;
};

// Add the legend to the map
legend.addTo(myMap);


function createFeatures(earthquakeData) {
    earthquakeData.forEach(feature => {
        const coords = feature.geometry.coordinates;
        const magnitude = feature.properties.mag;
        const depth = coords[2];  // Depth is the third coordinate
        const location = feature.properties.place;
        const date = new Date(feature.properties.time).toLocaleString();  // Convert timestamp to readable date

        // Create a circle marker for each earthquake
        L.circle([coords[1], coords[0]], {
            radius: magnitude * 20000,  // Scale marker size by magnitude
            color: getColor(depth),
            fillOpacity: 0.75
        })
        .bindPopup(
            `<h3>${location}</h3>
            <hr>
            <p><strong>Magnitude:</strong> ${magnitude}</p>
            <p><strong>Depth:</strong> ${depth} km</p>
            <p><strong>Date:</strong> ${date}</p>`
        )
        .addTo(myMap);
    });
}
