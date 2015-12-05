Environments.Concepts.Maze.MazeEnvironment = Environment.extend({

	boardSize: 1000,
	gridSize: 15,
	gridCellSize: null,

	map: null,
	player: null,
	finish: null,

	dependencies: [
		'concepts/maze/MazeEntity',
		'concepts/maze/MazePlayer',
		'concepts/maze/MazeFinish',
		'concepts/maze/MazeMap',
	],

	initialize: function() {
		// Calculate the grid cell size
		this.gridCellSize = this.boardSize / this.gridSize;
		//console.log(this.boardSize, this.gridSize, this.gridCellSize);

		// Create the map
		this.map = new Environments.Concepts.Maze.MazeMap(this);

		// Create the player (top left)
		this.player = new Environments.Concepts.Maze.MazePlayer(this);

		// Create the finish (bottom right)
		this.finish = new Environments.Concepts.Maze.MazeFinish(this);

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
	
});