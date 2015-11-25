Mover = Class.extend({

	movements: [],

	move: function() {
		if(this.movements.length) {
			//console.log(this.movements.length, 'movements');

			var i = this.movements.length
			while(i--) {
				var movement = this.movements[i].move();

				// Remove all of the completed movements
				if(movement.isFinished) {
					this.movements.splice(i, 1);
				}
			}
		}
		//else {
		//	console.log('0 movements');
		//}
	},

	addMovement: function(movement) {
		this.movements.push(movement);
	},

});