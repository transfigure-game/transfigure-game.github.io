Environments.Concepts.Pathfinding.PathfindingPlayer = Environments.Concepts.Pathfinding.PathfindingEntity.extend({

	generateObject3d: function() {
		var object3d = new THREE.Object3D();

		// Cube
		var cubeGeometry = new THREE.BoxGeometry(this.environment.gridCellSize * .75, this.environment.gridCellSize * .75, this.environment.gridCellSize * .75);
		var cubeMaterial = new THREE.MeshLambertMaterial({
			color: 0x00AAFF,
		});
		var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		object3d.add(cube);

		// Light
		var pointLight = new THREE.PointLight(0xFFFFFF, 5, this.environment.gridCellSize * 4);
		pointLight.position.z = this.environment.gridCellSize;
		object3d.add(pointLight);

		// Light helper
		var pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
		object3d.add(pointLightHelper);

		return object3d;
	},

});