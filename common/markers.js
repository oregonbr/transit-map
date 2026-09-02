// DOTS
function updateVehicleDots(age){
	agencyName = age.agency
	vehicles = age.vehicleData
	if(vehicles == null){return;}
	vehicles.forEach(function(veh){
		try{
			if(age.real_type == "trimet"){
				lat = veh.latitude
				lon = veh.longitude
			}
			else if(age.real_type.includes("umo")){
				lat = veh.lon
				lon = veh.lat
			}
			else{
				if(!("position" in veh.vehicle)){return}
				lat = veh.vehicle.position.latitude;
				lon = veh.vehicle.position.longitude;
			}
			
		}
		catch(e){console.error("Vehicle:", veh.vehicle, "has issue", "Agency:"+agencyName, e)}
	})
}


function placeVehicleMarkers(timed = false){
	let stale_time = (settingsData.stale_time_sec*60);

	vehicleLayer.clearGroup()

	const currentUTC = Math.floor(Date.now() / 1000);
	//console.log(mappedVehicles)
	for(v of mappedVehicles){
		let real_feed_id = v.real_feed_id		
		let v_id = v.vehicle_id
		const time = (Math.floor(new Date(v.timestamp).getTime()) / 1000);
		//console.log("d", time - currentUTC, time ,currentUTC, v.last_updated)

		const IS_STALE = (currentUTC - time > stale_time);
		const ON_TRIP = (v.trip) ? true:false;
		const HAS_ROUTE = (v.route)?true:false;

		if(!settingsData.hide_stale && IS_STALE){
			continue;
		}

		if(real_feed_id === 22){
             v_id = v_id.split("_")
             v_id = v_id[2]
         }

		let lon = v.lon;
		let lat = v.lat;

		let trip_type = 3;	// default to bus for lights
		let trip_short_name = null
		let trip_info;
		let route_info;
		if(ON_TRIP){
			trip_info = v.trip
		}
		if(HAS_ROUTE){
			route_info = v.route
			trip_type = route_info.type
			trip_short_name = route_info.short_name
		}

		// decide to continnue if display on toute only
		if((!ON_TRIP || !HAS_ROUTE) && settingsData.display_onlyonroute) continue
		const IS_BEARING = (v.bearing != -1 && settingsData.display_bearing)
		let mark = IS_BEARING ? bearingMarker(v.bearing, trip_type) : standardMarker()
		let vehBody = mark.getElementsByClassName("mainVehColor")[0];

		vehBody.style.borderColor = agency_database.getColor(agency_database.getAgencyIdFromRealId(v.real_feed_id)); 

		if(!IS_STALE)
		{
			if(HAS_ROUTE){
				switch(trip_type){
					case 0:
					case 1:
					case 2:
						vehBody.style.backgroundColor = "#"+route_info.color
						vehBody.style.color = "white"; 
						vehBody.style.borderColor = 'black'; 
						break;
					default:
					case 3:
						if(v.agency_id == "2" && (route_info.id == "050" || route_info.id == "051")){
							vehBody.style.backgroundColor = "#"+route_info.color
							vehBody.style.color = "white";
							vehBody.style.borderColor = 'black';
						}
						break;
				}
			}
		}
		else{
			vehBody.style.backgroundColor = "#bebebe"
		}
		

		// text marker
		let topText;
		let topData = settingsData.bus_icon_layout.top
		if(topData == "vid"){topText = v_id}
		else if(topData == "num" && trip_short_name != null){topText = trip_short_name}
		else{topText = ''}
		
		let bottomText;
		let bottomData = settingsData.bus_icon_layout.bottom
		if(bottomData == "vid"){bottomText = v_id}
		else if(bottomData == "num" && trip_short_name != null){bottomText = trip_short_name}
		else{bottomText = ''}
	
		// clean top and bottom
		topText = filterText(topText)
		bottomText = filterText(bottomText)

		if(IS_BEARING){
			let center = '';
		 	if(topText != "" && bottomText != "" ){center = ' | '}
		 	let iconFinalText = "<p>"+topText + center+ bottomText+"</p>"
			vehBody.innerHTML = iconFinalText
		}
		else
		{
			//console.log(topText, mark)
			mark.getElementsByClassName('mainVehComponent-top')[0].innerText = topText;
			mark.getElementsByClassName('mainVehComponent-bottom')[0].innerText = bottomText;
		}


		let details = {
			...v
		}
		if(ON_TRIP){details.trip = v.trip}
		if(HAS_ROUTE){details.route = v.route}

		// if selected
		if(clickedVehicle){
			if(clickedVehicle.isSelected(real_feed_id, v_id)){
				//console.log("Vehicle Update", timed)
				clickedVehicle.update(details, timed)
			}
		}
		

		let obj = new maplibregl.Marker({element: mark, rotationAlignment: 'map'})
			.setLngLat([lon, lat])
		obj.vehicleInfo = details
		obj.getElement().addEventListener("click", (e) => {
			if(clickedVehicle){
				if(clickedVehicle.isSelected(obj.vehicleInfo.real_feed_id, obj.vehicleInfo.vehicle_id)){
					return
				}
			}
			clickedVehicle = new SelectedVehicle(obj.vehicleInfo)
		});
		vehicleLayer.addMarker(obj);
		obj.addTo(map)
	}


	function findTrip(trip_id){
		return binarySearchObjectArray(trips, "trip_id", trip_id)
	}
}

function bearingMarker(degree, type){
	if(degree == null){degree = 0;}

	let mD = document.createElement('div')
	mD.setAttribute('class', 'mainDot')
	let mainc = document.createElement('div')
	
	mainc.setAttribute('class', 'mainRotContainer')
	if(type == 'rail' || (type >=0 && type <= 2)){
		mainc.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102.76 193.67"><path class="cls-1" d="M72.66,0L0,96.84l72.66,96.84c40.13-53.48,40.13-140.19,0-193.67Z"/></svg>'
		mainc.classList.add('rail');
	}
	else{
		mainc.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80.11 306.16' fill: #fff200><path d='M53.3,144.56c9.93-12.64,25.61-36.75,26.74-68.62C81.32,40.02,63.42,12.9,53.3,0,38.14,21.3,19.53,45.22,3.43,67.23c-4.76,6.51-4.55,14.12.7,20.47,15.94,19.3,34.23,36.81,49.17,56.86Z'></path><path class='cls-1' d='M3.41,228.83c-4.76,6.51-4.55,14.12.7,20.47,15.94,19.3,34.23,36.81,49.17,56.86,9.93-12.64,25.61-36.75,26.74-68.62,1.27-35.93-16.62-63.04-26.74-75.95-15.16,21.3-33.77,45.22-49.87,67.23Z'></path></svg>"
	}
	
	let vB = document.createElement('div')
	vB.classList.add('lato-bold', 'mainVehBody', 'mainVehColor');

	mainc.style.rotate = +(degree-90)+'deg';

	mainc.prepend(vB)
	mD.append(mainc)
	
	return mD
}
function standardMarker(){
	let mD = document.createElement('div');
	mD.setAttribute('class', 'mainDot');
	let mC = document.createElement('div');
	mC.classList.add('mainVehDetail', "mainVehColor", 'lato-bold');

	// create top and bottom
	let top = document.createElement("div")
	let bottom = document.createElement("div")

	// add class
	top.classList.add('mainVehComponent', 'mainVehComponent-top');
	bottom.classList.add('mainVehComponent', 'mainVehComponent-bottom');

	// add id
	top.id = "top";
	bottom.id = "bottom"

	// append and return
	mC.append(top, bottom);
	mD.append(mC);
	return mD
}