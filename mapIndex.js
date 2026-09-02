const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var map =  new maplibregl.Map({
    container: 'map', // container id
    //style: 'https://tiles.openfreemap.org/styles/positron', // style URL
    style: {
        version: 8,
        sources: {
        "raster-tiles": {
            type: "raster",
            tiles: [
            "https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            "https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            "https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            ],
            tileSize: 256,
        },
        },
        layers: [{ id: "raster-layer", type: "raster", source: "raster-tiles" }],
    },
    center: [-99.3259763,39.755925], // starting position [lng, lat]
    zoom: 5, // starting zoom
    maplibreLogo: false,
    doubleClickZoom: false
});

// constanst
const MAX_VISABLE_UPDATE = 15; /// maximum zoom before stop updating agencies
const SCREEN_MARGIN_EXTENTION = 0.01; /// the exta to add to screen display

let agency_database = new AgencyDatabase();

let clickedVehicle = null;

let mappedVehicles = null; // for caching vehicles

// layers and layer controll
let vehicleLayer = new MarkerGroup();

// display controls for transit and passenger
let transitVehicleLayer = new VehicleMarkerLayer(22, 10.5);
let passengerVehicleLayer = new VehicleMarkerLayer(22, 8.5);

let stopLayer = new StopLayer();

let stopInfoLayer = new StopInfoLayer();
let stopInfoController = new LayerToggleController(22, 14.5, stopInfoLayer)
let stopAlertsLayer = new StopAlertsLayer();
let stopAlertsController = new LayerToggleController(22, 16.5, stopAlertsLayer)
let routeLayer = new RouteLayer();
let vehiclePopup = new VehiclePopup();

let settingsData = {
	"bus_icon_layout":{
		"top":"num",
        "bottom":"vid"
	},
	"hide_stale":false,
    "stale_time_sec": 10,
	"display_onlyonroute":false,
	"display_bearing": true
}

// ui stuff
let uiOverlay = new MapOverlay;
let settingsUI = new SettingContent("settings_content");
let scheduleUI = new ScheduleContent("schedule_content");
let locationUI = new LocationContent("location_content");
let alertsUI = new AlertsContent("alerts_content");

// control buttons
map.addControl(new maplibregl.GeolocateControl({positionOptions: {enableHighAccuracy: true},trackUserLocation: true}));
map.addControl(new AlertsButton(), 'top-right');
map.addControl(new LocationButton(), 'top-right');
map.addControl(new SettingButton(), 'top-right');

//moving agencies
let visableAgencies = new VisableAgencies(10);
let alertsDatabase = new AlertsDatabase()
visableAgencies.addPostUpdate(alertsDatabase)


async function ini()
{
    transitVehicleLayer.updateZoomStatus();
    passengerVehicleLayer.updateZoomStatus();
    
    stopInfoController.updateLayer()
    stopAlertsController.updateLayer();
    visableAgencies.update()
	getVehicles();

    setInterval(function () {
		getVehicles(true)
	},15000)
}

map.on('style.load', () => {
    map.setProjection({
        type: 'globe', // Set projection to globe
    });
    map.setSky({
        'sky-color': '#e5e6dd',

        'horizon-color': '#111111',

        'fog-color': '#000000',

        'fog-ground-blend': 0.5,

        'atmosphere-blend': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            5, 1,
            7, 0
        ]
    });

     // Add elevation data
    map.addSource('terrainSource', {
        type: 'raster-dem',
        url: 'https://tiles.mapterhorn.com/tilejson.json'
    });


    // Enable 3D terrain
    map.setTerrain({
        source: 'terrainSource',
        exaggeration: 1
    });


    // Optional hillshade layer
    map.addSource('hillshadeSource', {
        type: 'raster-dem',
        url: 'https://tiles.mapterhorn.com/tilejson.json'
    });

    // map.addLayer({
    //     id: 'hills',
    //     type: 'hillshade',
    //     source: 'hillshadeSource',
    //     layout: {
    //         visibility: 'visible'
    //     },
    //     paint: {
    //         'hillshade-shadow-color': '#473B24'
    //     }
    // });
    
});
map.on('load', async () => {
    

    // set up location is required
    await setStartRegion()

    //setup database
    await agency_database.initialize()
    console.log(agency_database.getAllData())

    // clickable stops
    map.addSource('stops', {
        type: 'vector',
        tiles: [
            'https://data.oregonbr.com/stops/{z}/{x}/{y}.pbf'
        ],
        minzoom: 14.75
    });

    // transit dots
    map.addSource("vehicles-transit", {
        type: "vector",
        tiles: [
            `https://data.oregonbr.com/vehicles/{z}/{x}/{y}.pbf?transit=${transitVehicleLayer.getZoomStatus()}&passenger=${passengerVehicleLayer.getZoomStatus()}
            `
        ]
    });

    // setInterval(() => {
    //     map.getSource("vehicles-transit").setTiles([
    //         `https://data.oregonbr.com/vehicles/{z}/{x}/{y}.pbf?t=${Date.now()}`
    //     ]);
    // }, 15000);

    let middle_pint = 4.5;
    let middle_pint_low = 8.4
    map.addLayer({
        id: "vehicles-transit-layer_far",
        type: "circle",
        source: "vehicles-transit",
        "source-layer": "vehicle_positions",
        minzoom: 0,
        maxzoom: middle_pint,
        paint: {
            "circle-radius": 1.5,
            "circle-color": agency_database.getAllColors()
        }
    });
     map.addLayer({
        id: "vehicles-transit-layer_mid",
        type: "circle",
        source: "vehicles-transit",
        "source-layer": "vehicle_positions",
        minzoom: middle_pint,
        maxzoom: middle_pint_low,
        paint: {
            "circle-radius": 2,
            "circle-color": agency_database.getAllColors()
        }
    });
    map.addLayer({
        id: "vehicles-transit-layer_near",
        type: "circle",
        source: "vehicles-transit",
        "source-layer": "vehicle_positions",
        minzoom: middle_pint_low,
        maxzoom: 10.5,
        paint: {
            "circle-radius": 3,
            "circle-color": agency_database.getAllColors()
        }
    });


    // for stop highlighting
    map.addSource("highlight-stops", {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: []
        }
    });

    map.addLayer({
        id: "stop-radius",
        type: "fill",
        source: "highlight-stops",
        paint: {
            "fill-color": [
                "case",
                ["==", ["get", "effect"], 1],
                "#f51010",
                ["==", ["get", "effect"], 4],
                "#f51010",
                ["==", ["get", "effect"], 9],
                "#155bf3",
                ["==", ["get", "severityLevel"], 4],
                "#f51010",
                ["==", ["get", "isAlert"], true],
                "#f3a616",
                "#000000"
            ],
            "fill-opacity": 0.45
        }
    });

    // for mapping stops
    map.addSource('selected-route', {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: []
            }
        }
    });
    map.addLayer({
        id: 'selected-route',
        type: 'line',
        source: 'selected-route',
        paint: {
            'line-color': '#242525af',
            'line-width': 4
        }
    });

    const image = await map.loadImage('../common/bus-stops.png');
    map.addImage('bus-stop', image.data);

    map.addLayer({
        id: 'stops',
        type: 'symbol',
        source: 'stops',
        'source-layer': 'stops',
        layout: {
            'icon-image': 'bus-stop',
            'icon-size': 0.025
        }
    });

    map.on('click', 'stops', async (e) => {
        const agency_id = e.features[0].properties.agency_id
        const stop_id = e.features[0].properties.stop_id

        console.log(e.features[0]);

        const coordinates = e.features[0].geometry.coordinates.slice();

        // create html
        let main = document.createElement("div");
        main.innerText = e.features[0].properties.name + "\n"+ stop_id
       //console.log(description);

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        //stopPopup.updatePopup(coordinates, main);

        // get info
        let stopsInfo = await getTransitStopInfo(agency_id, stop_id)
        console.log(stopsInfo)
    });
    

    ini();
    
    //========== EVENTS =============
    // map.on('zoomend', function(e){ updateZoomLayerStatus(); console.log(map.getZoom());});
    map.on('moveend', function(e){
        stopInfoController.updateLayer()
        stopAlertsController.updateLayer()
        transitVehicleLayer.updateZoomStatus();
        passengerVehicleLayer.updateZoomStatus();
        //();
        getVehicles(false);
        visableAgencies.update()
    });
    map.on('click', function(e){
        let ele = e.originalEvent.target

        // close if not div
        if (ele.classList.contains("maplibregl-canvas")) {
            if(clickedVehicle) {clickedVehicle.close(); clickedVehicle = null; console.log("closed");}
        }
    })
});

function updateVehicleSource() {
    const transit = transitVehicleLayer.getZoomStatus();
    const passenger = passengerVehicleLayer.getZoomStatus();
    console.log(transit, passenger)

    map.getSource("vehicles-transit").setTiles([
        `https://data.oregonbr.com/vehicles/{z}/{x}/{y}.pbf?transit=${transit}&passenger=${passenger}`
    ]);
}
    


map.on('mouseenter', 'stops', () => {
    map.getCanvas().style.cursor = 'pointer';
});
