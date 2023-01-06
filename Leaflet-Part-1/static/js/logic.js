let map = L.map('map').setView([40, -95], 4);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a color array for the depth levels.
depthColors = ["greenyellow", "yellow", "gold", "orange", "orangered", "red"]

function init() {
  d3.json(url).then(function (usgsAllWeek) {
      let earthquakeData = usgsAllWeek.features;
      for (i = 0; i < earthquakeData.length; i++) {

        // Create an object for each earthquake with only the info we'll need
        date = new Date(earthquakeData[i].properties.time);
        let coordinates = earthquakeData[i].geometry.coordinates.reverse();

        let earthquake = {
          place: earthquakeData[i].properties.place,
          date: (date.getMonth()+
                "/"+(date.getDate()+1)+
                "/"+date.getFullYear()+
                " "+date.getHours()+
                ":"+date.getMinutes()+
                ":"+date.getSeconds()),
          magnitude: earthquakeData[i].properties.mag,
          location: coordinates.slice(1,3),
          depth: coordinates.slice(0,1)
        }

        // Set the marker fill color according to depth
        let fillColor = "";
        if (earthquake.depth > 90) {
          fillColor = depthColors[5];
        } else if (earthquake.depth > 70) {
          fillColor = depthColors[4];
        } else if (earthquake.depth > 50) {
          fillColor = depthColors[3];
        } else if (earthquake.depth > 30) {
          fillColor = depthColors[2];
        } else if (earthquake.depth > 10) {
          fillColor = depthColors[1];
        } else {
          fillColor = depthColors[0];
        }

        // Create a marker for each earthquake object
        L.circle(earthquake.location, {
          fillOpacity: 0.75,
          color: "black",
          weight: 1,
          fillColor: fillColor,
          radius: earthquake.magnitude*10000
        }).bindPopup(`<h3>${earthquake.place}</h3>
                      <h3>${earthquake.date}</h3>
                      <hr>
                      <h4>Magnitude: ${earthquake.magnitude}</h4>
                      <h4>Depth: ${earthquake.depth}km</h4>
                      <h4>Latitude: ${earthquake.location[0]}°</h4>
                      <h4>Longitude: ${earthquake.location[1]}°</h4>`).addTo(map);
      }
  });

// Create a legend for depth coloring.
var info = L.control({
  position: "bottomright"
});

info.onAdd = function() {
  let div = L.DomUtil.create("div", "legend");
  return div;
};

info.addTo(map);

document.querySelector(".legend").innerHTML = [
  '<p><div style="width: 15px; height: 15px; background: ' + depthColors[0] + ';">&nbsp;</div> -10-10</p>',
  '<p><div style="width: 15px; height: 15px; background: ' + depthColors[1] + ';">&nbsp;</div> 10-30</p>',
  '<p><div style="width: 15px; height: 15px; background: ' + depthColors[2] + ';">&nbsp;</div> 30-50</p>',
  '<p><div style="width: 15px; height: 15px; background: ' + depthColors[3] + ';">&nbsp;</div> 50-70</p>',
  '<p><div style="width: 15px; height: 15px; background: ' + depthColors[4] + ';">&nbsp;</div> 70-90</p>',
  '<p><div style="width: 15px; height: 15px; background: ' + depthColors[5] + ';">&nbsp;</div> 90+</p>',
].join("");

};

init();