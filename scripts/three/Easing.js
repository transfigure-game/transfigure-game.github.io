Easing = {

	linear: function(percentage) {
		return percentage;
	},

	quadraticIn: function(percentage) {
		return percentage * percentage;
	},

	quadraticOut: function(percentage) {
		return percentage * (2 - percentage);
	},

	quadraticInOut: function(percentage) {
		if((percentage *= 2) < 1) {
			return 0.5 * percentage * percentage;
		}

		return - 0.5 * (--percentage * (percentage - 2) - 1);
	},

	cubicIn: function(percentage) {
		return percentage * percentage * percentage;
	},

	cubicOut: function(percentage) {
		return --percentage * percentage * percentage + 1;
	},

	cubicInOut: function(percentage) {
		if((percentage *= 2) < 1) {
			return 0.5 * percentage * percentage * percentage;
		}

		return 0.5 * ((percentage -= 2) * percentage * percentage + 2);
	},

	quarticIn: function(percentage) {
		return percentage * percentage * percentage * percentage;
	},

	quarticOut: function(percentage) {
		return 1 - (--percentage * percentage * percentage * percentage);
	},

	quarticInOut: function(percentage) {
		if((percentage *= 2) < 1) {
			return 0.5 * percentage * percentage * percentage * percentage;
		}

		return - 0.5 * ((percentage -= 2) * percentage * percentage * percentage - 2);
	},

	quinticIn: function(percentage) {
		return percentage * percentage * percentage * percentage * percentage;
	},

	quinticOut: function(percentage) {
		return --percentage * percentage * percentage * percentage * percentage + 1;
	},

	quinticInOut: function(percentage) {
		if((percentage *= 2) < 1) {
			return 0.5 * percentage * percentage * percentage * percentage * percentage;
		}

		return 0.5 * ((percentage -= 2) * percentage * percentage * percentage * percentage + 2);
	},

	sinusoidalIn: function(percentage) {
		return 1 - Math.cos(percentage * Math.PI / 2);
	},

	sinusoidalOut: function(percentage) {
		return Math.sin(percentage * Math.PI / 2);
	},

	sinusoidalInOut: function(percentage) {
		return 0.5 * (1 - Math.cos(Math.PI * percentage));
	},

	exponentialIn: function(percentage) {
		return percentage === 0 ? 0 : Math.pow(1024, percentage - 1);
	},

	exponentialOut: function(percentage) {
		return percentage === 1 ? 1 : 1 - Math.pow(2, - 10 * percentage);
	},

	exponentialInOut: function(percentage) {
		if(percentage === 0) {
			return 0;
		}

		if(percentage === 1) {
			return 1;
		}

		if((percentage *= 2) < 1) {
			return 0.5 * Math.pow(1024, percentage - 1);
		}

		return 0.5 * (- Math.pow(2, - 10 * (percentage - 1)) + 2);
	},

	circularIn: function(percentage) {
		return 1 - Math.sqrt(1 - percentage * percentage);
	},

	circularOut: function(percentage) {
		return Math.sqrt(1 - (--percentage * percentage));
	},

	circularInOut: function(percentage) {
		if((percentage *= 2) < 1) {
			return - 0.5 * (Math.sqrt(1 - percentage * percentage) - 1);
		}

		return 0.5 * (Math.sqrt(1 - (percentage -= 2) * percentage) + 1);
	},

	elasticIn: function(percentage) {
		var s;
		var a = 0.1;
		var p = 0.4;

		if(percentage === 0) {
			return 0;
		}

		if(percentage === 1) {
			return 1;
		}

		if(!a || a < 1) {
			a = 1;
			s = p / 4;
		} else {
			s = p * Math.asin(1 / a) / (2 * Math.PI);
		}

		return - (a * Math.pow(2, 10 * (percentage -= 1)) * Math.sin((percentage - s) * (2 * Math.PI) / p));
	},

	elasticOut: function(percentage) {
		var s;
		var a = 0.1;
		var p = 0.4;

		if(percentage === 0) {
			return 0;
		}

		if(percentage === 1) {
			return 1;
		}

		if(!a || a < 1) {
			a = 1;
			s = p / 4;
		} else {
			s = p * Math.asin(1 / a) / (2 * Math.PI);
		}

		return (a * Math.pow(2, - 10 * percentage) * Math.sin((percentage - s) * (2 * Math.PI) / p) + 1);
	},

	elasticInOut: function(percentage) {
		var s;
		var a = 0.1;
		var p = 0.4;

		if(percentage === 0) {
			return 0;
		}

		if(percentage === 1) {
			return 1;
		}

		if(!a || a < 1) {
			a = 1;
			s = p / 4;
		} else {
			s = p * Math.asin(1 / a) / (2 * Math.PI);
		}

		if((percentage *= 2) < 1) {
			return - 0.5 * (a * Math.pow(2, 10 * (percentage -= 1)) * Math.sin((percentage - s) * (2 * Math.PI) / p));
		}

		return a * Math.pow(2, -10 * (percentage -= 1)) * Math.sin((percentage - s) * (2 * Math.PI) / p) * 0.5 + 1;
	},

	backIn: function(percentage) {
		var s = 1.70158;

		return percentage * percentage * ((s + 1) * percentage - s);
	},

	backOut: function(percentage) {
		var s = 1.70158;

		return --percentage * percentage * ((s + 1) * percentage + s) + 1;
	},

	backInOut: function(percentage) {
		var s = 1.70158 * 1.525;

		if((percentage *= 2) < 1) {
			return 0.5 * (percentage * percentage * ((s + 1) * percentage - s));
		}

		return 0.5 * ((percentage -= 2) * percentage * ((s + 1) * percentage + s) + 2);
	},

	bounceIn: function(percentage) {
		return 1 - Easing.bounceOut(1 - percentage);
	},

	bounceOut: function(percentage) {
		if(percentage < (1 / 2.75)) {
			return 7.5625 * percentage * percentage;
		}
		else if(percentage < (2 / 2.75)) {
			return 7.5625 * (percentage -= (1.5 / 2.75)) * percentage + 0.75;
		}
		else if(percentage < (2.5 / 2.75)) {
			return 7.5625 * (percentage -= (2.25 / 2.75)) * percentage + 0.9375;
		}
		else {
			return 7.5625 * (percentage -= (2.625 / 2.75)) * percentage + 0.984375;
		}
	},

	bounceInOut: function(percentage) {
		if(percentage < 0.5) {
			return Easing.bounceIn(percentage * 2) * 0.5;
		}

		return Easing.bounceOut(percentage * 2 - 1) * 0.5 + 0.5;
	},

};
