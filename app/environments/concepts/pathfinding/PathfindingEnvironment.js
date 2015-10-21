Environments.Concepts.Pathfinding.PathfindingEnvironment = Environment.extend({

	boardSize: 1000,
	gridSize: 15,
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

		// Create the player (top left)
		this.player = new Environments.Concepts.Pathfinding.PathfindingPlayer(this);

		// Create the finish (bottom right)
		this.finish = new Environments.Concepts.Pathfinding.PathfindingFinish(this);

		this.super.apply(this, arguments);
	},

	buildScene: function() {
		// Create ambient light
		//var ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
		var ambientLight = new THREE.AmbientLight(0xFFFFFF); // Full white
		this.scene.add(ambientLight);

		// Add the map
		this.scene.add(this.map.object3d);

		// Add the player to the scene
		this.scene.add(this.player.object3d);

		// Add the finish to the scene
		this.scene.add(this.finish.object3d);
	},

	start: function() {
		this.player.play();

		this.super.apply(this, arguments);
	},

	beforeRender: function() {
		//var bound = this.boardSize / 2;

		//if(this.player.object3d.position.x < bound * -1 || this.player.object3d.position.x > bound) {
		//	this.player.velocity = new THREE.Vector3(this.player.velocity.x * -1, this.player.velocity.y, 0);
		//}
		//if(this.player.object3d.position.y < bound * -1 || this.player.object3d.position.y > bound) {
		//	this.player.velocity = new THREE.Vector3(this.player.velocity.x, this.player.velocity.y * -1, 0);
		//}

		//this.player.object3d.translateOnAxis(this.player.velocity, 7.5);
	},
	
});