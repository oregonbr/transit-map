const DOTS = 0;
const MARKER = 1;

const DISABLE = 0;
const ENABLE = 1;

const STOPS_FULL = 0;
const STOPS_LIMITED= 1;
const STOPS_MIN = 2; 
const STOPS_NONE = 3;

// ---------- load items to map------------------------
async function getVehicles(timed = false){
	const transit = transitVehicleLayer.getOnDisplay();
	const passenger = passengerVehicleLayer.getOnDisplay();
	if(!passenger && !transit){
		vehicleLayer.clearGroup();
		return
	}

	const bounds = map.getBounds();
	let paddingPercent = 0.25;

	const sw = bounds.getSouthWest();
	const ne = bounds.getNorthEast();

	const lngDiff = ne.lng - sw.lng;
	const latDiff = ne.lat - sw.lat;

	const paddedMinLng = sw.lng - lngDiff * paddingPercent;
	const paddedMinLat = sw.lat - latDiff * paddingPercent;
	const paddedMaxLng = ne.lng + lngDiff * paddingPercent;
	const paddedMaxLat = ne.lat + latDiff * paddingPercent;

	// build params
	const params = new URLSearchParams()
	params.set("bbox", [paddedMinLng,paddedMinLat,paddedMaxLng,paddedMaxLat].join(","))

	let displays = []
	if(transit) displays.push("'transit'")
	if(passenger) displays.push("'passenger'")
	params.set("onScreen", displays.join(','))
	if(clickedVehicle) params.set("selected", clickedVehicle.getSelected())
		console.log(settingsData.hide_stale)
	if(!settingsData.hide_stale){
		params.set("stale_time", settingsData.stale_time_sec)
	}

	// get data
	const res = await fetch(`https://data.oregonbr.com/vehicles2?${params}`);
	mappedVehicles = await res.json();
	placeVehicleMarkers(timed);

	//map.getSource("vehicles").setData(geojson);
}

function findRouteWithTrip(data, num){
	for(let routeData of data)
	{
		let tripList = routeData.tripList;
		// find location
		if(tripList == null){continue;}
		let result = binarySearch(tripList, num, 0 , tripList.length);

		//if found, return all data of route
		if(result != -1){return routeData;}
	}
	return null;
}
	
// ======================== Object for map things ========================================
/**
 * class to hold all markers or popups.
 * To add and delete on map.
 */
class MarkerGroup {
    /**
     * Create a new groupe
     */
    constructor(){
        this.markers = [];
    }

    /**
     * Add a marker to group and map.
     * @param {any} element 
     */
    addMarker(element){
        this.markers.push(element);
    }

	showMarkers(){
		for(let ele of this.markers){
            ele.addTo(map);
        }
	}

	/**
	 * remove from map
	 */
	removeMarkers(){
		for(let ele of this.markers){
            ele.remove();
        }
	}

    /**
     * Delete All Markers in group and map 
     */
    clearGroup(){
        this.removeMarkers()
        this.markers = [];
    }
}

// layer control for dots or marker
class VehicleMarkerLayer {

	constructor(minzoom, maxzoom){
		this.minzoom = minzoom;
		this.maxzoom = maxzoom;
		this.status = false;
	}
	getStatus(){return (map.getZoom() >= this.maxzoom);}
	updateZoomStatus(){this.status = this.getStatus()}
	getZoomStatus(){return this.status}
	getOnDisplay(){return this.status}

	getMinZoom(){return this.minzoom;}
	getMaxZoom(){return this.maxzoom;}
	setMinZoom(min){this.minzoom = min}
	setMaxZoom(max){this.maxzoom = maz}


}

class LayerToggleController {
	constructor(minzoom, maxzoom, layer){
		this.minzoom = minzoom;
		this.maxzoom = maxzoom;
		this.layer = layer
		this.zoomStatus = this.getStatus();
		this.prevZoomStatus = this.getStatus();

		this.setZoomStatus();
	}

