Tween = Class.extend({

	startValue: null,
	currentValue: null,
	endValue: null,
	deltaValue: null,

	durationInMilliseconds: null,

	easing: null,

	timeStart: null,
	timeElapsed: null,
	timeElapsedPercentage: null,
	timeEnd: null,

	isFinished: false,

	callback: null,

	currentTween: null,
	nextTweens: null,

	construct: function(startValue, endValue, durationInMilliseconds, easing, callback) {
		this.startValue = startValue;
		this.currentValue = this.startValue;
		this.endValue = endValue;
		this.deltaValue = this.endValue - this.startValue;

		this.durationInMilliseconds = durationInMilliseconds;

		this.easing = easing;
		if(!this.easing) {
			this.easing = Easing.linear;
		}
		
		this.timeStart = new Date().getTime();
		this.timeEnd = this.timeStart + this.durationInMilliseconds;

		this.callback = callback;

		this.currentTween = this;
		this.nextTweens = [];
	},

	update: function() {
		//return;

		// Get the current time
		var timeCurrent = new Date().getTime();

		// Do nothing if the tween is finished
		if(this.currentTween.isFinished) {
			// Do nothing
		}
		// Do nothing if the current time is before the tween should start
		else if(timeCurrent < this.currentTween.timeStart) {
			// Do nothing
		}
		// Complete the tween if the current time is past the end time
		else if(timeCurrent > this.currentTween.timeEnd) {
			this.currentTween.finish();
		}
		// Update the current value if the tween is running
		else {
			// Get the elapsed time
			this.currentTween.timeElapsed = timeCurrent - this.currentTween.timeStart;

			// Calculate our progress
			this.currentTween.timeElapsedPercentage = this.currentTween.timeElapsed / this.currentTween.durationInMilliseconds;
			//console.log(this.currentTween.timeElapsedPercentage);

			// Apply easing
			var easedTimeElapsedPercentage = this.currentTween.easing(this.currentTween.timeElapsedPercentage);

			// Calculate what currentValue should be			
			this.currentTween.currentValue = this.currentTween.startValue + (this.currentTween.deltaValue * easedTimeElapsedPercentage);
		}

		//console.log(this.currentTween.currentValue);

		return this;
	},

	then: function(tween) {
		var previousTween = this;

		//if(this.nextTweens.length > 1) {
		//	previousTween = this.nextTweens[this.nextTweens.length - 1];
		//}

		tween.timeStart = previousTween.timeEnd;
		tween.timeEnd = tween.timeStart + tween.durationInMilliseconds;

		this.nextTweens.push(tween);
	},

	finish: function() {
		// Check to see if we move to a chained tween
		var nextTween = this.nextTweens.pop();
		if(nextTween) {
			//console.log('switching tweens')
			this.currentTween = nextTween;
			this.update();
		}
		else {
			this.currentValue = this.endValue;
			this.timeElapsed = this.durationInMilliseconds;
			this.isFinished = true;

			if(this.callback) {
				this.callback();
			}	
		}

		return this;
	},

});