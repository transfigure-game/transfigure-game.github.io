Environments.Concepts.Pathfinding.PathfindingPlayer = Environments.Concepts.Pathfinding.PathfindingEntity.extend({

	moveHistory: [],
	moveCount: 0,
	moveLimit: Infinity,
	//moveLimit: 2,
	memoryMap: [[]],

	previousRow: 0,
	previousColumn: 0,

	construct: function() {
		this.super.apply(this, arguments);

		// Position the player
		var playerPosition = this.environment.map.rowColumnToVector2(this.row, this.column);
		this.object3d.position.x = playerPosition.x;
		this.object3d.position.y = playerPosition.y;

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
		var cubeGeometry = new THREE.BoxGeometry(this.environment.gridCellSize * .75, this.environment.gridCellSize * .75, this.environment.gridCellSize * .75);
		var cubeMaterial = new THREE.MeshLambertMaterial({
			color: 0x00AAFF,
		});
		var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

		// Point light
		var pointLight = new THREE.PointLight(0xFFFFFF, 5, this.environment.gridCellSize * 4);
		pointLight.castShadow = true;
		//pointLight.position.z = this.environment.gridCellSize;

		// Point light helper
		var pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
		
		//pointLight.add(pointLightHelper);
		cube.add(pointLight);
		object3d.add(cube);

		return object3d;
	},

	canMoveTo: function(row, column) {
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

		if(canMoveUp && !hasVisitedUp) {
			this.moveUp();
		}
		else if(canMoveDown && !hasVisitedDown) {
			this.moveDown();
		}
		else if(canMoveLeft && !hasVisitedLeft) {
			this.moveLeft();
		}
		else if(canMoveRight && !hasVisitedRight) {
			this.moveRight();
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

		var position = this.environment.map.rowColumnToVector2(this.row, this.column);
		this.object3d.position.x = position.x;
		this.object3d.position.y = position.y;

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
			console.log('Done! Took '+this.moveCount+' steps.');

			//// Clear the board
			//this.moveHistory = [];
			//this.moveCount = 0;
			//this.memoryMap = [];

			//this.previousColumn = null;
			//this.previousRow = null;

			////reposition the finish point
			////console.table(this.environment.map.array);

			////check if its not a wall

			////OPTION 1 - Randomly select a point and see if it is valid or not
			///*while(true)
			//{
			//	//get a random finish point
			//	var newFinishY = Math.floor(Math.random() * (this.environment.map.array.length -  1)) + 0;
			//	var newFinishX = Math.floor(Math.random() * (this.environment.map.array[0].length -  1)) + 0;
			//	console.log(newFinishY, newFinishX);

			//	if (this.environment.map.array[newFinishY][newFinishX] != 5 && this.environment.map.array[newFinishY][newFinishX] != 9)
			//	{
			//		break;
			//	}
			//}*/
			
			////OPTION 2 - Same as option 1 but a bit faster. It randomly selects a cell location and if it is a wall
			////or a finish point then it checks if any of the surrounding cell can be a valid new finish point
			//while(true)
			//{
			//	//get a random finish point
			//	var newFinishY = Math.floor(Math.random() * (this.environment.map.array.length -  1)) + 0;
			//	var newFinishX = Math.floor(Math.random() * (this.environment.map.array[0].length -  1)) + 0;

			//	if (this.environment.map.array[newFinishY][newFinishX] != 5 && this.environment.map.array[newFinishY][newFinishX] != 9)
			//	{
			//		break;
			//	}
			//	else
			//	{
			//		if ( (newFinishX+1) < this.environment.map.array[0].length && this.environment.map.array[newFinishY][newFinishX+1] != 5 && this.environment.map.array[newFinishY][newFinishX+1] != 9)
			//		{
			//			newFinishX = newFinishX+1;
			//			newFinishY = newFinishY;
			//			break;
			//		}
			//		else if ( (newFinishY+1) < this.environment.map.array.length && this.environment.map.array[newFinishY+1][newFinishX] != 5 && this.environment.map.array[newFinishY+1][newFinishX] != 9)
			//		{
			//			newFinishX = newFinishX;
			//			newFinishY = newFinishY+1;
			//			break;
			//		}
			//		else if ( (newFinishX-1) >= 0 && this.environment.map.array[newFinishY][newFinishX-1] != 5 && this.environment.map.array[newFinishY][newFinishX-1] != 9)
			//		{
			//			newFinishX = newFinishX-1;
			//			newFinishY = newFinishY;
			//			break;
			//		}
			//		else if ( (newFinishY-1) >= 0 && this.environment.map.array[newFinishY-1][newFinishX] != 5 && this.environment.map.array[newFinishY-1][newFinishX] != 9)
			//		{
			//			newFinishX = newFinishX;
			//			newFinishY = newFinishY-1;
			//			break;
			//		}
			//	}
			//}

			////make the previous end point walkable
			//this.environment.map.array[this.row][this.column] = 0;
			//this.environment.map.array[newFinishY][newFinishX] = 9;
			//$('.cellRow'+newFinishY+ 'Column'+newFinishX).addClass('finish');
			////console.table(this.environment.map.array);

			////check if there is a path from new finish point to start point

			////play game again
			//this.play();
		}
		else {
			this.moveCount++;
			//$('.moveCount').html(this.moveCount);
			this.play();	
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
		setTimeout(function() {
			if(this.moveCount < this.moveLimit) {
				this.findAndExecuteNextMove();
			}
			else {
				console.log('Out of moves', this.moveCount);
			}
		}.bind(this), 50);
	}

});
