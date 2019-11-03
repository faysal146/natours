/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.location);
console.log(locations);
mapboxgl.accessToken = 'pk.eyJ1IjoiZmF5c2FsMTQ2IiwiYSI6ImNrMmh5anozNjBkM3MzZG1yYzE1OW9qZjQifQ.tb0ejnVyXrW6DTlx56Fy0A';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/faysal146/ck2hzch8a2evq1co5selhqn7x',
    scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    const el = document.createElement('div');
    el.className = 'marker';
    // add marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    })
        .setLngLat(loc.coordinates)
        .addTo(map);
    // add popup
    new mapboxgl.Popup({
        offset: 30
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>${loc.day} : ${loc.description}</p>`)
        .addTo(map);

    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        left: 100,
        bottom: 150,
        right: 100
    }
});
