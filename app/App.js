App = Class.extend({

	menu: null,
	controls: null,
	environment: null,

	construct: function(environmentPath) {
		// Create the menu
		this.menu = this.createMenu();

		// Create the controls
		this.controls = this.createControls();

		// Optionally load an environment
		if(environmentPath) {
			this.loadEnvironmentFromScript(environmentPath);
		}
	},

	createMenu: function() {
		var menu = new Menu(this);

		return menu;
	},

	createControls: function() {
		var controls = new Controls();

		return controls;
	},

	loadScript: function(url, callback) {
		// Create a script tag
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;

		// Bind the callback function the when the script is loaded
		script.onload = script.onreadystatechange = callback;

		// Append the script tag to the DOM
		head.appendChild(script);
	},

	loadEnvironmentFromScript: function(environmentPath) {
		var environmentUrl = 'environments/'+environmentPath;
		var environmentClassName = environmentPath.split('/').reverse().first().replaceLast('.js', '');
		console.log(environmentUrl, environmentClassName);

		// Include the environment path
		this.loadScript(environmentUrl, function() {
			this.environment = new global[environmentClassName]();
		}.bind(this));
	},

});

$(document).ready(function() {
	// Setup Semantic UI
	$('.ui.checkbox').checkbox();
	$('.popup').popup({
    	position : 'right center',
  	});

  	// Map global to window
  	global = window;

	// Start the app

	// TODO: Get a menu item to load this environment
	//App = new App('concepts/shapes/cube/ConceptsShapesCubeEnvironment.js'); // working

	App = new App('concepts/pathfinding/ConceptsPathfindingEnvironment.js');
});