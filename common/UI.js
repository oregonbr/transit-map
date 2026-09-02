//const { agencyStructure } = require("../../../../../oregonbr-data/htdocs/data.oregonbr.com/data_structure");

class SettingButton {
    onAdd(map) {
        this._map = map;

        this._container = document.createElement('div');
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

        const button = document.createElement('button');
        button.type = 'button';
        button.title = 'Map Settings';
        button.classList.add('mapUIbuttonIcon')
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>`;

        button.addEventListener('click', () => {
            settingsUI.toggle()
        });

        this._container.appendChild(button);

        return this._container;
    }

    onRemove() {
        this._container.remove();
    }
}
class LocationButton {
    onAdd(map) {
        this._map = map;

        this._container = document.createElement('div');
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

        const button = document.createElement('button');
        button.type = 'button';
        button.title = 'Map Locations';
        button.classList.add('mapUIbuttonIcon')
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5ZM480-260q45-45 80-93 30-41 55-90t25-97q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 48 25 97t55 90q35 48 80 93Zm-42.5-237.5Q420-515 420-540t17.5-42.5Q455-600 480-600t42.5 17.5Q540-565 540-540t-17.5 42.5Q505-480 480-480t-42.5-17.5Z"/></svg>`;

        button.addEventListener('click', () => {
            locationUI.toggle()
        });

        this._container.appendChild(button);

        return this._container;
    }

    onRemove() {
        this._container.remove();
    }
}
class AlertsButton {
    onAdd(map) {
        this._map = map;

        this._container = document.createElement('div');
        this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

        const button = document.createElement('button');
        button.type = 'button';
        button.title = 'Agency Alerts';
        button.classList.add('mapUIbuttonIcon')
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M171.08-709.23H417 171.08ZM240-440h-80 480-400Zm-59.23 340q-12.77 0-21.38-8.62-8.62-8.61-8.62-21.38v-78.92q-21.92-15.23-36.35-43.04Q100-279.77 100-307.69V-680q0-76.69 78.27-108.34Q256.54-820 445.23-820q-9.15 13.77-16.15 28.58-7 14.81-12.08 30.8-114.69 2-172.31 14.31-57.61 12.31-73.61 37.08h235.38q-1.84 15-1.84 30t2.23 30H160V-500h321.77q16.23 18.23 35.5 33.54 19.27 15.31 42.19 26.46H160v120q0 33 23.5 56.5T240-240h320q33 0 56.5-23.5T640-320v-94.54q15 2.23 30 2.23t30-1.84v106.46q0 27.92-14.42 55.73-14.43 27.81-36.35 43.04V-130q0 12.77-8.62 21.38Q632-100 619.23-100h-24.62q-12.76 0-21.38-8.62-8.61-8.61-8.61-21.38v-50H235.38v50q0 12.77-8.61 21.38-8.62 8.62-21.38 8.62h-24.62Zm491.54-400q-74.93 0-127.46-52.54-52.54-52.54-52.54-127.46 0-74.31 52.23-127.15Q596.77-860 672.31-860q74.92 0 127.46 52.54 52.54 52.54 52.54 127.46 0 74.92-52.73 127.46Q746.84-500 672.31-500Zm-17.7-147.69H690v-140h-35.39v140Zm17.7 76.92q8 0 13.42-5.62 5.42-5.61 5.81-13.23 0-8-5.62-13.8-5.61-5.81-13.61-5.81-8 0-13.62 5.61-5.61 5.62-5.61 13.62 0 8 5.61 13.61 5.62 5.62 13.62 5.62Zm-375.2 267.88q15.2-15.19 15.2-37.11t-15.2-37.11q-15.19-15.2-37.11-15.2t-37.11 15.2q-15.2 15.19-15.2 37.11t15.2 37.11q15.19 15.2 37.11 15.2t37.11-15.2Zm280 0q15.2-15.19 15.2-37.11t-15.2-37.11q-15.19-15.2-37.11-15.2t-37.11 15.2q-15.2 15.19-15.2 37.11t15.2 37.11q15.19 15.2 37.11 15.2t37.11-15.2Z"/></svg>`;

        button.addEventListener('click', () => {
            alertsUI.toggle()
            if (uiOverlay.isDisplay()) alertsDatabase.update();
        });

        this._container.appendChild(button);

        return this._container;
    }

    onRemove() {
        this._container.remove();
    }
}

