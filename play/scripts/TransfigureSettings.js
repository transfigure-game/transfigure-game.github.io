TransfigureSettings = Class.extend({

	transfigure: null,

	construct: function(transfigure) {
		this.transfigure = transfigure;

		this.listen();
	},

	listen: function() {
		var self = this;

		// Reset camera
		$('#cameraResetButton').click(function() {
			this.cameraReset();
		}.bind(this));

		// Camera View
		$('input[name="cameraView"]').change(function() {
			if($(this).val() == 'perspective') {
				self.cameraToPerspective();
			}
			else {
				self.cameraToOrthographic();
			}
		});
	},

	cameraReset: function() {
		this.transfigure.camera.position.x = 0;
		this.transfigure.camera.position.y = 750;
		this.transfigure.camera.position.z = 0;
		this.transfigure.camera.rotation.x = 0;
		this.transfigure.camera.rotation.y = 0;
		this.transfigure.camera.rotation.z = 0;
		this.transfigure.camera.bottom = -196.75;
		this.transfigure.camera.top = 196.75;
		this.transfigure.camera.left = -256.75;
		this.transfigure.camera.right = 256.75;
		this.transfigure.camera.fov = 90;
		this.transfigure.camera.lookAt(this.transfigure.sceneObjects.player.position);
	},

	cameraToOrthographic: function() {
		this.transfigure.camera.toOrthographic();
	},

	cameraToPerspective: function() {
		this.transfigure.camera.toPerspective();
	},

});