	getStatus(){return (map.getZoom() >= this.maxzoom) ? ENABLE : DISABLE;}

	getMinZoom(){return this.minzoom;}
	getMaxZoom(){return this.maxzoom;}

	getZoomStatus(){return this.zoomStatus;}
	setZoomStatus(){
		this.prevZoomStatus = this.zoomStatus;
		this.zoomStatus = this.getStatus();
	}

	updateLayer(){
		this.setZoomStatus()

		if(this.prevZoomStatus != this.zoomStatus){
			if(this.zoomStatus){this.layer.show()}
			else(this.layer.remove())
		}
	}

	forceUpdateLayer(){
		this.setZoomStatus()
		if(this.zoomStatus){this.layer.show()}
		else(this.layer.remove())
	}
}

class SelectedVehicle {
	constructor(details){
		// clearOld
		stopInfoLayer.clear()
		stopAlertsLayer.clear();
		stopLayer.clear()
		routeLayer.clear()

		Object.assign(this, details)
		this.onTrip = (this.trip != null); 	// if there isn't a trip
		this.hasRoute = (this.route != null);

		// set up if there is a trip
		if(this.onTrip){
			// adds/clears stops and list may need to change name
			//this.resetTripDetails();

			// get start date time if available in seconds
			let timezone = agency_database.getTimezone(agency_database.getAgencyIdFromRealId(this.real_feed_id))
			this.trip.daySeconds = (this.start_date) ? getYMDToEpoch(this.start_date, timezone): getTimzoneMidnight(timezone)
		
		}

		//console.log(this)
		
		this.initialize()
	}

	async initialize() {
		if(this.onTrip) {
			// for loading 
			vehiclePopup.createIS_loading(this)
			vehiclePopup.setLngLat([this.lon, this.lat])
			vehiclePopup.openPopup();

			let col = []
			col.push(getClickedVehicleInfo(this.route.s_id, this.trip.id, this.start_date, this.vehicle_id))
			col.push(getClickedVehicleShape(this.s_id, this.trip.shape_id))
			let [trip_content, shape] = await Promise.all(col)

			this.trip_content = trip_content;

			// parse from list
			this.trip.delay = null;
			this.trip.seq_headsign = null;

			// set up current delays
			[this.trip.delay, this.trip.seq_headsign] = this.parseList(this.trip_content, this.trip.daySeconds);
			// map stops
			stopLayer.mapStops()
			routeLayer.mapRoute(shape)
			stopInfoLayer.addStopInfo(this.real_feed_id, this.trip_content)
			stopInfoController.forceUpdateLayer()
			stopAlertsLayer.addStopAlerts()
			stopAlertsController.forceUpdateLayer()

			// set popup full
			vehiclePopup.setIS(this)

		} else if (this.hasRoute) {
			vehiclePopup.setMin(this)
		} else {
			vehiclePopup.setNIS(this)
		}
		
		vehiclePopup.setLngLat([this.lon, this.lat])
		vehiclePopup.openPopup();
	}

	async update(details, timed){
		this.onTrip = false; 
		if(this.trip){
			this.onTrip = (this.trip != null);
		}

		// if this is a new trip, restart
		if(this.onTrip){
			if(details.trip.trip_id != this.trip.trip_id){
				//console.log("new trip!!", details.trip_info.trip_id, this.trip_info.trip_id)
				stopInfoLayer.clear()
				stopAlertsLayer.clear();
				stopLayer.clear()
				routeLayer.clear()

				Object.assign(this, details)
				//console.log(details)
				// this.trip_info.stops;
				// this.trip_info.list;
				this.onTrip = (this.trip != null);

				this.initialize()
			}
			else{
				let trip_info_hold = details.trip;
				delete details.trip;
				Object.assign(this, details);
				Object.assign(this.trip, trip_info_hold)
				if(timed){
					//console.log(this)
					let d = await getClickedVehicleInfo(this.real_feed_id, this.trip.id, this.start_date, this.vehicle_id)
					this.trip.delay;
					this.trip.seq_headsign;
					// set up current delays
					[this.trip.delay, this.trip.seq_headsign] = this.parseList(this.trip_content, this.trip.daySeconds);
					//console.log("here", this.trip_info.delay, this.trip_info.seq_headsign)
					//console.log(this.stops)
					stopInfoLayer.clear()
					stopAlertsLayer.clear();
					stopInfoLayer.addStopInfo(this.real_feed_id, this.trip_content)
					stopAlertsLayer.addStopAlerts();
					stopInfoController.forceUpdateLayer()
					stopAlertsController.forceUpdateLayer()

					vehiclePopup.setIS(this)
				}
			}
		} else if (this.hasRoute) {
			vehiclePopup.setMin(this)
		}
		else{
			vehiclePopup.setNIS(this)
		}
		vehiclePopup.setLngLat([this.lon, this.lat])
	}

