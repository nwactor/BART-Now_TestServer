const express = require("express");
const app = express();
const server = require('http').createServer(app);  
const socketio = require("socket.io");
const io = socketio(server);
const bartAPI = require("./accessBartAPI");

//set up routes for serving html for web app
// var routes = require("./routes/routes");
// app.use("/", routes);

//=======================================================================
//=========================== socket handling ===========================
//=======================================================================

io.on('connection', client => {
	console.log("Client connected: " + client);
	client.station = null;
	client.on('stationRequested', stationAbbr => onNewStationRequest(stationAbbr, client));
});

//make the client a reciever of the new station, instead of their old one
//call helper function send client the trains for given station
function onNewStationRequest(stationAbbr, client) {
	client.leave(client.station);
	client.station = stationAbbr;
	client.join(client.station);
	sendUpdatedTrains(client, stationAbbr);
}

//send a client the trains for given station 
function sendUpdatedTrains(client, stationAbbr) {
	bartAPI.getStations().forEach(station => {
		if(station.abbr === stationAbbr) {
			client.emit("trainUpdate", station.trains);
			return;
		}
	});
}

//=======================================================================
//========================= end socket handling =========================
//=======================================================================

function mainUpdateLoop() {
	console.log("entering update loop");
	bartAPI.getTrainETDs(sendUpdatesToClients);
}

function sendUpdatesToClients() {
	console.log("Sent updates to clients!");
}

//check for new trains every 60 seconds
// bartAPI.getTrainETDs(io);
// var checkBartAPI = setInterval(bartAPI.getTrainETDs, 60000, io);


//start app listening

const PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
	console.log("App listening on PORT " + PORT);
});