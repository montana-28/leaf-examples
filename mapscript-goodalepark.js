const map = L.map('map', { 
    center: [39.97521, -83.00678], // Goodale Park extent
    zoom: 17                  // -- NEW
});

const streets = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, 
    attribution: 'Tiles &copy; Esri'
}).addTo(map);   // on by default

const topo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, 
    attribution: 'Tiles &copy; Esri'
});

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, 
    attribution: 'Tiles &copy; Esri'
});

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})
// Polylines
const buttles_ave = [
    [39.977376, -83.009056],
    [39.977236, -83.005161]
];

const park_street = [
    [39.977236, -83.005161],
    [39.973643, -83.004528]
];

//Polygons
const tennis_courts = [
    [39.976563, -83.008799],
    [39.975906, -83.008829],
    [39.975889, -83.008480],
    [39.976534, -83.008442]
];
const pickleball_courts = [
    [39.975825, -83.007752],
    [39.975557, -83.007752],
    [39.975528, -83.007403],
    [39.975825, -83.007395]
];

//Points
const groupPond = [
    { name: "Pond Point 1", coords: [39.976830, -83.006030] },
    { name: "Pond Point 2", coords: [39.976551, -83.005431] }
];
const groupPlay = [
    { name: "Playground", coords: [39.974639, -83.007852] },
    { name: "Basketball Court", coords: [39.974416, -83.007778] }
];

const groupQazebo = [
    { name: "Gazebo", coords: [39.976085, -83.005594] },
    { name: "Lincoln Goodale Monument", coords: [39.974494, -83.005480] }
];



function svgIcon(color) {
    return L.divIcon({
        className: 'poi-icon',
        html: `
            <svg width="25" height="32" viewBox="0 0 25 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 0C5.6 0 0 5.6 0 12.5 0 21.5 12.5 32 12.5 32S25 21.5 25 12.5C25 5.6 19.4 0 12.5 0z"
                    fill="${color}" stroke="#1c2b24" stroke-width="1"/>
                <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
            </svg>`,
        iconSize:    [25, 32],  // match SVG's width/height
        iconAnchor:  [12, 32],  // the pinpoint — where the actual coordinate is at
        popupAnchor: [0, -28]   // where a popup opens relative to iconAnchor
    });
}

const groupQazebo_color    = '#a6531c';
const groupPlay_color = '#1fbf78';
const groupPond_color   = '#1f78bf'

// 1. Make 3 layer groups for the points

const Playground = L.layerGroup(
    groupPlay.map(f =>
        L.marker(f.coords, { icon: svgIcon(groupPlay_color) })
            .bindPopup(`<strong>${f.name}</strong>`)
    )
).addTo(map);

const Pond = L.layerGroup(
    groupPond.map(f =>
        L.marker(f.coords, { icon: svgIcon(groupPond_color) })
            .bindPopup(`<strong>${f.name}</strong>`)
    )
).addTo(map);

const Qazebo = L.layerGroup(
    groupQazebo.map(f =>
        L.marker(f.coords, { icon: svgIcon(groupQazebo_color) })
            .bindPopup(`<strong>${f.name}</strong>`)
    )
).addTo(map);

// 2. Create one layer group for all streets
const goodaleStreetsLayer = L.layerGroup([
    L.polyline(park_street, { color: '#a6531c', weight: 4 }),
    L.polyline(buttles_ave, { color: '#a6531c', weight: 4 })
]);

// 3. Create one layer group for all buildings
const polygon_style = {color: '#1f6f78', fillColor: '#1f6f78', fillOpacity: 0.25};

const buildingLayer = L.layerGroup([
    L.polygon(tennis_courts, polygon_style).bindTooltip('Tennis Courts', { direction: 'top', offset: [0, -8]}),
    L.polygon(pickleball_courts, polygon_style).bindTooltip("Pickleball Courts"),
])

// 4. Create the control with all layers

const radar = L.tileLayer.wms('https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi', {
    layers: 'nexrad-n0r',
    format: 'image/png',
    transparent: true,
    attribution: 'Weather data &copy; Iowa Environmental Mesonet'
}).addTo(map);
L.control.layers(
    { "Streets": streets, "Topographic": topo, "Satellite": satellite, "OpenStreetMap": osm },
    { "Goodale Streets": goodaleStreetsLayer, "Goodale Courts": buildingLayer, "Pond Points": Pond,
        "Playground Points": Playground, "Gazebo Points": Qazebo, "Radar": radar }
).addTo(map);