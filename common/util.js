/**
 * Database getters
 */

async function getLink(link, params)
{
	const postData = JSON.stringify(params);
	return new Promise((res, rej) => {
		fetch(link, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: postData
		})
		.then(rep => {
			if (!rep.ok) {console.log(`HTTP error! status: ${rep.status}`, link);}
			return rep.json();
		})
		.then(a => {
			res(a);
			})
		.catch(e => {
	    console.error('Error fetching data\n'+ e);
  		});
	})
}

async function getAgencyStructure()
{
	return new Promise((res, rej) => {
		fetch('https://data.oregonbr.com/site/agencyStructure')
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

async function getAgencyDatabase()
{
	return new Promise((res, rej) => {
		fetch('https://data.oregonbr.com/agencyData')
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
async function getTransitStopInfo(agency_id, stop_id)
{
	const postData = JSON.stringify({agency_id: agency_id, stop_id: stop_id});
	return new Promise((res, rej) => {
		fetch('https://data.oregonbr.com/getStopArrivals', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: postData
		})
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

async function getClickedVehicleInfo(static_feed_id, trip_id, start_date, vehicle_id)
{
	const postData = {static_feed_id, trip_id, start_date, vehicle_id};
	return await getLink("https://data.oregonbr.com/trips/getInfo", postData)
}

async function getRouteAlerts(agency_id, route_id)
{
	const postData = {agency_id: agency_id,route_id: route_id};
	return getLink("https://data.oregonbr.com/route/alerts", postData)
}


async function getClickedVehicleShape(static_feed_id, shape_id)
{
	const postData ={static_feed_id, shape_id};
	return await getLink('https://data.oregonbr.com/shape', postData)
}

async function getBlockInfo(static_feed_id, block_id, start_date)
{
	const postData = JSON.stringify({static_feed_id, block_id, start_date});
	return new Promise((res, rej) => {
		fetch('https://data.oregonbr.com/getBlockInfo', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: postData
		})
		.then(rep => {
			if (!rep.ok) {console.log(`HTTP error! status: ${rep.status}`);}
			return rep.json();
		})
		.then(a => {
			res(a);
			})
		.catch(e => {
	    console.error('Error fetching shape\n'+ e);
  		});
	})
}

async function getAreaAgenciesBounds(){
	const bounds = map.getBounds();
	const params = {
		west: bounds.getWest(),
		south: bounds.getSouth(),
		east: bounds.getEast(),
		north: bounds.getNorth()
	}
	return await getLink('https://data.oregonbr.com/agencies/in-view', params)
}
async function getAreaAgenciesCenter() {
	const center = map.getCenter();
	return await getLink('https://data.oregonbr.com/agencies/in-view-center', center)

}
async function getAgenciesAlerts(agency_ids){
	const params = {agency_ids: agency_ids}
	return await getLink('https://data.oregonbr.com/agencies/alerts', params)
}
async function getAgenciesWithAlerts(agencies){
	const params = {agencies: agencies}
	return await getLink('https://data.oregonbr.com/agencies/alerts/contains', params)
}

async function getAgencyAlerts(agency_id){
	const params = {agency_id: agency_id}
	return await getLink('https://data.oregonbr.com/agency/alerts', params)
}

//================= text things==================
function filterText(text, age = "", type = "", extraDetail = ""){
	if(text == null || text == undefined){return text;}
	text = text.replace(/^0+/, '')
	
	if(age == "ctran"){
		if(text.includes("Vine")){return "Vine"}
		return text.replaceAll("CTRAN", "")
	}
	else if(age == "brtln"){
		if(type == "vid"){
			return text.slice(5)
		}
	}
	
	return text;
}
function getTripDelay(delay_sec){	
	// on time
	if((delay_sec > -59) && (delay_sec< 59)){
		return "ON TIME"
	}
	else{
		let main = getMinSec(delay_sec) + " "+getLateEarly(delay_sec)
		return main;
	}
}
function getLateEarly(rawtime){
	if(rawtime < 0){return "LATE"}
	else{return "EARLY"}
}
function getMinSec(seconds){
	seconds = Math.abs(seconds)
	let min = Math.floor(seconds/60)
	let sec = seconds % 60
	let out = ''
	if(min > 0){out += min + "m "}
	if(sec > 0){out += sec + "s"}
	return out
	
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function formatTime(epoch_sec){
	const date = new Date(epoch_sec); 

	const year = date.getFullYear();
	const month = months[date.getMonth()]
	const day = date.getDate();

	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();
	if (minutes < 10){minutes = "0"+minutes;}
	if (seconds < 10){seconds = "0"+seconds;}
	let ap = "AM"
	if(hours > 11){ap = "PM";};
	if(hours > 12){hours = hours-12;};

	return `${month} ${day}, ${year} ${hours}:${minutes} ${ap}`
}
/**
 * get the formated time in hour: minute
 * @param {bigint} epoch_sec 
 * @returns 
 */
function formatTimeHM(epoch_sec){
	const date = new Date(epoch_sec); 

	let hours = date.getHours();
	let minutes = date.getMinutes();
	if (minutes < 10){minutes = "0"+minutes;}
	let ap = "AM"
	if(hours > 11){ap = "PM";};
	if(hours > 12){hours = hours-12;};
	if(!hours) hours = 0;

	return `${hours}:${minutes} ${ap}`
}

//get location to load map and set marker type
async function setStartRegion(){
	const hasStartRegion = urlParams.has('region')

	if(!hasStartRegion){return}
	let regionName = urlParams.get('region');
	let location = await fetch(`https://data.oregonbr.com/getMapLocation/${regionName}`)
	location = await location.json()

	const lng = location[0].lng
	const lat = location[0].lat
	const zoom = location[0].zoom

	if(location){
		map.jumpTo({center: [lng, lat], zoom:zoom})
	}
}

// =========== SEARCH ===============

function binarySearch(array, target, min, max){
	if(min > max){return -1}
	let index = Math.floor((min + max)/2);

	if(target == array[index]){return index;}

	if(target < array[index]){return binarySearch(array, target,min, index-1);}
	else{return binarySearch(array, target,index+1, max);}

}

function binarySearchIn(array, target, min, max, name){
	if(min > max){return -1;}
	let index = Math.floor((min + max)/2);
	if(target == array[index][name]){return array[index];}

	if(target < array[index][name]){return binarySearchIn(array, target,min, index-1, name);}
	else{return binarySearchIn(array, target,index+1, max, name);}

}

function binarySearchObjectArray(arr, key, targetValue) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midValue = arr[mid][key];

        if (midValue === targetValue) {
            return mid; // Target value found, return its index
        } else if (midValue < targetValue) {
            left = mid + 1; // Target is in the right half
        } else {
            right = mid - 1; // Target is in the left half
        }
    }

    return -1; // Target value not found in the array
}

function linearSearchIn(array, target, name){
	for(let i=0;i<array.length;i++){
		if(target == array[i][name]){
			return array[i];
		}
	}
}
function linearSearch(array, target){
	for(let i = 0; i < array.length; i++){
		let e = array[i]
		if(e == target){return i}
	}
	return -1;
}

//============== SORT ==================
function bubbleSortSchedule(data){
	for(let i = 0; i<data.length - 1; i++){
		for(let j = 0; j<data.length -i - 1; j++){
			comp = data[j].tripSchedule[0].arr;
			comp2 = data[j+1].tripSchedule[0].arr;
			// if lower index > higher index, swap
			if(comp > comp2){
				let temp = data[j];
				data[j] = data[j+1];
				data[j+1] = temp;
			}
		}
	}
}

// get vehicle trip stuff
async function getClickedVehicleTripData(agency, tripId, isNew,startDate)
{
	const postData = JSON.stringify({agency: agency, tripId: tripId, isNew: isNew, startDate:startDate});
	return new Promise((res, rej) => {
		fetch('https://data.oregonbr.com/getClickedTripData', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: postData
		})
		.then(rep => {
			return rep.json();
		  })
		.then(x => {
			res(x)
		})
		.catch((err) => console.error(err))
	})

}

async function getScheduleData(agency, type, params){
	// post example: {"agency":"uta","type":"block","params":{"blockId":"1204416"}}
	const postData = JSON.stringify({agency: agency, type: type, params: params});
	return new Promise((res, rej) => {
		console.log(postData)
		fetch('https://data.oregonbr.com/getScheduleData', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: postData
		})
		.then(rep => {
			return rep.json();
		  })
		.then(x => {
			res(x)
		})
		.catch((err) => console.error(err))
	})
}


//++++++++++++++++++++++++++TIME STUFF+++++++++++++++++++++++++++++++++++
function getTimzoneMidnight(timezone, date = null){
	// Start with UTC midnight of the same calendar date
	//console.log(`getTimezoneMidnight(${timezone}, ${date})`, getRegionDate(timezone))
	date = (date) ? date : getRegionDate(timezone)
	//console.log(date + 'T00:00:00Z')
	const now = new Date(date + 'T00:00:00Z')
    //const utcGuess = new Date(dateStr + 'T00:00:00Z');

    const offsetPart = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'longOffset'
    })
    .formatToParts(now)
    .find(p => p.type === 'timeZoneName')
    .value;

    // Example: "GMT-04:00"
    const match = offsetPart.match(/GMT([+-])(\d{2}):(\d{2})/);

    const sign = match[1] === '+' ? 1 : -1;
    const hours = Number(match[2]);
    const mins = Number(match[3]);

    const offsetSeconds = sign * (hours * 3600 + mins * 60);

    // Midnight local = UTC midnight - offset
    return Math.floor(now.getTime() / 1000) - offsetSeconds;
}

/**
 * Get the time at a specific timezone
 * @param {bigint} epoch time in seconds
 * @param {String} timezone 
 * @returns time at timezone
 */
function getEpochToFormat(epoch, timezone){
	const date = new Date(epoch * 1000);
	const formattedTime = date.toLocaleString('en-US', {
		timeZone: timezone,
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	});
	return formattedTime;
}

function getYMDToEpoch(date, timezone){
	let year = date.slice(0,4);
	let month = date.slice(4, 6);
	let day = date.slice(6,8);

	const m = year + '-'+ month + "-" + day
	const ms = getTimzoneMidnight(timezone, m)
	console.log(year, month, day, timezone, m, ms)
	return ms;
}

/**
 * Get the date of the region in GTFS specific format
 * @param {string} timezone IANA timezone
 * @param {integer} dayOffet number of days offset
 * @returns YYYYMMDD
 */
function getRegionDate(timezone, dayOffet = 0){
	let fecha = new Date();
	fecha.setDate(fecha.getDate() + dayOffet)
	let day = new Intl.DateTimeFormat('en-CA', {timeZone: timezone, dateStyle: 'short'}).format(fecha);
	return day;
}

class ExecutionTimer{
	constructor(time_ms, callback){
		timer = null;
		this.time_ms = time_ms;
		this.callback = callback;

	}
	reset(){
		clearTimeout(this.timer)

		this.timer = setTimeout(() => {
			this.callback;
		}, this.time_ms);
	}
	run() {
		this.callback();
		this.reset();
	}
}

class TimeCheck {
	constructor(time_ms){
		this.time_ms = time_ms;
		this.last_time = null
	}
	reset(){
		this.last_time = Data.now();
	}
	isPassed(){return (Date.now() - this.last_time) > this.time_ms}
}