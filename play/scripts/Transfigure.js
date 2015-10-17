Transfigure = Class.extend({

	scene: null,
	sceneObjects: {},
	camera: null,
	controls: null,
	renderer: null,
	settings: null,

	boardSize: 1000,
	gridSize: 29,
	gridCellSize: null,

	map: null,

	construct: function() {
		// Calculate the grid cell size
		this.gridCellSize = this.boardSize / this.gridSize;

		// Create the scene
		this.createScene();
	
		// Create the camera
		this.createCamera();

		// Create the controls
		this.createControls();

		// Create the renderer and add it to the DOM
		this.createRenderer();

		// Add settings
		this.settings = new TransfigureSettings(this);

		// Render the scene
		this.render();
	},

	createScene: function() {
		this.scene = new THREE.Scene();
		
		// Create the grid
		var gridMaterial = new THREE.LineBasicMaterial({
			color: 0x2F2F2F,
		});
		this.sceneObjects.grid = this.createGrid(gridMaterial, this.gridSize, this.gridSize, this.gridCellSize, this.gridCellSize);
		this.sceneObjects.grid.position.z = 1;
		//this.scene.add(this.sceneObjects.grid);

		// Initialize the map
		this.map = this.generateMap(this.gridSize);
		this.createMapOnBoard();

		// Create the floor
		this.sceneObjects.floor = new THREE.Mesh(new THREE.BoxGeometry(this.gridSize * this.gridCellSize, this.gridSize * this.gridCellSize, this.gridCellSize / 4), new THREE.MeshLambertMaterial({
			color: 0x090909,
		}));
		this.sceneObjects.floor.position.z = this.gridCellSize / 8 * -1;
		this.scene.add(this.sceneObjects.floor);

		// Create ambient light
		//var ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
		var ambientLight = new THREE.AmbientLight(0xFFFFFF); // Full white
		this.scene.add(ambientLight);

		// Create the player
		this.sceneObjects.player = new THREE.Object3D();

		// Create the cube to represent the player
		var playerCubeGeometry = new THREE.BoxGeometry(this.gridCellSize * .75, this.gridCellSize * .75, this.gridCellSize * .75);
		var playerCubeMaterial = new THREE.MeshLambertMaterial({
			color: 0x00AAFF,
		});
		var playerCube = new THREE.Mesh(playerCubeGeometry, playerCubeMaterial);
		this.sceneObjects.player.add(playerCube);

		// Add a light to the player
		var playerLight = new THREE.PointLight(0xFFFFFF, 3, this.gridCellSize * 4);
		playerLight.position.z = this.gridCellSize * 3;
		this.sceneObjects.player.add(playerLight);

		//playerLight.position.set(playerMapPosition.x, playerMapPosition.y, this.gridCellSize * 3);
		//this.scene.add(playerLight);

		// Position the player
		var playerMapPosition = this.mapPositionToGridPosition(0, 0);
		this.sceneObjects.player.position.x = playerMapPosition.x;
		this.sceneObjects.player.position.y = playerMapPosition.y;
		this.sceneObjects.player.position.z = playerCubeGeometry.vertices[0].x;

		// Add the player to the scene
		this.scene.add(this.sceneObjects.player);



		
		var finishLight = new THREE.PointLight(0xFFFFFF, 3, this.gridCellSize * 4);

		

		// Create the finish
		//var finishGeometry = new THREE.SphereGeometry(this.gridCellSize * .75 / 2, 32, 32);
		var finishGeometry = new THREE.BoxGeometry(this.gridCellSize * .75, this.gridCellSize * .75, this.gridCellSize * .75);
		var finishMaterial = new THREE.MeshLambertMaterial({
			color: 0x8ABA56,
		});
		this.sceneObjects.finish = new THREE.Mesh(finishGeometry, finishMaterial);
		var finishMapPosition = this.mapPositionToGridPosition(this.map.length - 1, this.map.length - 1);
		this.sceneObjects.finish.position.x = finishMapPosition.x;
		this.sceneObjects.finish.position.y = finishMapPosition.y;
		this.sceneObjects.finish.position.z = finishGeometry.vertices[0].y;
		this.scene.add(this.sceneObjects.finish);

		
		finishLight.position.set(finishMapPosition.x, finishMapPosition.y, this.gridCellSize * 3);
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

		this.logMap(map);
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

	createCamera: function() {
		this.camera = new THREE.CombinedCamera(($('#game').width() / 2), ($('#game').height() / 2), 90, 1, this.boardSize * 3, 1, this.boardSize * 3);
		this.camera.position.z = this.boardSize;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		this.camera.toPerspective();

		return this.camera;
	},

	createControls: function() {
		this.controls = new THREE.OrbitControls(this.camera);
		this.controls.enablePan = true;
		this.controls.enableZoom = true;
		this.controls.enableRotate = true;
	},

	createRenderer: function() {
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
		});

		this.renderer.setSize($('#game').width(), $('#game').height());

		$('#game').append(this.renderer.domElement);

		$(window).resize(function() {
			this.resizeRenderer();
		}.bind(this));

		return this.renderer;
	},

	resizeRenderer: function() {
		//this.camera.aspect = $('#game').width() / $('#game').height();
		//this.camera.setSize($('#game').width() / $('#game').height());
		this.camera.cameraP.aspect = $('#game').width() / $('#game').height();
		this.camera.updateProjectionMatrix();
		this.renderer.setSize($('#game').width(), $('#game').height());
	},

	render: function() {
		// Recursively call render
		requestAnimationFrame(this.render.bind(this));

		//this.sceneObjects.player.position.x += 1;
		this.sceneObjects.player.position.y -= 1;
		this.sceneObjects.player.rotateOnAxis(new THREE.Vector3(1, 0, 0), (Math.PI / 2) * .05);
		//this.sceneObjects.player.translateOnAxis(new THREE.Vector3(0, 1, 0), 5);


		// Update the controls
		this.controls.update();

		// Render the scene
		this.renderer.render(this.scene, this.camera);
	},

	// MOVING WITH THE GAME LOOP
	/*

	Have an array of objects that will move
	var objectsToMove

	where it started
	  where it will end

	move object
	  object // thing i am moving
	  lastTime // the time in milliseconds when I last moved
	  lastPosition // where it was at the end of the last game loop
	  velocity // a Vector3 distance you want to move divided by time (60 moves per second) (gridCellSize / 60)
	  
	  // Computed
	  timeDifference = now() - lastTime
	  apply velocity to old position, set the new  position
	  compute the new position from the old position

	when you are done moving, remove yourself from the array

	*/

});

$(document).ready(function() {
	// Setup Semantic UI
	$('.ui.checkbox').checkbox();
	$('.popup').popup({
    	position : 'right center',
  	});

	// Start the game
	Transfigure = new Transfigure();
});