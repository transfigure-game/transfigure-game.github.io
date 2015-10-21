App = Class.extend({

	menu: null,
	controls: null,
	environment: null,

	rendererDomElementId: 'environment',
	rendererDomElement: null,
	renderer: null,

	construct: function(environmentPath) {
		// Create the menu
		this.menu = this.createMenu();

		// Create the controls
		this.controls = this.createControls();

		// Create the renderer and add it to the DOM
		this.renderer = this.createRenderer();

		// Optionally include and load an environment
		if(environmentPath) {
			this.loadEnvironmentFromEnvironmentPath(environmentPath);
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

	createRenderer: function() {
		// Reference the element on the DOM to store the environment
		this.rendererDomElement = $('#'+this.rendererDomElementId);

		// Create the renderer
		var renderer = new THREE.WebGLRenderer({
			antialias: true,
			//alpha: true,
		});

		// Set its size
		renderer.setSize(this.rendererDomElement.width(), this.rendererDomElement.height());

		// Add the renderer to the DOM
		this.rendererDomElement.append(renderer.domElement);

		// Listen to window resize events
		$(window).resize(function() {
			this.resizeRenderer();
		}.bind(this));

		return renderer;
	},

	resizeRenderer: function() {
		this.renderer.setSize(this.rendererDomElement.width(), this.rendererDomElement.height());

		if(this.environment) {
			this.environment.rendererResized(this.rendererDomElement.width(), this.rendererDomElement.height());
		}
	},
	
	loadEnvironmentFromEnvironmentPath: function(environmentPath) {
		this.includeEnvironmentScript(environmentPath, this.loadEnvironment);
	},

	classNameToObject: function(string) {
		//console.log('classNameToObject', string);
		var object = global;

		string.split('.').forEach(function(value) {
			//console.log(value);
			object = object[value];
		});

		return object;
	},

	includeEnvironmentScript: function(environmentPath, callback) {
		var environmentUrl = 'environments/'+environmentPath+'.js';
		var environmentClassName = ('environments/'+environmentPath).replaceLast('.js', '').replace('/', '-').replace(/-(.)/g, function(match, group1) {
	        return '.'+group1.toUpperCase();
	    }).uppercaseFirstCharacter();
		//console.log('Loading', environmentUrl, environmentClassName);

		// If the environment class is already loaded
		var environmentClass = this.classNameToObject(environmentClassName);
		if(environmentClass) {
			// Run the callback
			if(callback) {
				callback.call(this, environmentClassName);
			}
		}
		else {
			// Include the environment path
			this.includeScript(environmentUrl, callback, environmentClassName);	
		}
	},

	includeScript: function(url, callback, className) {
		// Create a script tag
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;

		// Bind the callback function the when the script is loaded
		script.onload = script.onreadystatechange = function() {
			if(callback) {
				callback.call(this, className);
			}
		}.bind(this);

		// Append the script tag to the DOM
		head.appendChild(script);
	},

	loadEnvironment: function(environmentClassName) {
		if(this.environment) {
			this.unloadEnvironment();
		}

		var environmentClass = this.classNameToObject(environmentClassName);

		this.environment = new environmentClass(this, true);
	},

	unloadEnvironment: function() {
		this.environment.unload();
		this.environment = null;
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
	//App = new App('concepts/shapes/cube/CubeEnvironment');
	App = new App('concepts/pathfinding/PathfindingEnvironment');
});