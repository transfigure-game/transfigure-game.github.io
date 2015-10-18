Menu = Class.extend({

	app: null,
	view: null,

	construct: function(app) {
		this.app = app;
		this.view = new MenuView();

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
		this.app.environment.camera.lookAt(new THREE.Vector3(0, 0, 0));
	},

	cameraToOrthographic: function() {
		this.app.environment.camera.toOrthographic();
	},

	cameraToPerspective: function() {
		this.app.environment.camera.toPerspective();
	},

});