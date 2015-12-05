Environments.Concepts.Maze.MazeFinish = Environments.Concepts.Maze.MazeEntity.extend({

	construct: function() {
		this.super.apply(this, arguments);

		// Set the row and column to the bottom left position
		this.row = this.environment.map.array.length - 1;
		this.column = this.environment.map.array[0].length - 1;

		// Position the finish
		var finishPosition = this.environment.map.rowColumnToVector2(this.row, this.column);
		this.object3d.position.x = finishPosition.x;
		this.object3d.position.y = finishPosition.y;
	},

	generateObject3d: function() {
		var object3d = new THREE.Object3D();

		// Cube
		var cubeGeometry = new THREE.BoxGeometry(this.environment.gridCellSize * .75, this.environment.gridCellSize * .75, this.environment.gridCellSize * .75);
		var cubeMaterial = new THREE.MeshLambertMaterial({
			color: 0x8ABA56,
		});
		var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		cube.position.z = this.environment.gridCellSize * .75 / 2;

		// Point light
		var pointLight = new THREE.PointLight(0xFFFFFF, 5, this.environment.gridCellSize * 4);
		//pointLight.castShadow = true;

		// Point light helper
		var pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
		
		//pointLight.add(pointLightHelper);
		cube.add(pointLight);
		object3d.add(cube);

		return object3d;
	},

});