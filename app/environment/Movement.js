Movement = Class.extend({

	object3d: null,
	tween: null,

	construct: function(object3d, tween) {
		this.object3d = object3d;
		this.tween = tween;
	},

	move: function() {
		var newPosition = this.tween.update().currentValue;
		this.object3d.position.x = newPosition.x;
		this.object3d.position.y = newPosition.y;
		this.object3d.position.z = newPosition.z;

		return this;
	},

});