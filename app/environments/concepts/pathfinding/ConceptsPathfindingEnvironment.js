ConceptsPathfindingEnvironment = Environment.extend({

	boardSize: 1000,
	gridSize: 19,
	gridCellSize: null,
	map: null,

	construct: function() {
		// Calculate the grid cell size
		this.gridCellSize = this.boardSize / this.gridSize;

		this.super.apply(this, arguments);
	},

	buildScene: function() {
		// Create the grid
		var gridMaterial = new THREE.LineBasicMaterial({
			color: 0x2F2F2F,
		});
		this.grid = this.createGrid(gridMaterial, this.gridSize, this.gridSize, this.gridCellSize, this.gridCellSize);
		this.grid.position.z = 1;
		//this.scene.add(this.grid);

		// Initialize the map
		this.map = this.generateMap(this.gridSize);
		this.createMapOnBoard();

		// Create the floor
		this.floor = new THREE.Mesh(new THREE.BoxGeometry(this.gridSize * this.gridCellSize, this.gridSize * this.gridCellSize, this.gridCellSize / 4), new THREE.MeshLambertMaterial({
			color: 0x090909,
		}));
		this.floor.position.z = this.gridCellSize / 8 * -1;
		this.scene.add(this.floor);

		// Create ambient light
		//var ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
		var ambientLight = new THREE.AmbientLight(0xFFFFFF); // Full white
		this.scene.add(ambientLight);

		// Create the player
		this.player = new THREE.Object3D();

		// Create the cube to represent the player
		var playerCubeGeometry = new THREE.BoxGeometry(this.gridCellSize * .75, this.gridCellSize * .75, this.gridCellSize * .75);
		var playerCubeMaterial = new THREE.MeshLambertMaterial({
			color: 0x00AAFF,
		});
		var playerCube = new THREE.Mesh(playerCubeGeometry, playerCubeMaterial);
		this.player.add(playerCube);

		// Add a light to the player
		var playerLight = new THREE.PointLight(0xFFFFFF, 5, this.gridCellSize * 4);
		playerLight.position.z = this.gridCellSize;
		this.player.add(playerLight);

		var pointLightHelper = new THREE.PointLightHelper(playerLight, 10);
		this.scene.add(pointLightHelper);

		//playerLight.position.set(playerMapPosition.x, playerMapPosition.y, this.gridCellSize * 3);
		//this.scene.add(playerLight);

		// Position the player
		var playerMapPosition = this.mapPositionToGridPosition(0, 0);
		this.player.position.x = playerMapPosition.x;
		this.player.position.y = playerMapPosition.y;
		//this.player.position.z = playerCubeGeometry.vertices[0].x;
		this.player.position.z = this.gridCellSize;

		this.player.velocity = new THREE.Vector3(Number.random(.75, 1, 4), Number.random(-.75, -1, 4), 0);

		// Add the player to the scene
		this.scene.add(this.player);
		
		var finishLight = new THREE.PointLight(0xFFFFFF, 3, this.gridCellSize * 4);

		// Create the finish
		//var finishGeometry = new THREE.SphereGeometry(this.gridCellSize * .75 / 2, 32, 32);
		var finishGeometry = new THREE.BoxGeometry(this.gridCellSize * .75, this.gridCellSize * .75, this.gridCellSize * .75);
		//var finishGeometry = new THREE.OctahedronGeometry(this.gridCellSize * .5, 0);
		//var finishGeometry = new THREE.TorusGeometry(this.gridCellSize * .4, this.gridCellSize * .1, 16, 16);

		var finishMaterial = new THREE.MeshLambertMaterial({
			color: 0x8ABA56,
		});
		this.finish = new THREE.Mesh(finishGeometry, finishMaterial);
		var finishMapPosition = this.mapPositionToGridPosition(this.map.length - 1, this.map.length - 1);
		this.finish.position.x = finishMapPosition.x;
		this.finish.position.y = finishMapPosition.y;
		this.finish.position.z = finishGeometry.vertices[0].y;
		this.scene.add(this.finish);

		
		finishLight.position.set(finishMapPosition.x, finishMapPosition.y, this.gridCellSize * 1.5);
		this.scene.add(finishLight);
	},

	generateMap: function(gridSize) {
		var map = [];

		// Initialize the map to all zeroes
		for(var currentRow = 0; currentRow < gridSize; currentRow++) {
			var row = [];
			for(var currentColumn = 0; currentColumn < gridSize; currentColumn++) {
				if((currentColumn % 2 == 0) && (currentRow % 2 == 0)) {
					row[currentColumn] = -1;
				}
				else {
					row[currentColumn] = 5;
				}
			}
			map.push(row);
		}

		//this.logMap(map);
		//return map;

		// Initialize
		var movesHistory = [];
		var currentRow = map.length - 1;
		var currentColumn = map[map.length - 1].length - 1;

		// Randomly cut holes in walls
		while(true) {
			var possibleMoves = [];

			// Set my current position to visited
			map[currentRow][currentColumn] = 0;

			// Can move up
			if(map[currentRow - 2] !== undefined && map[currentRow - 2][currentColumn] == -1) {
				possibleMoves.push({
					row: currentRow - 2,
					column: currentColumn,
					holeRow: currentRow - 1,
					holeColumn: currentColumn,
				});
			}

			// Can move down
			if(map[currentRow + 2] !== undefined && map[currentRow + 2][currentColumn] == -1) {
				possibleMoves.push({
					row: currentRow + 2,
					column: currentColumn,
					holeRow: currentRow + 1,
					holeColumn: currentColumn,
				});
			}

			// Can move left
			if(map[currentRow][currentColumn - 2] !== undefined && map[currentRow][currentColumn - 2] == -1) {
				possibleMoves.push({
					row: currentRow,
					column: currentColumn - 2,
					holeRow: currentRow,
					holeColumn: currentColumn - 1,
				});
			}

			// Can move right
			if(map[currentRow][currentColumn + 2] !== undefined && map[currentRow][currentColumn + 2] == -1) {
				possibleMoves.push({
					row: currentRow,
					column: currentColumn + 2,
					holeRow: currentRow,
					holeColumn: currentColumn + 1,
				});
			}

			// Check if there are no available moves
			if(!possibleMoves.length) {
				if(!movesHistory.length) {
					break; // Breaks the while loop
				}
				else {
					var nextMove = movesHistory.pop();
					currentRow = nextMove.row;
					currentColumn = nextMove.column;

					continue;
				}			
			}

			// Randomly pick an available move
			var nextMoveIndex = Math.floor(Math.random() * (possibleMoves.length - 0)) + 0;

			movesHistory.push({
				column: currentColumn,
				row: currentRow,
			});

			var nextMove = possibleMoves[nextMoveIndex];

			// Remove the wall
			map[nextMove.holeRow][nextMove.holeColumn] = 0;

			currentRow = nextMove.row;
			currentColumn = nextMove.column;
		}

		// Start
		map[0][0] = 1;

		// End
		map[map.length - 1][map[map.length - 1].length - 1] = 9;

		//this.logMap(map);
		return map;
	},

	createMapOnBoard: function() {
		for(var currentRow = 0; currentRow < this.map.length; currentRow++) {
			for(var currentColumn = 0; currentColumn < this.map[currentRow].length; currentColumn++) {
				// Walls
				if(this.map[currentRow][currentColumn] == 5) {
					var wallGeometry = new THREE.BoxGeometry(this.gridCellSize, this.gridCellSize, this.gridCellSize / 2);
					//var wallGeometry = new THREE.SphereGeometry(this.gridCellSize * .75 / 2, 8, 8);
					//var wallGeometry = new THREE.CircleGeometry(this.gridCellSize * .75 / 2, 32);
					//var wallMaterial = new THREE.MeshNormalMaterial({});
					var wallMaterial = new THREE.MeshLambertMaterial({
						color: 0x2A2A2A,
					});
					var wall = new THREE.Mesh(wallGeometry, wallMaterial);

					var wallPosition = this.mapPositionToGridPosition(currentRow, currentColumn);
					wall.position.x = wallPosition.x;
					wall.position.y = wallPosition.y;
					wall.position.z = wallGeometry.vertices[0].x / 2;
					this.scene.add(wall);
				}
			}
		}
	},

	mapPositionToGridPosition: function(row, column) {
		return {
			x: row * this.gridCellSize - (this.boardSize / 2) + (this.gridCellSize / 2),
			y: ((column * this.gridCellSize - (this.boardSize / 2 * -1) + (this.gridCellSize / 2)) * -1) + this.boardSize,
		};
	},

	logMap: function(map) {
		var mapString = '';

		for(var currentRow = 0; currentRow < map.length; currentRow++) {
			for(var currentColumn = 0; currentColumn < map[currentRow].length; currentColumn++) {
				mapString += map[currentRow][currentColumn]+' ';
			}
			
			mapString += "\r\n";
		}

		console.log(mapString);
	},

	createGrid: function(material, width, height, cellWidth, cellHeight) {
		var size = (width * cellWidth) / 2;
		var step = cellWidth;
		var geometry = new THREE.Geometry();

		for(var i = -size; i <= size; i += step) {
			geometry.vertices.push(new THREE.Vector3(-size, i, 0));
			geometry.vertices.push(new THREE.Vector3(size, i, 0));
			geometry.vertices.push(new THREE.Vector3(i, -size, 0));
			geometry.vertices.push(new THREE.Vector3(i, size, 0));
		}

		var grid = new THREE.LineSegments(geometry, material);

		return grid;
	},

	beforeRender: function() {
		var bound = this.boardSize / 2;

		if(this.player.position.x < bound * -1 || this.player.position.x > bound) {
			this.player.velocity = new THREE.Vector3(this.player.velocity.x * -1, this.player.velocity.y, 0);
		}
		if(this.player.position.y < bound * -1 || this.player.position.y > bound) {
			this.player.velocity = new THREE.Vector3(this.player.velocity.x, this.player.velocity.y * -1, 0);
		}

		this.player.translateOnAxis(this.player.velocity, 7.5);

		//this.finish.rotation.x += .01;
		//this.finish.rotation.y += .01;
		//this.finish.rotation.z += .01;
	},
	
});