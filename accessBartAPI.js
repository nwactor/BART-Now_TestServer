const config = require("./config/config.json");
const bartApiKey = config.bartApiKey;
const axios = require("axios");

//LIVE BART MODEL
var stations = require("./Stations");

const bartAPI = {
	getStations: () => stations,
	getTrainETDs: function(io) {
		//get all stations with their trains from the BART api
		axios.get("https://api.bart.gov/api/etd.aspx?cmd=etd&orig=all&json=y&key=" + bartApiKey)
		.then(apiResponse => {
			for(let i = 0; i < stations.length; i++) {
				setStationTrains(stations[i], apiResponse, io);
			}
		}).catch(err => {
			console.log(err);
		});
	}
};

//fill in the trains of this station with apiResponse
//but, if apiResponse doesn't include this station, set its trains to empty array
function setStationTrains(station, apiResponse, io) {
	var stationIsActive = false;
	//take every station from the API response
	//compare it to the station whose trains are being searched for (@param station)
	//if they're the same station, set the trains
	apiResponse.data.root.station.forEach(activeStation => {
		if(activeStation.abbr === station.abbr) {
			station.trains = activeStation.etd;
			stationIsActive = true;

			if(io != null) {
				//emit to all clients in the station's "room"
				io.to(station.abbr).emit("trainUpdate", station.trains);
				console.log("sending updated trains");
			}
		}
	});
	//afterwards
	if(!stationIsActive) {
		station.trains = [];
	}
}

module.exports = bartAPI;