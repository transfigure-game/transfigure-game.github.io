Environments.Concepts.Pathfinding.PathfindingPlayer = Environments.Concepts.Pathfinding.PathfindingEntity.extend({

	moveHistory: [],
	moveCount: 0,
	moveLimit: Infinity,
	//moveLimit: 2,
	memoryMap: [[]],

	previousPosition: null,
	position: null,

	previousRow: 0,
	previousColumn: 0,

	//speed: 250,
	speed: 2500,

	construct: function() {
		this.super.apply(this, arguments);

		// Set the starting row and column
		this.row = 0;
		this.column = 0;

		// Position the player
		var playerPosition = this.environment.map.rowColumnToVector2(this.row, this.column);
		this.object3d.position.x = playerPosition.x;
		this.object3d.position.y = playerPosition.y;
		//this.object3d.position.z = 200;

		// Give the player a velocity
		this.velocity = new THREE.Vector3(Number.random(.75, 1, 4), Number.random(-0.75, -1, 4), 0);

		// As if the player did  .move(0, 0)
		this.memoryMap[0][0] = 1;
		this.moveHistory.push({
			row: 0,
			column: 0,
		});
	},

	generateObject3d: function() {
		var object3d = new THREE.Object3D();

		// Cube
		var cubeGeometry = new THREE.BoxGeometry(this.environment.gridCellSize, this.environment.gridCellSize, this.environment.gridCellSize);
		//var cubeGeometry = new THREE.SphereGeometry(this.environment.gridCellSize * .5, 16, 16);
		//var cubeMaterial = new THREE.MeshLambertMaterial({
		//	color: 0x00AAFF,
		//});
		var cubeMaterial = new THREE.MeshNormalMaterial();
		var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

		// Point light
		var pointLight = new THREE.PointLight(0xFFFFFF, 5, this.environment.gridCellSize * 4);
		pointLight.castShadow = true;
		//pointLight.position.z = this.environment.gridCellSize;

		// Point light helper
		//var pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
		//object3d.add(pointLightHelper);
		
		//pointLight.add(pointLightHelper);
		cube.add(pointLight);
		object3d.add(cube);

		// Adjust the object's position
		object3d.position.z = this.environment.gridCellSize / 2;

		return object3d;
	},

	canMoveTo: function(row, column) {
		//console.log(row, column, this.environment.map.array);

		var canMoveTo = false;

		// Row exists
		if(row >= 0 && row < this.environment.map.array.length) {
			//console.log('Row exists');
			// Cell exists
			if(column >= 0 && column < this.environment.map.array[row].length) {
				var cellValue = this.environment.map.array[row][column];
				//console.log('cellValue', cellValue);

				// Cell is not a wall
				if(cellValue != 5) {
					canMoveTo = true;
				}
			}
		}

		return canMoveTo;
	},

	hasVisited: function(row, column) {
		var hasVisited = 0;

		if(this.memoryMap[row] && this.memoryMap[row][column] !== undefined) {
			hasVisited = this.memoryMap[row][column];
		}

		return hasVisited;
	},

	findAndExecuteNextMove: function() {
		//this.environment.map.logArray(this.environment.map.array);

		var canMoveUp = this.canMoveTo(this.row - 1, this.column);
		var canMoveDown = this.canMoveTo(this.row + 1, this.column);
		var canMoveLeft = this.canMoveTo(this.row, this.column - 1);
		var canMoveRight = this.canMoveTo(this.row, this.column + 1);
		//console.log('canMoveUp', canMoveUp);
		//console.log('canMoveDown', canMoveDown);
		//console.log('canMoveLeft', canMoveLeft);
		//console.log('canMoveRight', canMoveRight);

		var hasVisitedUp = this.hasVisited(this.row - 1, this.column);
		var hasVisitedDown = this.hasVisited(this.row + 1, this.column);
		var hasVisitedLeft = this.hasVisited(this.row, this.column - 1);
		var hasVisitedRight = this.hasVisited(this.row, this.column + 1);
		//console.log('hasVisitedUp', hasVisitedUp);
		//console.log('hasVisitedDown', hasVisitedDown);
		//console.log('hasVisitedLeft', hasVisitedLeft);
		//console.log('hasVisitedRight', hasVisitedRight);

		var possibleMoves = [];

		if(canMoveUp && !hasVisitedUp) {
			possibleMoves.push('moveUp');
		}
		if(canMoveDown && !hasVisitedDown) {
			possibleMoves.push('moveDown');
		}
		if(canMoveLeft && !hasVisitedLeft) {
			possibleMoves.push('moveLeft');
		}
		if(canMoveRight && !hasVisitedRight) {
			possibleMoves.push('moveRight');
		}

		if(possibleMoves.length) {
			// Pick and execute a random move
			var moveMethod = possibleMoves[Math.floor(Math.random() * (possibleMoves.length))];
			//console.log(moveMethod, possibleMoves);
			this[moveMethod].apply(this);
		}
		else if(this.moveHistory.length <= 1) {
			console.log('No solution.');
		}
		else {
			// Back track
			this.moveHistory.pop();
			var previousMove = this.moveHistory.pop();
			this.move(previousMove.row, previousMove.column);
		}
	},

	move: function(row, column) {
		//console.log('moving to row', row, 'column', column);
		var cellValue = this.environment.map.array[row][column];

		this.previousRow = this.row;
		this.previousColumn = this.column;

		this.row = row;
		this.column = column;

		this.moveHistory.push({
			row: this.row,
			column: this.column,
		});

		// Create the row if it doesn't exist
		if(!this.memoryMap[row]) {
			this.memoryMap[row] = [];
		}
		if(!this.memoryMap[row][column]) {
			this.memoryMap[row][column] = 0;
		}
		this.memoryMap[row][column]++;
		//console.table(this.memoryMap);

		if(cellValue == 9) {
			//console.log('Done! Took '+this.moveCount+' steps.');

			// Clear the board
			this.moveHistory = [];
			this.moveCount = 0;
			this.memoryMap = [];

			this.previousColumn = null;
			this.previousRow = null;

			// Randomly select a point and see if it is valid or not
			var newFinishRow = null;
			var newFinishColumn = null;
			while(true) {
				// Get a random finish point
				newFinishRow = Math.floor(Math.random() * (this.environment.map.array.length - 1));
				newFinishColumn = Math.floor(Math.random() * (this.environment.map.array[0].length - 1));

				if(this.environment.map.array[newFinishRow][newFinishColumn] != 5 && this.environment.map.array[newFinishRow][newFinishColumn] != 9) {
					// Break out of the while loop
					break;
				}
			}

			//console.log('New finish row and column', newFinishRow, newFinishColumn);

			// Position the finish
			var finishPosition = this.environment.map.rowColumnToVector2(newFinishRow, newFinishColumn);
			this.environment.finish.object3d.position.x = finishPosition.x;
			this.environment.finish.object3d.position.y = finishPosition.y;
			
			// Make the previous end point walkable
			this.environment.map.array[this.row][this.column] = 0;
			this.environment.map.array[newFinishRow][newFinishColumn] = 9;

			// Play game again
			this.play();
		}
		else {
			//return;

			this.moveCount++;

			// Identify the new position
			var newPosition = this.environment.map.rowColumnToVector2(this.row, this.column);

			// Identify the direction
			var direction = null;
			if(this.previousRow < this.row) {
				direction = 'down';
			}
			else if(this.previousRow > this.row) {
				direction = 'up';
			}
			else if(this.previousColumn < this.column) {
				direction = 'right';
			}
			else if(this.previousColumn > this.column) {
				direction = 'left';
			}
			//console.log('direction', direction);

			// Adjust my rotation
			this.object3d.rotation.x = 0;
			this.object3d.rotation.y = 0;
			this.object3d.rotation.z = 0;
			var rotationX = this.object3d.rotation.x;
			var rotationY = this.object3d.rotation.y;
			var rotationZ = this.object3d.rotation.z;
			
			if(direction == 'up') {
				rotationX = rotationX + ((Math.PI / 2) * -1);
			}
			else if(direction == 'down') {
				rotationX = rotationX + (Math.PI / 2);
			}
			else if(direction == 'left') {
				rotationY = rotationY + ((Math.PI / 2) * -1);
			}
			else if(direction == 'right') {
				rotationY = rotationY + (Math.PI / 2);
			}

			//var maxPositionZ = (((Math.sqrt(2) * this.environment.gridCellSize) - this.environment.gridCellSize) / 2) + (this.environment.gridCellSize / 2);
			var maxPositionZ = (((Math.sqrt(2) * this.environment.gridCellSize) - this.environment.gridCellSize)) + (this.environment.gridCellSize / 2);
			var minPositionZ = (this.environment.gridCellSize / 2);

			// Rotation tween
			var rotationTweenStartVector3 = new THREE.Vector3(this.object3d.rotation.x, this.object3d.rotation.y, this.object3d.rotation.z);
			var rotationTweenEndVector3 = new THREE.Vector3(rotationX, rotationY, rotationZ);
			var rotationTweenDuration = this.speed;
			var rotationTweenCallback = null;
			var rotationTween = new Tween(rotationTweenStartVector3, rotationTweenEndVector3, rotationTweenDuration, rotationTweenCallback);
			var rotationMovement = new Movement(this.object3d, rotationTween, 'rotation');
			this.environment.mover.addMovement(rotationMovement);

			// Position tween
			var positionTweenStartVector3 = new THREE.Vector3(this.object3d.position.x, this.object3d.position.y, minPositionZ);
			var positionTweenEndVector3 = new THREE.Vector3(newPosition.x, newPosition.y, maxPositionZ);
			var positionTweenDuration = this.speed;
			var positionTweenCallback = function() {
				this.play();
			}.bind(this)
			var positionTween = new Tween(positionTweenStartVector3, positionTweenEndVector3, positionTweenDuration, positionTweenCallback);
			var positionMovement = new Movement(this.object3d, positionTween, 'position');
			this.environment.mover.addMovement(positionMovement);
		}
	},

	moveUp: function() {
		this.move(this.row - 1, this.column);
	},

	moveDown: function() {
		this.move(this.row + 1, this.column);
	},

	moveLeft: function() {
		this.move(this.row, this.column - 1);
	},

	moveRight: function() {
		this.move(this.row, this.column + 1);
	},

	play: function() {
		if(this.moveCount < this.moveLimit) {
			this.findAndExecuteNextMove();
		}
		else {
			console.log('Out of moves', this.moveCount);
		}
	}

});