class MapOverlay {
    constructor() {
        this.popout = this.createContainer();
        this.contentDisplay;
        this.content;
        this.title;
        this.onDisplay = false;
        this.content_id = null;
    }

    createContainer() {
        let main = document.createElement("div");
        main.classList.add("mapUIPopout");

        let title = document.createElement("div");
        title.classList.add("mapUIPopoutTitle")
        title.textContent = "";
        this.title = title;

        let container = document.createElement("div");
        container.classList.add("mapUIPopoutContainer");
        this.contentDisplay = container;

        let closeButton = document.createElement("div");
		closeButton.classList.add("mapUIcloseButton");
		closeButton.innerText = "X";
		closeButton.addEventListener("click", (e) => {
            this.close();
		});
        main.append(closeButton, title, container)

        return main;
    }

    /**
     * set size of the popup
     * @param {string} size size of the popup
     */
    setSize(size){
        this.popout.classList.remove("large", "small", "medium")
        this.popout.classList.add(size)
    }

    /**
     * Set the content for the screen
     * @param {UIContent} content the stuff to be displayed
     */
    setContent(content, text = null){
        if(this.content) {this.contentDisplay.children[0].remove();this.content.close();}
        this.content = content;
        if(text) this.setTitle(text);
        this.contentDisplay.append(this.content.get())
    }

    setTitle(text){console.log(this.title, text);this.title.textContent = text;}

    displayPopout(){
        let main = document.getElementById("mapContainer");
        main.append(this.popout)
        this.onDisplay = true;
    }
    close(){
        this.popout.remove();
        this.onDisplay = false;
    }
    isDisplay(){return this.onDisplay;}
    getId(){return (this.content)? this.content.id : null;}
}

class UIContent {
    static checkmark = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>'

    constructor(id) {
        this.id = id
        this.onDisplay = false; /// for checking is something is showing
        this.content = this.createContent(); // the stuff we see
    }

    createContent(){
        let main = document.createElement("div")
        main.classList.add("mapUIContent")
        main.id = this.id
        return main
    }

    // name title, data we have with current, optons, selctked key
    createDropdown(name, data, options, selectedData, behavior = null){
        let main = document.createElement("div")
        main.classList.add("mapUIDropdown")

        let title = document.createElement("div")
        title.textContent = name

        let buttonContain = document.createElement("div")
        buttonContain.classList.add("buttonContain")
        
        // set to current option
        let button = document.createElement("div")
        button.textContent = options[data[selectedData]]
        button.classList.add("button")

        let dropContain = document.createElement("div");
        dropContain.classList.add("dropdown", "hide")
        
        // add all options
        for(const [key, value] of Object.entries(options)){
            let ele = document.createElement("div")
            ele.classList.add("element")
            ele.textContent = value
            ele.value = key

            // if it's what we was selected
            if(key == data[selectedData]){
                ele.classList.add("selected")
            }

            dropContain.append(ele)
        }

        buttonContain.append(button, dropContain)

        // button delegation!!!
        dropContain.addEventListener("click", (e) => {
            const element = event.target.closest("div")
            // if not the element
            if(!element.classList.contains("element")){
                return
            }

            //console.log(element.value, element)

            // reassign settings
            data[selectedData] = element.value;

            // highlight new
            // get parent
            let container = element.parentElement;
            console.log(container.children)

            // for each element remove selected
            for(let ele of container.children){
                ele.classList.remove("selected")

                // if element value is new selected, add it
                if(ele.value == data[selectedData]){
                    ele.classList.add("selected")
                }
            }
            button.textContent = options[data[selectedData]]

            // if there is something to do after, do it
            if(behavior){
                behavior()
            }
        })

        // add toggle for display
        button.addEventListener("click", (e)=>{
            (dropContain.style.display == "flex") ? dropContain.style.display = "none" : dropContain.style.display = "flex"
        })

        main.append(title, buttonContain)

        return main;
    }

    createCheckmark(title, data, selected, behavior = null){
        let main = document.createElement("div")
        main.classList.add("mapUICheckmark")

        main.textContent = title;

        let check = document.createElement("div");
        check.classList.add("icon")

        // set check now
        check.innerHTML = data[selected] ? UIContent.checkmark : ""

        // add event listener
        check.addEventListener("click", (e) => {
            const element = e.target;
            data[selected] = !data[selected];

            check.innerHTML = data[selected] ? UIContent.checkmark : ""
            if(behavior){
                behavior()
            }
        })

        main.append(check)
        return main;
    }

