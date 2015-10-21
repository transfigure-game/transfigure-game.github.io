Environments.Concepts.Shapes.Cube.CubeEnvironment = Environment.extend({

	cube: null,
	pointLight: null,

	buildScene: function() {
		// Cube
		this.cube = new THREE.Mesh(
			new THREE.BoxGeometry(100, 100, 100),
			new THREE.MeshLambertMaterial({
				color: 0x00AAFF,
			})
		);
		this.scene.add(this.cube);

		// Point light
		this.pointLight = new THREE.PointLight(0xFFFFFF);
		this.pointLight.position.x = -150;
		this.pointLight.position.y = 0;
		this.pointLight.position.z = 250;
		this.scene.add(this.pointLight);

		// Ambient light
		this.scene.add(new THREE.AmbientLight(0x404040)); // Soft white light
	},

	beforeRender: function() {
		this.cube.rotation.x += 0.01;
		this.cube.rotation.y += 0.01;
	},

});