	parseList(list, seconds){
		//console.log(seconds, ":seconds")
		let delay = null;
		let headsign = null;
		//const seconds = Math.floor(Date.now() / 1000);
		//console.log(list)
		// loop list to extract data
		for(let i = 0; i < list.length-1; i++){
			const row = list[i];
			const nextRow = list[i+1];

			if(row.last_updated){
				//console.log(((row.last_updated == nextRow.last_updated) && (row.last_updated > seconds - 30)), (row.last_updated == nextRow.last_updated), (row.last_updated > seconds - 30) , "||", row.last_updated , nextRow.last_updated , " " , row.last_updated , seconds - 30, + `:` +  (row.last_updated - (seconds - 30)))
				if((row.last_updated == nextRow.last_updated)) {
					headsign = row.stop_headsign
					
					let time = row.arrival
					if(!time) time = row.departure
					if(!time) {continue;}; // if no time, keep searching untill

					let rtTime = row.new_arrival
					if(!rtTime) rtTime = row.new_departure;


					delay = (seconds + time - rtTime)
					//console.log(seconds + time - rtTime, seconds , time , rtTime)
					break;	// end of done
				}
			}
			//console.log(row)
		}
		//console.log(delay, headsign)
		return [delay, headsign]
	}

	isSelected(other_real_feed_id, other_vehicle_id) {
		return ((other_real_feed_id === this.real_feed_id) && (other_vehicle_id === this.vehicle_id))
	}

	getSelected(){
		return this.real_feed_id + "-" + this.vehicle_id;
	}

	close(){
		stopInfoLayer.clear();
		stopAlertsLayer.clear();
		stopLayer.clear();
		routeLayer.clear();
		vehiclePopup.closePopUp();
	}

	// reset trip info
	resetTripDetails(){
		this.trip.stops = null;	// for holding list of stops for this trip
		this.trip.list = null;		// for holding arrival/departures for this trip
	}

	getTripDetails(){return this.trip_info;}
	getTripContent(){return this.trip_content;}
	isOnTrip(){return this.onTrip}
}

/**
 * Controller for stop highligher
 */
class StopLayer {
	constructor(){ // nothing
	}

	mapStops(){
		let content = clickedVehicle.getTripContent()
		const geojson = {
			type: "FeatureCollection",
			features: content.map(s => this.makeCircle(s))
		}
		//console.log(geojson)
		map.getSource("highlight-stops").setData(geojson);
	}

	clear(){
		map.getSource("highlight-stops").setData({
			type: "FeatureCollection",
			features: []
		});
	}

	makeCircle(stop) {
		const lng = Number(stop.lng)
		const lat = Number(stop.lat)
		const rad = 50
		const isAlert = (stop.alerts)?true:false
		const serverity = (isAlert)? stop.alerts[0].severityLevel : null
		const effect = (isAlert)? stop.alerts[0].effect : null;

		const center = turf.point([lng, lat]);

		let circle = turf.buffer(center, rad, {
			units: "meters"
		});

		circle.properties = {isAlert: isAlert,effect:effect, severityLevel: serverity}
		return circle;
	}
}

