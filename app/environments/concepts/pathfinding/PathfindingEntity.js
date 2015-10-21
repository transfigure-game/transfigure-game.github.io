Environments.Concepts.Pathfinding.PathfindingEntity = Class.extend({

	environment: null,

	object3d: null,

	row: null,
	column: null,

	construct: function(environment) {
		this.environment = environment;
		this.object3d = this.generateObject3d();
	},

	generateObject3d: function() {
		return null;
	},

});