    createLoadingScreen(){
        let main = document.createElement("div")
        main.classList.add("lato-regular", "loading")
        main.textContent = "loading"

        return main;
    }

    createTabContainer(){
        let tagContainer = document.createElement("div")
        tagContainer.classList.add("mapUItabContainer")
        return tagContainer;
    }
    createTabElement(name, id){
        let tab = document.createElement("div")
        tab.textContent = name;
        tab.id = id
        tab.classList.add("mapUItab")
        return tab
    }

    createTextBox(name, id, after_name,  start_value, width, callback){
        let main = document.createElement("div")
        main.classList.add("mapUIinputText")
        main.id = id;

        let title = document.createElement("div")
        title.textContent = name

        let input = document.createElement("input")
        input.type = "text";
        input.onchange = callback;
        input.style.width = width
        if (start_value) input.value = start_value;

        let after = ""
        if(after_name){
            after = document.createElement("div")
            after.textContent = after_name
        }

        main.append(title, input, after);
        return main
    }

    /**
     * get the viable conntet
     */
    get(){return this.content;}
    /**
     * Set the viable conntent
     * @param {HTMLDocument} content 
     */
    set(content){this.content = content;}
    show(){
        uiOverlay.setSize("small")
        uiOverlay.setContent(this, "")
        uiOverlay.displayPopout()
    }
    close(){
        uiOverlay.close()
    }
    toggle(){
        if(uiOverlay.isDisplay()) {
            this.close();
            if(uiOverlay.getId() != this.id){
                this.show();
                return;
            }
        } 
        else this.show()
    }
    getId(){return this.id}
}

class SettingContent extends UIContent {
    static vIconOptions = {
        "num": "Route",
        "vid": "Vehicle",
        "no": "None"
    }
    constructor(id) {
        super(id)
    }

    createContent(){
        let main = document.createElement("div");
        main.classList.add("mapUIContent")

        let title = document.createElement("div")
        title.textContent = "Settings"
        title.classList.add("mapUIPopoutTitle", "lato-bold")

        let topDrop = this.createDropdown(
            "Icon Top: ", 
            settingsData.bus_icon_layout,
            SettingContent.vIconOptions,
            "top",
            placeVehicleMarkers
        )
        let bottomDrop = this.createDropdown(
            "Icon Bottom: ", 
            settingsData.bus_icon_layout,
            SettingContent.vIconOptions,
            "bottom",
            placeVehicleMarkers
        )
        let stale = this.createCheckmark("Dispaly Stale", settingsData, "hide_stale", placeVehicleMarkers)
        let stale_time = this.createTextBox("Stale Time", "settings-stale_time", "Mins", settingsData.stale_time_sec, "25px", (e) =>{
            let value = Number(e.target.value);
            console.log(value)
            if(Number.isNaN(value)) return;
            settingsData.stale_time_sec = value
            getVehicles();
            
        })
        let onroute = this.createCheckmark("Dispaly On Route", settingsData, "display_onlyonroute", placeVehicleMarkers)
        let bearing = this.createCheckmark("Dispaly Rotation", settingsData, "display_bearing", placeVehicleMarkers)

        
        main.append(topDrop, bottomDrop, stale, stale_time, onroute, bearing)
        return main;
    }

    show(){
        uiOverlay.setSize("small")
        uiOverlay.setContent(this, "Settings", this.id)
        uiOverlay.displayPopout()
    }
}

class ScheduleContent extends UIContent {
    constructor(id) {
        super(id)
    }

    createContent(){
        return this.createLoadingScreen();
    }