/**
 * Class for stop information
 */
class StopInfoLayer {
	constructor(){
		this.popups = new MarkerGroup()
	}

	addStopInfo(real_feed_id, list){
		let timezone = agency_database.getTimezone(agency_database.getAgencyIdFromRealId(real_feed_id));
		let midnightSeconds = getTimzoneMidnight(timezone)
		//console.log(midnightSeconds)

		for(let s of list){
			let stop_id = s.stop_id
			//console.log(s)
			if(s.timezone){midnightSeconds = getTimzoneMidnight(s.timezone); timezone = s.timezone}

			let popup = new maplibregl.Popup({
				anchor:"left",
				closeButton: false,
				closeOnClick: false,
				maxWidth: "150px",
				offset: [20,0]
			});
			popup.setDOMContent(this.createContent(s, timezone, midnightSeconds))
				.setLngLat([s.lng, s.lat])
			this.popups.addMarker(popup)
			
		}
	}

	/**
	 * Show popups
	 */
	show(){this.popups.showMarkers()}
	remove(){this.popups.removeMarkers()}
	clear(){this.popups.clearGroup()}

	createContent(row, timezone, midnight){
		let content = document.createElement('div');
		const HAS_REAL = (row.new_arrival != null) || (row.new_departure != null)
		// create displayTime time
		let time = document.createElement('p')
		time.classList.add('lato-bold')
		if (HAS_REAL){
			time.classList.add('textRTTime')
			if(row.new_arrival != null){
				let timeSec = row.new_arrival;
				time.innerText = getEpochToFormat(timeSec, timezone)
			}
			else{
				let timeSec = row.new_departure
				time.innerText = getEpochToFormat(timeSec, timezone);
			}
			content.append(time);
		}
		else{
			if(row.arrival != null){
				let timeSec = (row.arrival + midnight);
				time.innerText = getEpochToFormat(timeSec, timezone);
				content.append(time);
			}
			else if(row.departure != null){
				let timeSec = (row.departure + midnight);
				time.innerText = getEpochToFormat(timeSec, timezone);
				content.append(time);
			}
		}
		
		// create stopId
		try{
			let stopInfo = document.createElement('p');
			stopInfo.classList.add("stopId")
			let text = row.name + "\n"
			text += "Stop ID: "+row.stop_id;
			text += "\nSeq:" + row.sequence
			stopInfo.innerText = text;
			content.append(stopInfo);
			return content
		}
		catch(e){
			console.error( e)
		}
	}
}

class StopAlertsLayer {
	constructor(){
		this.popups = new MarkerGroup()
	}

	addStopAlerts(){
		let content = clickedVehicle.getTripContent();

		for(let s of content){
			if(!s.alerts) continue;
			let popup = new maplibregl.Popup({
				anchor:"bottom",
				closeButton: false,
				closeOnClick: false,
				maxWidth: "300px",
				offset: [0,-40]
			});
			popup.setDOMContent(this.createContent(s))
				.setLngLat([s.lng, s.lat])

			//popup.addTo(map)
			this.popups.addMarker(popup)
		}
	}

	/**
	 * Show popups
	 */
	show(){this.popups.showMarkers()}
	remove(){this.popups.removeMarkers()}
	clear(){this.popups.clearGroup()}

	createContent(stop){
		let alert = stop.alerts[0]
		let content = document.createElement('div');
		let header;
		let desc;

		if(alert.alert_header != '' || alert.alert_header != null){
			header = document.createElement("h3")
			header.textContent = alert.alert_header;
		}
		if(alert.alert_desc != "" || alert.alert_desc != null){
			desc = document.createElement("p")
			desc.textContent = alert.alert_desc;
		}

		content.append(header, desc)
		//console.log(content)
		return content;
	}
}

/**
 * controller for route display
 */
class RouteLayer {
	constructor(){;}

