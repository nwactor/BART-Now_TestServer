const config = require("./config/config.json");
const bartApiKey = config.bartApiKey;
const axios = require("axios");

//LIVE BART MODEL
var stations = require("./Stations");

const bartAPI = {
	stations: stations,
	getStationETDs: function() {
		axios.get("https://api.bart.gov/api/etd.aspx?cmd=etd&orig=all&json=y&key=" + bartApiKey)
		.then(apiResponse => {
			for(let i = 0; i < stations.length; i++) {
				setStationTrains(this.stations[i], apiResponse);
			}
			console.log(this.stations);
		}).catch(err => {
			console.log(err);
		});
	}
};

//fill in the trains of this station with apiResponse
//but, if apiResponse doesn't include this station, set its trains to empty array
function setStationTrains(station, apiResponse) {
	var stationIsActive = false;
	apiResponse.data.root.station.forEach(activeStation => {
		if(activeStation.abbr === station.abbr) {
			station.trains = activeStation.etd;
			stationIsActive = true;
		}
	});
	//afterwards
	if(!stationIsActive) {
		station.trains = [];
	}
}

module.exports = bartAPI;