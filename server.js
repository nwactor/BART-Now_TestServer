const config = require("./config/config.json");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const bartApiKey = config.bartApiKey;

var PORT = process.env.PORT || 8080;

var app = express();
app.use(bodyParser.json()); //alow app to parse JSON from requests

//start app listening on port
app.listen(PORT, function() {
	console.log("App listening on PORT " + PORT);
});


//LIVE BART MODEL
var stations = require("./Stations");

//Hit the BART API
function checkBartAPI() {
	axios.get("https://api.bart.gov/api/etd.aspx?cmd=etd&orig=all&json=y&key=" + bartApiKey)
		.then(apiResponse => {
			for(let i = 0; i < stations.length; i++) {
				setStationTrains(stations[i], apiResponse);
			}
			console.log(stations);
		}).catch(err => {
			console.log(err);
		});
}

checkBartAPI();

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