	mapRoute(d){
		//console.log("s", d)
		map.getSource("selected-route").setData({
			type: "Feature",
			geometry: d
		});
	}
	clear(){
		map.getSource("selected-route").setData({
			type: "Feature",
			properties: {},
        	geometry: {
				type: "LineString",
				coordinates: []
			}
		});
	}
}

class VehiclePopup {
	constructor() {
		this.popup = new maplibregl.Popup({
			closeButton: false,
			closeOnClick: false,
			anchor:"bottom",
			offset: [0, -10]
		});
	}

	/**
	 * Set html dom to popup
	 * @param {DOM} DOM Document object
	 */
	setContent(DOM){
		this.popup.setDOMContent(DOM)
	}

	/**
	 * Set the longitude and latitude
	 * @param {Array} lnglat 
	 */
	setLngLat(lnglat){
		this.popup.setLngLat(lnglat)
	}

	
	openPopup(){
		this.popup.addTo(map);
	}
	closePopUp(){
		this.popup.remove();
	}

	setNIS(clicked){

		// create main holder
		let main = document.createElement("div")
		main.classList.add("vehiclePopUp")
		main.id = "mainClickedPopUp";

		// create not in service
		let head = document.createElement('div')
		head.innerText = "Not In Service";
		head.classList.add("nis", "lato-bold")

		let title = this.createAgencyTitle(agency_database.getTitle(agency_database.getAgencyIdFromRealId(clicked.real_feed_id)))
		let v_id = this.createVehicleId(clicked.vehicle_id)
		let updated = this.createLastUpdated(clicked.timestamp)

		main.append(head, title, v_id,updated)

		this.popup.setDOMContent(main)
	}

	/**
	 * 
	 * @param {SelectedVehicle} clicked 
	 */
	setIS(clicked){
		let main = document.createElement("div")
		main.classList.add("vehiclePopUp");
		main.id = "mainClickedPopUp"

		let headsign = this.createHead(clicked)
		let title = this.createAgencyTitle(agency_database.getTitle(agency_database.getAgencyIdFromRealId(clicked.real_feed_id)))
		let alerts = (clicked.route.has_alert)?this.createHasAlert(agency_database.getAgencyIdFromRealId(clicked.real_feed_id),clicked.route):''
		let v_id = this.createVehicleId(clicked.vehicle_id)
		let block = this.createBlockId(clicked.s_id, clicked.trip, clicked.start_date, clicked.real_feed_id)
		let updated = this.createLastUpdated(clicked.timestamp)
		let delay = this.createDelay(clicked.trip)

		main.append(headsign, title, v_id,block, alerts,delay, updated)
		this.popup.setDOMContent(main)
	}

	setMin(clicked){
		let main = document.createElement("div")
		main.classList.add("vehiclePopUp");
		main.id = "mainClickedPopUp"

		let headsign = this.createHead(clicked)
		let title = this.createAgencyTitle(agency_database.getTitle(agency_database.getAgencyIdFromRealId(clicked.real_feed_id)))
		let v_id = this.createVehicleId(clicked.vehicle_id)
		let alerts = (clicked.route.has_alert)?this.createHasAlert(agency_database.getAgencyIdFromRealId(clicked.real_feed_id),clicked.route):''

		let updated = this.createLastUpdated(clicked.timestamp)

		main.append(headsign, title, v_id,alerts, updated)
		
		this.popup.setDOMContent(main)
	}

	createIS_loading(clicked){
		let main = document.createElement("div")
		main.classList.add("vehiclePopUp");
		main.id = "mainClickedPopUp"

		let headsign = this.createHead(clicked)
		let title = this.createAgencyTitle(agency_database.getTitle(agency_database.getAgencyIdFromRealId(clicked.real_feed_id)))
		let v_id = this.createVehicleId(clicked.vehicle_id)
		let block = this.createBlockId(clicked.s_id, clicked.trip, clicked.start_date, clicked.real_feed_id)
		let updated = this.createLastUpdated(clicked.timestamp)

		main.append(headsign, title, v_id,block, updated)
		this.popup.setDOMContent(main)
	}

