//
// Player
//
Player = function(level) {
	this.moveHistory = [];
	this.moveCount = 0;
	this.moveLimit = 999999;
	this.memoryMap = [];

	this.level = level;

	this.previousX = null;
	this.previousY = null;

	this.x = this.level.playerStart.x;
	this.y = this.level.playerStart.y;

	this.activeCellElement = $('.cell.cellRow'+this.y+'Column'+this.x).addClass('active');
	this.previousCellElement = null;
	this.nextCellElement = null;
}
Player.prototype.canMoveTo = function(x, y) {
	var canMoveTo = false;
	var cellDiv = $('.cell.cellRow'+y+'Column'+x);
	var cellValue = this.level.map[x, y];

	// Row exists
	if(y >= 0 && y < this.level.map.length) {
		//console.log('Row exists');
		// Cell exists
		if(x >= 0 && x < this.level.map[y].length) {
			//console.log('Cell exists');
			// Cell is not a wall
			if(!cellDiv.is('.wall')) {
				canMoveTo = true;
			}
		}
	}

	return canMoveTo;
}
Player.prototype.hasVisited = function(x, y) {
	var hasVisited = 0;

	if(this.memoryMap[y] && this.memoryMap[y][x] !== undefined) {
		hasVisited = this.memoryMap[y][x];
	}

	return hasVisited;
}
Player.prototype.findAndExecuteNextMove = function() {
	var canMoveUp = this.canMoveTo(this.x, this.y - 1);
	var canMoveDown = this.canMoveTo(this.x, this.y + 1);
	var canMoveLeft = this.canMoveTo(this.x - 1, this.y);
	var canMoveRight = this.canMoveTo(this.x + 1, this.y);

	var hasVisitedUp = this.hasVisited(this.x, this.y - 1);
	var hasVisitedDown = this.hasVisited(this.x, this.y + 1);
	var hasVisitedLeft = this.hasVisited(this.x - 1, this.y);
	var hasVisitedRight = this.hasVisited(this.x + 1, this.y);

	// First preference is to move down
	if(canMoveDown && !hasVisitedDown) {
		this.moveDown();
	}
	// Second preference is to move right
	else if(canMoveRight && !hasVisitedRight) {
		this.moveRight();
	}
	// Third preference is to move up
	else if(canMoveUp && !hasVisitedUp) {
		this.moveUp();
	}
	// Fourth preference is to move left
	else if(canMoveLeft && !hasVisitedLeft) {
		this.moveLeft();
	}
	else if(this.moveHistory.length <= 1) {
		console.log('No solution.');
	}
	else {
		// Back track
		$('.active').addClass('struck');
		this.moveHistory.pop();
		var previousMove = this.moveHistory.pop();
		this.move(previousMove.x, previousMove.y);
	}

	this['move'+possibleMoves[nextMoveIndex]]();
}
Player.prototype.move = function(x, y) {
	this.activeCellElement.removeClass('active');
	this.nextCellElement = $('.cell.cellRow'+y+'Column'+x);

	this.previousCellElement = this.activeCellElement;
	this.activeCellElement = this.nextCellElement;

	this.activeCellElement.addClass('active');

	if(this.previousCellElement.is('.walkedOnTwice')) {
		this.previousCellElement.addClass('walkedOnThrice');	
	}
	else if(this.previousCellElement.is('.walkedOn')) {
		this.previousCellElement.addClass('walkedOnTwice');	
	}
	else {
		this.previousCellElement.addClass('walkedOn');
	}

	this.previousX = this.x;
	this.previousY = this.y;

	this.x = x;
	this.y = y;

	this.moveHistory.push({
		x: this.x,
		y: this.y,
	});

	// Create the column if it doesn't exist
	if(!this.memoryMap[y]) {
		this.memoryMap[y] = [];
	}
	if(!this.memoryMap[y][x]) {
		this.memoryMap[y][x] = 0;
	}
	this.memoryMap[y][x]++;

	//console.table(this.memoryMap);
	
	//console.log('Moving to', x+', '+y);

	if(this.activeCellElement.is('.finish')) {
		console.log('Done! Took '+this.moveCount+' steps.');

		//clear the board
		$('.cell').removeClass('walkedOn');
		$('.cell').removeClass('walkedOnTwice');
		$('.cell').removeClass('walkedOnThrice');
		$('.cell').removeClass('finish');

		this.moveHistory = [];
		this.moveCount = 0;
		this.memoryMap = [];

		this.previousX = null;
		this.previousY = null;

		//reposition the finish point
		console.table(this.level.map);

		//check if its not a wall

		//OPTION 1 - Randomly select a point and see if it is valid or not
		/*while(true)
		{
			//get a random finish point
			var newFinishY = Math.floor(Math.random() * (this.level.map.length -  1)) + 0;
			var newFinishX = Math.floor(Math.random() * (this.level.map[0].length -  1)) + 0;
			console.log(newFinishY, newFinishX);

			if (this.level.map[newFinishY][newFinishX] != 5 && this.level.map[newFinishY][newFinishX] != 9)
			{
				break;
			}
		}*/
		
		//OPTION 2 - Same as option 1 but a bit faster. It randomly selects a cell location and if it is a wall
		//or a finish point then it checks if any of the surrounding cell can be a valid new finish point
		while(true)
		{
			//get a random finish point
			var newFinishY = Math.floor(Math.random() * (this.level.map.length -  1)) + 0;
			var newFinishX = Math.floor(Math.random() * (this.level.map[0].length -  1)) + 0;

			if (this.level.map[newFinishY][newFinishX] != 5 && this.level.map[newFinishY][newFinishX] != 9)
			{
				break;
			}
			else
			{
				if ( (newFinishX+1) < this.level.map[0].length && this.level.map[newFinishY][newFinishX+1] != 5 && this.level.map[newFinishY][newFinishX+1] != 9)
				{
					newFinishX = newFinishX+1;
					newFinishY = newFinishY;
					break;
				}
				else if ( (newFinishY+1) < this.level.map.length && this.level.map[newFinishY+1][newFinishX] != 5 && this.level.map[newFinishY+1][newFinishX] != 9)
				{
					newFinishX = newFinishX;
					newFinishY = newFinishY+1;
					break;
				}
				else if ( (newFinishX-1) >= 0 && this.level.map[newFinishY][newFinishX-1] != 5 && this.level.map[newFinishY][newFinishX-1] != 9)
				{
					newFinishX = newFinishX-1;
					newFinishY = newFinishY;
					break;
				}
				else if ( (newFinishY-1) >= 0 && this.level.map[newFinishY-1][newFinishX] != 5 && this.level.map[newFinishY-1][newFinishX] != 9)
				{
					newFinishX = newFinishX;
					newFinishY = newFinishY-1;
					break;
				}
			}
		}

		//make the previous end point walkable
		this.level.map[this.y][this.x] = 0;
		this.level.map[newFinishY][newFinishX] = 9;
		$('.cellRow'+newFinishY+ 'Column'+newFinishX).addClass('finish');
		console.table(this.level.map);

		//check if there is a path from new finish point to start point

		//play game again
		this.play();

		return;
	}

	this.moveCount++;
	$('.moveCount').html(this.moveCount);
	this.play();
}
Player.prototype.moveUp = function() {
	this.move(this.x, this.y - 1);
}
Player.prototype.moveDown = function() {
	this.move(this.x, this.y + 1);
}
Player.prototype.moveLeft = function() {
	this.move(this.x - 1, this.y);
}
Player.prototype.moveRight = function() {
	this.move(this.x + 1, this.y);
}
Player.prototype.play = function() {
	setTimeout(function() {
		if(this.moveCount < this.moveLimit) {
			this.findAndExecuteNextMove();
		}
		else {
			console.log('Out of moves', this.moveCount);
		}
	}.bind(this), 50);
}
