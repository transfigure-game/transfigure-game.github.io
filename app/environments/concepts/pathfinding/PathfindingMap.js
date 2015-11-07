Environments.Concepts.Pathfinding.PathfindingMap = Class.extend({

	environment: null,

	array: null,
	object3d: null,

	construct: function(environment) {
		this.environment = environment;

		this.array = this.generateArray();
		this.object3d = this.generateObject3d();
	},

	generateArray: function() {
		var array = [];

		// Initialize the map to all zeroes
		for(var currentRow = 0; currentRow < this.environment.gridSize; currentRow++) {
			var row = [];
			for(var currentColumn = 0; currentColumn < this.environment.gridSize; currentColumn++) {
				if((currentColumn % 2 == 0) && (currentRow % 2 == 0)) {
					row[currentColumn] = -1;
				}
				else {
					row[currentColumn] = 5;
				}
			}
			array.push(row);
		}

		//this.logArray(array);
		//return map;

		// Initialize
		var movesHistory = [];
		var currentRow = array.length - 1;
		var currentColumn = array[array.length - 1].length - 1;

		// Randomly cut holes in walls
		while(true) {
			var possibleMoves = [];

			// Set my current position to visited
			array[currentRow][currentColumn] = 0;

			// Can move up
			if(array[currentRow - 2] !== undefined && array[currentRow - 2][currentColumn] == -1) {
				possibleMoves.push({
					row: currentRow - 2,
					column: currentColumn,
					holeRow: currentRow - 1,
					holeColumn: currentColumn,
				});
			}

			// Can move down
			if(array[currentRow + 2] !== undefined && array[currentRow + 2][currentColumn] == -1) {
				possibleMoves.push({
					row: currentRow + 2,
					column: currentColumn,
					holeRow: currentRow + 1,
					holeColumn: currentColumn,
				});
			}

			// Can move left
			if(array[currentRow][currentColumn - 2] !== undefined && array[currentRow][currentColumn - 2] == -1) {
				possibleMoves.push({
					row: currentRow,
					column: currentColumn - 2,
					holeRow: currentRow,
					holeColumn: currentColumn - 1,
				});
			}

			// Can move right
			if(array[currentRow][currentColumn + 2] !== undefined && array[currentRow][currentColumn + 2] == -1) {
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
			array[nextMove.holeRow][nextMove.holeColumn] = 0;

			currentRow = nextMove.row;
			currentColumn = nextMove.column;
		}

		// Start
		array[0][0] = 1;

		// End
		array[array.length - 1][array[array.length - 1].length - 1] = 9;

		//this.logArray(array);

		return array;
	},

	generateObject3d: function() {
		var object3d = new THREE.Object3D();

		// Create the grid
		//var gridMaterial = new THREE.LineBasicMaterial({
		//	color: 0x2F2F2F,
		//});
		//var grid = this.createGrid(gridMaterial, this.environment.gridSize, this.environment.gridSize, this.environment.gridCellSize, this.environment.gridCellSize);
		//grid.position.z = 1;
		//object3d.add(grid);

		// Create the floor
		var floor = new THREE.Mesh(new THREE.BoxGeometry(this.environment.gridSize * this.environment.gridCellSize, this.environment.gridSize * this.environment.gridCellSize, this.environment.gridCellSize / 4), new THREE.MeshLambertMaterial({
			//color: 0x090909,
			color: 0xFFFFFF,
		}));
		floor.position.z = this.environment.gridCellSize / 4 / 2 * -1;
		floor.castShadow = true;
		floor.receiveShadow = true;
		object3d.add(floor);

		for(var currentRow = 0; currentRow < this.array.length; currentRow++) {
			for(var currentColumn = 0; currentColumn < this.array[currentRow].length; currentColumn++) {
				// Walls
				if(this.array[currentRow][currentColumn] == 5) {
					var wallGeometry = new THREE.BoxGeometry(this.environment.gridCellSize, this.environment.gridCellSize, this.environment.gridCellSize);
					//var wallGeometry = new THREE.SphereGeometry(this.environment.gridCellSize * .75 / 2, 8, 8);
					//var wallGeometry = new THREE.CircleGeometry(this.environment.gridCellSize * .75 / 2, 32);
					//var wallMaterial = new THREE.MeshNormalMaterial({});
					var wallMaterial = new THREE.MeshLambertMaterial({
						color: 0x2A2A2A,
					});
					var wall = new THREE.Mesh(wallGeometry, wallMaterial);
					wall.castShadow = true;
					wall.receiveShadow = true;

					var wallPosition = this.rowColumnToVector2(currentRow, currentColumn);
					wall.position.x = wallPosition.x;
					wall.position.y = wallPosition.y;
					wall.position.z = this.environment.gridCellSize / 2;
					object3d.add(wall);
				}
			}
		}

		return object3d;
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

	rowColumnToVector2: function(row, column) {
		var vector2 = new THREE.Vector2(
			column * this.environment.gridCellSize - (this.environment.boardSize / 2) + (this.environment.gridCellSize / 2), // x == column
			(row * this.environment.gridCellSize * -1) + (this.environment.boardSize / 2) - (this.environment.gridCellSize / 2) // y == row
		);
		//console.log('rowColumnToVector2', row, vector2.y, column, vector2.x);

		return vector2;
	},

	logArray: function(array) {
		var mapString = '';

		for(var currentRow = 0; currentRow < array.length; currentRow++) {
			for(var currentColumn = 0; currentColumn < array[currentRow].length; currentColumn++) {
				mapString += array[currentRow][currentColumn]+' ';
			}
			
			mapString += "\r\n";
		}

		console.log(mapString);
	},

});