	// Elements for popup
	createHead(v){
		let trip = v.trip
		let short_name = v.route.short_name
		let long_name = v.route.long_name
		let back_color = v.route.color
		let fore_color = v.route.color_text
		// create container
		let head = document.createElement("div");
		head.classList.add('tripHead');

		// add number
		let number = document.createElement("div");
		number.innerText = filterText(short_name);
		if(back_color== null){
			number.classList.add("basicNumber");
		}
		else{
			number.classList.add("routeNumber")
			number.style.backgroundColor = "#"+back_color;
			number.style.color = "#"+fore_color;
		}

		// add line name
		let title = document.createElement("div")
		let text = long_name
		if(v.trip){
			if(trip.seq_headsign){text = trip.seq_headsign}
			else if(trip.headsign) text = trip.headsign;
		}
		//console.log(trip_info.seq_headsign, trip_info.headsign, trip_info)
		text = filterText(text)
		
		title.innerHTML = text.replace(short_name + " - ", '').replace(short_name + ' ', '');
		title.classList.add('tripTitle',"lato-bold")

		head.append(number, title)
		return head;
	}

	createAgencyTitle(title)
	{
		let s = document.createElement('div');
		s.innerHTML = title;
		s.classList.add("agencyTitle", "lato-regular");
		return s;
	}

	createVehicleId(id)
	{
		let s = document.createElement('div');
		s.innerHTML = "Vehicle ID: "+id;
		s.classList.add('vehicleId', "lato-regular")
		return s;
	}
	createBlockId(agency_id, trip, start_date, real){
		console.log(agency_id, trip, start_date, real)
		if(trip.block_id){
			let s = document.createElement('div');
			let t = document.createElement("a")
			t.innerText = filterText(trip.block_id);
			t.classList.add("clickable");

			s.innerHTML = "Block ID: ";
			s.append(t)
			s.classList.add('blockId', "lato-regular")

			t.addEventListener('click', async () => {
				//let params = {agency: agency, blockId: id, startDate:startDate, stops:stops, routes:routes}
				scheduleUI.show(agency_id, trip.block_id, start_date, real);
			});
			return s;
		}	
	}
	createDelay(trip){
		if(trip.delay != null){
			let s = document.createElement('div');
			s.innerHTML = getTripDelay(trip.delay)
			s.classList.add("lato-regular")
			return s;
		}
		return "";
	}
	createLastUpdated(time){
		console.log(time,"sd")
		let main = document.createElement("div")
		main.classList.add("lato-regular")

		main.textContent = "Last Reported: \n"+formatTime(time)

		return main;
	}
	createHasAlert(agency_id, route){
		let main = document.createElement("div")
		main.classList.add("lato-regular", "mapUIalertContainer")
		
		
		let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M508.5-291.5Q520-303 520-320t-11.5-28.5Q497-360 480-360t-28.5 11.5Q440-337 440-320t11.5 28.5Q463-280 480-280t28.5-11.5ZM440-440h80v-240h-80v240ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm301.5-598.5Q510-807 510-820t-8.5-21.5Q493-850 480-850t-21.5 8.5Q450-833 450-820t8.5 21.5Q467-790 480-790t21.5-8.5ZM200-200v-560 560Z"/></svg>`
		let alert_icon = document.createElement('template')
		alert_icon.innerHTML = svg.trim()
		alert_icon = alert_icon.content.firstElementChild

		let text = document.createElement("a")
		text.textContent = "View Alerts"

		text.addEventListener("click", async () => {
			let alerts = await getRouteAlerts(agency_id, route.id)
			console.log(alerts)
		})

		main.append(alert_icon, text)

		return main
	}
}

class AgencyDatabase {
	constructor(){
		this.agencies = {}
		this.agency_real_site_map = {}
		this.colors = ["match", ["get", "real_feed_id"]];
	}

