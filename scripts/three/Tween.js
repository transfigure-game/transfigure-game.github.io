Tween = Class.extend({

	startValue: null,
	currentValue: null,
	endValue: null,

	valueType: null, // Vector2, Vector3, 

	easing: 'linear',

	timeStart: null,
	durationInMilliseconds: null,
	timeElapsed: null,
	timeElapsedPercentage: null,
	timeEnd: null,

	isFinished: false,

	callback: null,

	construct: function(startValue, endValue, durationInMilliseconds, callback) {
		this.startValue = this.currentValue = startValue;
		this.endValue = endValue;

		//console.log(this.startValue, this.endValue);

		this.durationInMilliseconds = durationInMilliseconds;
		this.timeStart = new Date().getTime();
		this.timeEnd = this.timeStart + this.durationInMilliseconds;

		this.callback = callback;

		this.identifyValueType();
	},

	identifyValueType: function() {
		if(this.startValue instanceof THREE.Vector2) {
			this.valueType = 'Vector2';
		}
		else if(this.startValue instanceof THREE.Vector3) {
			this.valueType = 'Vector3';
		}
	},

	update: function() {
		//return;

		// Get the current time
		var timeCurrent = new Date().getTime();

		// Do nothing if the tween is finished
		if(this.isFinished) {
			// Do nothing
		}
		// Do nothing if the current time is before the tween should start
		else if(timeCurrent < this.timeStart) {
			// Do nothing
		}
		// Complete the tween if the current time is past the end time
		else if(timeCurrent > this.timeEnd) {
			this.finish();
		}
		// Update the current value if the tween is running
		else {
			// Get the elapsed time
			this.timeElapsed = timeCurrent - this.timeStart;

			// Calculate our progress
			this.timeElapsedPercentage = this.timeElapsed / this.durationInMilliseconds;
			//console.log(this.timeElapsedPercentage);

			// Calculate what currentValue should be based on the value type as well as the easing function
			if(this.valueType == 'Vector2') {
				var deltaX = this.endValue.x - this.startValue.x;
				var deltaY = this.endValue.y - this.startValue.y;

				var currentX = deltaX * this.timeElapsedPercentage;
				var currentY = deltaY * this.timeElapsedPercentage;

				this.currentValue = new THREE.Vector2(currentX, currentY);
			}
			else if(this.valueType == 'Vector3') {
				//console.log('this.timeElapsedPercentage', this.timeElapsedPercentage);

				var deltaX = this.endValue.x - this.startValue.x;
				var deltaY = this.endValue.y - this.startValue.y;
				var deltaZ = this.endValue.z - this.startValue.z;
				//console.log('deltaX', deltaX);
				//console.log('deltaY', deltaY);
				//console.log('deltaZ', deltaZ);

				var currentX = this.startValue.x + (deltaX * this.timeElapsedPercentage);
				var currentY = this.startValue.y + (deltaY * this.timeElapsedPercentage);
				var currentZ = this.startValue.z + (deltaZ * this.timeElapsedPercentage);

				//console.log('-----------------')
				//console.log(this.currentValue);
				this.currentValue = new THREE.Vector3(currentX, currentY, currentZ);
				//console.log(this.currentValue);
				//console.log('-----------------')
			}
		}

		return this;
	},

	finish: function() {
		this.currentValue = this.endValue;
		this.timeElapsed = this.durationInMilliseconds;
		this.isFinished = true;

		if(this.callback) {
			this.callback();
		}
	},

});