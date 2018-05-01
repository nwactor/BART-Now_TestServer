class Station = {
	constructor(name, abbr, location) {
		this.name = name;
		this.abbr = abbr;
		this.location = location;
		this.trains = [];
	}
}

module.exports = Station;