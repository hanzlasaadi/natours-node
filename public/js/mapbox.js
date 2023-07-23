/* eslint-disable */
console.log('Helloooooo..... from the client side');
const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiaGFuemxhc2FhZGkiLCJhIjoiY2xrZnRvZTZzMjE1MjNldGpnbWR5cjltNCJ9.GTz4_41yl2dQ_qh23ILLKw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/hanzlasaadi/clkftzvu3004o01qyab2n124m',
  scrollZoom: false
  // center: [-118.33078, 34.05418],
  // zoom: 10,
  // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  const el = document.createElement('div');
  el.className = 'marker';

  new mapboxgl.Marker(el)
    .setLngLat(loc.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h3>Day ${loc.day}</h3><p>${loc.description}</p>`
      )
    )
    .addTo(map);

  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: 150
});
