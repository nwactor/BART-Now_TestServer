const express = require("express");
const app = express();
const server = require('http').createServer(app);  
const socketio = require("socket.io");
const websocket = socketio(server);
const bartAPI = require("./accessBartAPI");

//set up routes for serving html for web app
// var routes = require("./routes/routes");
// app.use("/", routes);

//socket handling
// websocket.on('', (socket) => {

// });

//start app listening
const PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
	console.log("App listening on PORT " + PORT);
});

bartAPI.getStationETDs();