    async getBlockContent(static_feed_id, block_id, start_date, real){
        this.set(this.createLoadingScreen())
        uiOverlay.setContent(this)

        console.log(static_feed_id, block_id, start_date, real)
        let [y, i] = await getBlockInfo(static_feed_id, block_id, start_date)
        console.log(y, i)
        let tz = agency_database.getTimezone(agency_database.getAgencyIdFromRealId(real))
        let time = (start_date)? getYMDToEpoch(start_date, tz) : getTimzoneMidnight(tz)

        // create the structure
        //let table = this.createTableStructure()

        // add the body elements

        let main = document.createElement("div");
        main.classList.add("mapUIScheduleTable")
        main.append(this.createTableStructure())

        for(let row of y){
            const color = row.color;
            const short_name = row.short_name;
            let tr = document.createElement('div');
            tr.classList.add("mapUIScheduleSecHeader")
            
            // route number
            let route = document.createElement("div");
            route.classList.add("route", "cell")

            let sn_icon = document.createElement("div")
            sn_icon.classList.add("lato-bold")
            if(short_name){
                sn_icon.classList.add("number_icon")
                sn_icon.textContent = filterText(row.short_name);
                sn_icon.style.backgroundColor = "#"+row.color;
                sn_icon.style.color = "#"+row.color_text;
            } else {
                sn_icon.classList.add("color_icon")
                sn_icon.style.backgroundColor = "#"+row.color;
            }
            

            let name = document.createElement("div")
            name.textContent = row.headsign
            name.classList.add("text")

            route.append(sn_icon, name)

            let timesDis = document.createElement("div")
            let three = `${getEpochToFormat((row.start_time + time), tz)} - ${getEpochToFormat((row.end_time + time), tz)}`
            //console.log(three, getEpochToFormat((row.start_time + time), tz))
            timesDis.textContent = three
            timesDis.classList.add("text", "times", "cell")

            let stop_cnt = document.createElement("div")
            stop_cnt.classList.add("cell", "stops", "text")
            stop_cnt.textContent = `Count: ${row.stop_count}`

            let details = document.createElement("div");
            details.classList.add("tripDetails", "hide");
            details.id = "t-" + row.trip_id;

            // // encaspulate the details
            // let details_main = document.createElement("tr")
            // let details_td = document.createElement("td")
            // details_td.colSpan = 4;
            // details_td.append(details)
            // details_main.append(details_td)

            tr.append(route, timesDis, stop_cnt);

            tr.addEventListener("click", (e) => {
                let box = document.getElementById("t-" + row.trip_id);
                box.classList.toggle("hide")
            });
            
            main.append(tr, details)
        }

        // add arrival time
        for(let line of i){
            let box = main.querySelector("#t-" + line.trip_id);
            //console.log(box)
            let stop = document.createElement("div");
            stop.innerText = getEpochToFormat((line.arrival + time), tz) + " | " + line.stop_id + " | " + line.name
            box.append(stop)
        }

        this.set(main);
        uiOverlay.setContent(this, `Block: ${block_id} Schedule`)
        uiOverlay.displayPopout() // keep this bc idr why it closes
    }

    show(static_feed_id, block_id, start_date, real){
        uiOverlay.setSize("large")
        uiOverlay.setContent(this, "Schedule", this.id)
        this.getBlockContent(static_feed_id, block_id, start_date, real);
        uiOverlay.displayPopout()
    }

    /**
     * creates the default head
     */
    createTableStructure(){
        let main = document.createElement('div')
        main.classList.add("mapUIScheduleSecHeader")

        let route = document.createElement("div");
        route.textContent = "Route"
        route.classList.add("text_head", "cell","route")
        


        let timesDis = document.createElement("div")
        timesDis.textContent = "Times"
        timesDis.classList.add("text_head", "times", "cell")

        let stop_cnt = document.createElement("div")
        stop_cnt.classList.add("cell", "stops", "text_head")
        stop_cnt.textContent = "Stop Count"

        main.append( route, timesDis, stop_cnt)

        return main;
    }

    


}
class StopContent extends UIContent {
    constructor(id) {
        super(id)
    }

    createContent(){
        let main = document.createElement("div");
        main.classList.add("mapUIContent")

        let title = document.createElement("div")
        title.textContent = "Schedules"
        title.classList.add("mapUIPopoutTitle", "lato-bold")
        
        return main;
    }

    show(){
        uiOverlay.setSize("large")
        uiOverlay.setContent(this, "", this.id)
        uiOverlay.displayPopout()
    }
}

class LocationContent extends UIContent {
    constructor(id) {
        super(id)
        this.data = {
            state :null,
            city: null,
            region: null,
            other: null,
        }
        this.id = "location_content"
    }

