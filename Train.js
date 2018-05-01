class Train {
	constructor(destination, direction, platform, color, hexcolor, minutes, delay) {
		this.destination = destination;
		this.direction = direction;
		this.platform = platform;
		this.color = color;
		this.hexcolor = hexcolor;
		this.minutes = minutes;
		this.delay = delay;
		if(parseInt(minutes) != 'NaN' && parseInt(delay) != 'NaN') {
			this.eta = parseInt(minutes) + parseInt(delay);
		} else {
			this.eta = minutes;
		}
	}
}

module.exports = Train;