	/**
	 * fetch and format data
	 */
	async initialize(){
		let {agencies, agency_real_site_map} = await this.fetchData();
		this.agencies = agencies;
		this.agency_real_site_map = agency_real_site_map;
		for (const [real_id, value] of Object.entries(this.agency_real_site_map)){
			
			// set colors
			this.colors.push(Number(real_id))
			this.colors.push(this.agencies[value].color)
		}
		this.colors.push("#999999")
	}

	/**
	 * Get the data from backend
	 * @returns array of data
	 */
	async fetchData(){
		return new Promise((res, rej) => {
			fetch('https://data.oregonbr.com/agencies/main')
			.then(rep => {
				if (!rep.ok) {console.log(`HTTP error! status: ${rep.status}`);}
				return rep.json();
			})
			.then(a => {
				res(a);
				})
			.catch(e => {
			console.error('Error fetching agnecy structure\n'+ e);
			});
		})
	}

	/**
	 * get dots color format
	 */
	getAllColors(){
		return this.colors
	}

	/**
	 * Get the color for agency
	 * @param {Integer} id agency id
	 * @returns hex color
	 */
	getColor(id){
		return this.agencies[id].color
	}

	getTitle(id){
		return this.agencies[id].title
	}

	getAllData(){
		return this.agencies
	}

	getTimezone(id){
		console.log(id)
		return this.agencies[id].timezone
	}
	getAgencyData(id){return this.agencies[id]}
	getAgencyIdFromRealId(real_id){return this.agency_real_site_map[real_id]}
	getStaticIdFromAgencyId(agency_id){ return this.agency[agency_id]}
	getStaticIdFromRealId(real_id){return this.getAgencyIdFromRealId(real_id)}
}

class AlertsDatabase {
	constructor () {
		this.db = {}
		this.timestamp_latest
	}

	async update2(){
		// update only when on screen and ui is open
		console.log(uiOverlay.getId())
		if(uiOverlay.getId() != "alerts_content"){return;}
		if(!visableAgencies.getIsOnDisplay()){alerts.createZoomToSee(); return}
		let visable = visableAgencies.getAgencies();

		const timestamp = Math.floor(Date.now() / 1000);
		const timestamp_expire = timestamp - 30

		// check if they are in "data base"
		let agency_to_update = []
		for(const agency_id of visable){
			// is not in, add
			if(!this.db[agency_id]){

				this.db[agency_id] = {
					timestamp: timestamp,
					alerts: [],
					routes: {}
				}
				// append to search
				agency_to_update.push(agency_id)
			}
		}

		// find old and outdated
		for(const [agency_id, agency_value] of Object.entries(this.db)){
			if(agency_value < timestamp_expire){delete this.db[agency_id]}
		}

		// if not in data base get the data
		if(agency_to_update.length){
			let [new_alerts, new_routes] = await getAgenciesAlerts(agency_to_update);
			//console.log(new_alerts, new_routes)
			let temp_alerts_list = {}

			// format alerts
			for(const row of new_alerts){
				if(!temp_alerts_list[row.agency_id]){
					temp_alerts_list[row.agency_id] = {}
				}

				let agency = temp_alerts_list[row.agency_id]
				if(!agency[row.route_id]){
					agency[row.route_id] = []
				}
				temp_alerts_list[row.agency_id][row.route_id].push(row)
			}

			// format routes
			let temp_routes = {}
			for(const row of new_routes) {
				if(!temp_routes[row.agency_id]){
					temp_routes[row.agency_id] = {}
				}

				let agency = temp_routes[row.agency_id]

				agency[row.route_id] = row

				// delete unwanted
				delete agency[row.route_id].agency_id
				delete agency[row.route_id].route_id
			}
			
			// add to data base
			for(const [key, value] of Object.entries(temp_alerts_list)){
				this.db[key].alerts = value
			}
			for(const [key, value] of Object.entries(temp_routes)){
				this.db[key].routes = value
			}
			//console.log(routes)
			//console.log(this.db)
			
		}
		console.log("update scrrem")
		alertsUI.updateContent()
	}