    createContent(){
        let main = document.createElement("div");
        main.classList.add("mapUIContent")

        // create selectable tabs, not confused with tag
        let tagContainer = this.createTabContainer()

        let statesTab = this.createTabElement("States", "ui_statesTab");
        statesTab.addEventListener("click", () =>{
            this.populateTabDropdown("state")
        })
        
        let citiesTab = this.createTabElement("Cities", "ui_citiesTab");
        citiesTab.addEventListener("click", () =>{
            this.populateTabDropdown("city")
        })

        let regionTab = this.createTabElement("Regions", "ui_regionsTab");
        regionTab.addEventListener("click", ()=>{
            this.populateTabDropdown("region")
        })
        
        tagContainer.append(statesTab,citiesTab, regionTab)

        let tadDrop = this.createTabDropdown()

        main.append(tagContainer, tadDrop)
        this.drop = tadDrop;
        return main;
    }

    // this is the initial. will get data is not existant
    createTabDropdown(){
        let main = document.createElement("div")
        main.classList.add('mapUItabButtonDropdown', "hide")
        main.textContent = "loading"
        return main;
    }

    // populate drop
    async populateTabDropdown(type){
        // is missing data
        if(!this.data[type]){
            let d = await fetch("https://data.oregonbr.com/getMapLocations/" + type)
            this.data[type] = await d.json();
        }

        let locations = this.data[type]
        this.drop.innerHTML = ""
        this.drop.classList.remove("hide")
        //iterate each
        for(const loc of locations){
            let ele = document.createElement('div')
            ele.textContent = loc.name
            ele.classList.add("mapUIDropdownButtonElement", "lato-light")

            // add listeners
            ele.addEventListener("click", ()=>{
                map.jumpTo({center: [loc.lng, loc.lat], zoom:loc.zoom})

                const url = new URL(window.location.href);
                url.searchParams.set("region", loc.code);
                window.history.pushState({}, '', url);
            })
            
            this.drop.append(ele);
        }

    }


    show(){
        uiOverlay.setSize("small")
        uiOverlay.setContent(this, "Jump To...", this.id)
        uiOverlay.displayPopout()
    }
}

class AlertsContent extends UIContent {
    constructor(id) {
        super(id)
        this.alerts_list_id = "mapUIAlertList"
        this.alerts_list = null;
        this.header_list = null;

        this.selected_agency = null
    }
    
    initialize() {
        let display = document.getElementById(this.id)
        console.log(display)

        let header_list = document.createElement('div')
        header_list.classList.add("mapUIalertsAgencyTab", "no-scrollbar", 'hide')
        this.header_list = header_list;

        let alerts_container = document.createElement('div')
        alerts_container.classList.add("mapUIalertsList")
        this.alerts_list = alerts_container;
        //alerts_container.id = this.alerts_list_id;

        display.append(header_list, alerts_container)
    }

    updateContent() {
        if(!this.alerts_list){this.initialize()}

        //let data = alertsDatabase.getAlerts()
        let visable = visableAgencies.getIsOnDisplay()

        if(visable){
            //console.log("show alerts", alertsDatabase.getVisableAlerts().length)
            if(alertsDatabase.getVisableAlerts().length){this.refresh()}
            else {this.createNoAlerts();}
        }
        else{
            console.log('show closer')
            this.createZoomToSee()
        }
        
    }

    createNoAlerts(){
        this.hideHeader()

        let main = document.createElement("div")
        main.textContent = "There are no alerts at this moment"

        this.alerts_list.replaceChildren(main)
    }
    createZoomToSee(){
        this.hideHeader()

        let main = document.createElement("div")
        main.textContent = "Zoom Closer to see alerts"

        this.alerts_list.replaceChildren(main)
    }

    createUpdaingData(){
        let main = document.createElement("div")
        main.textContent = "Fetching data"

        let display = document.getElementById(this.id)
        display.innerHTML = ''
        display.append(main)
    }

    refresh(){
        this.showHeader()
        let visable_agencies = alertsDatabase.getVisableAlerts();
        console.log(visable_agencies)

        let p = []
        for(let id of visable_agencies){
            let y = this.createAgencyIcon(id)
            p.push(y)
        }

        this.header_list.replaceChildren(...p)
        //remove not here
        // for(let r of agency_icons){
        //     let o = r.id.split("-");
        //     let id = o[1]
        //     r.remove()            
        //     // we don't have this one
        //     // if (linearSearch(visable_agencies, id) == -1){
        //     //     console.log("removed", id)
        //     //     document.getElementById("alerts_agency_icon-" + id).remove()
        //     // }
        // }
        
        // add missing
        

    }

