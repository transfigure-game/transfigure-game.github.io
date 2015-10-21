Environments.Concepts.Pathfinding.PathfindingEnvironment = Environment.extend({

	boardSize: 1000,
	gridSize: 19,
	gridCellSize: null,

	map: null,
	player: null,
	finish: null,

	dependencies: [
		'concepts/pathfinding/PathfindingMap',
		'concepts/pathfinding/PathfindingEntity',
		'concepts/pathfinding/PathfindingPlayer',
		'concepts/pathfinding/PathfindingFinish',
	],

	initialize: function() {
		// Calculate the grid cell size
		this.gridCellSize = this.boardSize / this.gridSize;
		//console.log(this.boardSize, this.gridSize, this.gridCellSize);

		// Create the map
		this.map = new Environments.Concepts.Pathfinding.PathfindingMap(this);
		console.log(this, this.map);

		// Create the player (top left)
		this.player = new Environments.Concepts.Pathfinding.PathfindingPlayer(this);
		this.player.row = 0;
		this.player.column = 0;

		//// Create the finish (bottom right)
		this.finish = new Environments.Concepts.Pathfinding.PathfindingEntity(this);
		this.finish.row = this.map.array.length - 1;
		this.finish.column = this.map.array[0].length - 1;

		this.super.apply(this, arguments);
	},

	buildScene: function() {
		// Add the map
		this.scene.add(this.map.object3d);

		// Position the player
		var playerPosition = this.map.rowColumnToVector2(this.player.row, this.player.column);
		this.player.object3d.position.x = playerPosition.x;
		this.player.object3d.position.y = playerPosition.y;
		//this.player.object3d.position.z = cubeGeometry.vertices[0].x;
		this.player.object3d.position.z = this.gridCellSize;

		// Give the player a velocity
		this.player.velocity = new THREE.Vector3(Number.random(.75, 1, 4), Number.random(-.75, -1, 4), 0);

		// Add the player to the scene
		this.scene.add(this.player.object3d);

		// Create ambient light
		//var ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
		var ambientLight = new THREE.AmbientLight(0xFFFFFF); // Full white
		this.scene.add(ambientLight);

		//this.scene.add(this.finish);
	},

	beforeRender: function() {
		var bound = this.boardSize / 2;

		//if(this.player.object3d.position.x < bound * -1 || this.player.object3d.position.x > bound) {
		//	this.player.velocity = new THREE.Vector3(this.player.velocity.x * -1, this.player.velocity.y, 0);
		//}
		//if(this.player.object3d.position.y < bound * -1 || this.player.object3d.position.y > bound) {
		//	this.player.velocity = new THREE.Vector3(this.player.velocity.x, this.player.velocity.y * -1, 0);
		//}

		//this.player.object3d.translateOnAxis(this.player.velocity, 7.5);

		//this.finish.rotation.x += .01;
		//this.finish.rotation.y += .01;
		//this.finish.rotation.z += .01;
	},
	
});