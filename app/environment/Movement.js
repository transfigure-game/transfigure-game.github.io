Movement = Class.extend({

	object3d: null,
	tween: null,
	type: null,

	construct: function(object3d, tween, type) {
		this.object3d = object3d;
		this.tween = tween;
		this.type = type;
	},

	move: function() {
		var newVector3 = this.tween.update().currentValue;

		if(this.type == 'position') {
			this.object3d.position.x = newVector3.x;
			this.object3d.position.y = newVector3.y;
			this.object3d.position.z = newVector3.z;
		}
		else if(this.type == 'rotation') {
			this.object3d.rotation.x = newVector3.x;
			this.object3d.rotation.y = newVector3.y;
			this.object3d.rotation.z = newVector3.z;
		}

		return this;
	},

});