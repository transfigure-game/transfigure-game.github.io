Environments.Concepts.Pathfinding.PathfindingFinish = Environments.Concepts.Pathfinding.PathfindingEntity.extend({

	generateObject3d: function() {
		var object3d = new THREE.Object3D();

		var light = new THREE.PointLight(0xFFFFFF, 3, this.environment.gridCellSize * 4);

		var geometry = new THREE.BoxGeometry(this.environment.gridCellSize * .75, this.environment.gridCellSize * .75, this.environment.gridCellSize * .75);
		//var geometry = new THREE.SphereGeometry(this.environment.gridCellSize * .75 / 2, 32, 32);
		//var geometry = new THREE.OctahedronGeometry(this.environment.gridCellSize * .5, 0);
		//var geometry = new THREE.TorusGeometry(this.environment.gridCellSize * .4, this.environment.gridCellSize * .1, 16, 16);

		var finishMaterial = new THREE.MeshLambertMaterial({
			color: 0x8ABA56,
		});

		this.finish = new THREE.Mesh(geometry, finishMaterial);
		var finishMapPosition = this.map.rowColumnToVector2(this.map.length - 1, this.map.length - 1);
		this.finish.position.x = finishMapPosition.x;
		this.finish.position.y = finishMapPosition.y;
		this.finish.position.z = geometry.vertices[0].y;





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