    createAgencyIcon(agency_id){
        let agency_info = agency_database.getAgencyData(agency_id)
        //console.log(agency_info)

        let agency_icon = document.createElement("div");
        agency_icon.id = "alerts_agency_icon-" + agency_id;
        agency_icon.classList.add('mapUIalertsAgencyIcon')
        agency_icon.innerText = (agency_info.title_short) ? agency_info.title_short : agency_info.title;

        agency_icon.style.backgroundColor = agency_info.color
        agency_icon.style.color = "white"

        agency_icon.addEventListener('click', ()=>{
            this.selected_agency = agency_id
            this.setAlert(this.selected_agency)
            //alertsDatabase.fetchAgencyAlerts(agency_id, this.updateAlertsList);
        })
        return agency_icon;
    }

    async setAlert(id){
        if(!alertsDatabase.hasAlerts(id)){
            await alertsDatabase.fetchAgencyAlerts(id)
        }

        let value = alertsDatabase.getAgencyAlerts(id); 

        let agency_container = this.alerts_list
        agency_container.innerHTML = ''
        console.log(agency_container)

        let alerts = value.alerts
        let routes = value.routes
        // console.log(value)
        for(const [route_id, value_alerts] of Object.entries(alerts)){
            // let ele = document.createElement("div")
            // ele.classList.add("mapUIAlertSegment")
            //console.log(route_id, route_id != "null")
            if(route_id != "null"){
                let route_num = document.createElement("div")
                route_num.classList.add("mapUIRouteHeader")

                let numb = document.createElement("div")
                numb.classList.add('number_icon', "lato-bold")
                //console.log(routes[route_id].color)
                numb.textContent = routes[route_id].short_name
                numb.style.backgroundColor = "#"+routes[route_id].color
                numb.style.color = "#"+routes[route_id].color_text

                let rout = document.createElement("div")
                rout.classList.add('lato-regular', "text")
                rout.textContent = routes[route_id].long_name

                route_num.append(numb, rout)

                agency_container.append(route_num)
            }

            for (const route_alert of value_alerts){
                let desc = document.createElement('div')

                let t = ''
                if(route_alert.header) t += `<h4>${route_alert.header}</h4>`
                if(route_alert.description) t += `<p>${route_alert.description}</h4>`
                desc.innerHTML = t;
                agency_container.append(desc)
            }
            
        }
    }

    updateAlertsList(){
        //his = alertsUI;
        if(alertsDatabase.hasAlerts(alertsUI.selected_agency)){
            alertsUI.createUpdaingData();
            return;
        }

        let value = alertsDatabase.getAgencyAlerts(alertsUI.selected_agency); 

        let agency_container = document.getElementById(alertsUI.alerts_list_id)
        agency_container.innerHTML = ''

        let alerts = value.alerts
        let routes = value.routes
        // console.log(value)
        for(const [route_id, value_alerts] of Object.entries(alerts)){
            // let ele = document.createElement("div")
            // ele.classList.add("mapUIAlertSegment")
            //console.log(route_id, route_id != "null")
            if(route_id != "null"){
                let route_num = document.createElement("div")
                route_num.classList.add("mapUIRouteHeader")

                let numb = document.createElement("div")
                numb.classList.add('number_icon', "lato-bold")
                //console.log(routes[route_id].color)
                numb.textContent = routes[route_id].short_name
                numb.style.backgroundColor = "#"+routes[route_id].color
                numb.style.color = "#"+routes[route_id].color_text

                let rout = document.createElement("div")
                rout.classList.add('lato-regular', "text")
                rout.textContent = routes[route_id].long_name

                route_num.append(numb, rout)

                agency_container.append(route_num)
            }

            for (const route_alert of value_alerts){
                let desc = document.createElement('div')

                let t = ''
                if(route_alert.header) t += `<h4>${route_alert.header}</h4>`
                if(route_alert.description) t += `<p>${route_alert.description}</h4>`
                desc.innerHTML = t;
                agency_container.append(desc)
            }
            
        }
        
    }

    hideHeader(){
        this.header_list.style.display = 'none'
    }
    showHeader(){
        this.header_list.style.display = ''
    }
    show(){
        uiOverlay.setSize("medium")
        uiOverlay.setContent(this, "Service Alerts", this.id)
        uiOverlay.displayPopout()
    }
}