	async update(){
		// update only when on screen and ui is open
		//console.log(uiOverlay.getId())
		if(uiOverlay.getId() != "alerts_content"){console.log("skip"); return;}
		if(!visableAgencies.getIsOnDisplay()){alertsUI.updateContent(); return;}

		// set times
		const timestamp = Math.floor(Date.now() / 1000);
		const timestamp_expire = timestamp - (2*60)

		// using viable, get ageives with alerts at this moment
		let alert_agencies = visableAgencies.getAgenciesWAlerts();
		//console.log("with",alert_agencies, "visable", visable)
		//console.log(alert_agencies)


		for(const agency_id of alert_agencies){
			// is not in, add
			if(!this.db[agency_id]){
				this.db[agency_id] = {
					timestamp: timestamp,
					alerts: {},
					routes: {}
				}
			}
			// else update timestamo
			else{
				this.db[agency_id].timestamp = timestamp
			}
		}
		this.timestamp_latest = timestamp;

		// delete old
		for (const [agency_id, value] of Object.entries(this.db)){
			if (this.db[agency_id].timestamp < timestamp_expire) {
				delete this.db[agency_id];
			}
		}

		// finaly update screen
		console.log(this.db)
		alertsUI.updateContent()
	}

	async fetchAgencyAlerts(agency_id, callback = null){
		let [alerts, routes] = await getAgencyAlerts(agency_id);
		let agency = this.db[agency_id]
		console.log("g", agency)
		// add a;erts
		for(const alert of alerts){
			let route_id = alert.route_id
			let route = this.db[agency_id].alerts[route_id]
			if (!this.db[agency_id].alerts[route_id] ){
				this.db[agency_id].alerts[route_id] = []
			}

			let parsed = alert
			delete parsed.route_id
			this.db[agency_id].alerts[route_id].push(parsed)
		}
		// add alerts
		for(const route of routes){
			let route_id = route.route_id
			agency.routes[route_id] = route
			delete agency.routes[route_id].route_id
		}
		console.log(alerts, routes)
		
		if(callback){ callback();}
	}

	getAlerts(){return this.db}
	getLatestTimestamp(){return this.timestamp_latest}

	/**
	 * get agencies as an array
	 * @returns array of agency
	 */
	getVisableAlerts(){
		let return_value = []
		for(const [agency_id, value] of Object.entries(this.db)){
			if(value.timestamp == this.timestamp_latest){
				return_value.push(agency_id)
			}
		}
		return return_value;
	}
	hasAlerts(agency_id){return Object.entries(this.db[agency_id].alerts).length; }
	/**
	 * 
	 * @param {Interger} agency_id id of agency
	 * @returns object with routes and alerts
	 */
	getAgencyAlerts(agency_id){
		return this.db[agency_id]
	}
}

// encapusalte what is seen on map
class VisableAgencies {
	constructor(max){
		this.agencies = [] // to be an array or agencies
		this.hasAlerts = []
		this.maxZoom = max // max zoom before stop updating
		this.isOnDisplay = false
		this.postUpdates = []
	}

	update(){
		this.isOnDisplay = false

		let zoom = map.getZoom()
		if(zoom > this.maxZoom){
			this.isOnDisplay = true
		}
		//console.log(this.isOnDisplay)
		if(this.isOnDisplay){this.updateAgencies()}
	}
	getAgencies(){return this.agencies;}
	getIsOnDisplay(){return this.isOnDisplay;}
	getAgenciesWAlerts(){return this.hasAlerts;}

	async updateAgencies(){
		let {success, data} = await getAreaAgenciesCenter()
		if(!success){return}
		const {agencies, has_alerts} = data
		this.agencies = agencies; this.hasAlerts = has_alerts;
		//console.log(this.agencies)
		
		for(let item of this.postUpdates){
			//console.log("items to update", item)
			item.update()
		}
	}

	addPostUpdate(...itemsToUpdate){
		for(const item of itemsToUpdate){
			this.postUpdates.push(item)
		}
	
	}
}