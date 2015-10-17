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
		this.transfigure.camera.lookAt(this.transfigure.sceneObjects.player.position);
	},

	cameraToOrthographic: function() {
		this.transfigure.camera.toOrthographic();
	},

	cameraToPerspective: function() {
		this.transfigure.camera.toPerspective();
	},

});