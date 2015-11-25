Movement = Class.extend({

	object3d: null,
	tweenMap: null,

	isFinished: false,

	construct: function(object3d, tweenMap, callback) {
		this.object3d = object3d;
		this.tweenMap = tweenMap;
		this.callback = callback;
	},

	move: function() {
		var isFinished = true;

		for(var i = 0; i < this.tweenMap.length; i++) {
			var currentTweenMapItem = this.tweenMap[i];

			var currentValue = currentTweenMapItem.tween.update().currentTween.currentValue;

			if(!currentTweenMapItem.tween.currentTween.isFinished) {
				isFinished = false;
			}

			this.object3d[currentTweenMapItem.type][currentTweenMapItem.property] = currentValue;
		}

		if(isFinished) {
			this.finish();
		}

		return this;
	},

	finish: function() {
		this.isFinished = true;

		if(this.callback) {
			this.callback();
		}
	},

});