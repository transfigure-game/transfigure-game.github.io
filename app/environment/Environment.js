Environment = Class.extend({

	app: null,

	scene: null,
	mover: null,
	camera: null,
	controls: null,

	shouldRender: true,

	isStarted: false,
	isStopped: false,

	dependencies: null,
	loadedDependencies: 0,
	loadAfterInitialization: false,

	construct: function(app, loadAfterInitialization) {
		this.app = app;
		this.loadAfterInitialization = loadAfterInitialization;

		this.requireDependenciesAndInitialize();
	},

	requireDependenciesAndInitialize: function() {
		// Require all of the necessary scripts
		if(this.dependencies && this.dependencies.length) {
			for(var i = 0; i < this.dependencies.length; i++) {
				//console.log('Including scripts', this.dependencies[i]);
				this.app.includeEnvironmentScript(this.dependencies[i], this.dependencyLoaded.bind(this));
			}
		}
		// If there are no dependencies just initialize
		else {
			this.initialize();
		}
	},

	dependencyLoaded: function() {
		this.loadedDependencies++;
		//console.log('this.loadedDependencies', this.loadedDependencies);

		if(this.loadedDependencies == this.dependencies.length) {
			//console.log('All dependencies loaded, initializing...');
			this.initialize();
		}
	},

	initialize: function() {
		if(this.loadAfterInitialization) {
			this.load();
		}
	},

	stop: function() {
		this.isStarted = false;
		this.isStopped = true;
		this.shouldRender = false;
	},

	start: function() {
		if(!this.isStarted) {
			this.isStarted = true;
			this.isStopped = false;
			this.shouldRender = true;
			this.render();
		}
	},

	load: function() {
		// Create and build the scene
		this.scene = new THREE.Scene();
		this.buildScene();

		// Create a mover to manage movement
		this.mover = new Mover();
	
		// Create the camera
		this.camera = this.createCamera();

		// Connect to app controls
		this.controls = this.connectControls();

		// Start the scene
		this.start();
	},

	unload: function() {
		// Stop the environment
		this.stop();

		if(this.scene) {
			// This works
			while(this.scene.children.length > 0) {
				if(this.scene.children[this.scene.children.length - 1].geometry) {
					//console.log('Can dispose geometry');
					this.scene.children[this.scene.children.length - 1].geometry.dispose();
				}
				else {
					//console.log('Cannot dispose geometry');
				}
				if(this.scene.children[this.scene.children.length - 1].material) {
					//console.log('Can dispose material');
					this.scene.children[this.scene.children.length - 1].material.dispose();	
				}
				else {
					//console.log('Cannot dispose material');
				}
				if(this.scene.children[this.scene.children.length - 1].texture) {
					//console.log('Can dispose texture');
					this.scene.children[this.scene.children.length - 1].texture.dispose();
				}
				else {
					//console.log('Cannot dispose texture');
				}
				
				this.scene.remove(this.scene.children[this.scene.children.length - 1]);
			}

			this.scene = null;
		}

		this.app = null;
		this.camera = null;
		this.controls = null;
	},

	buildScene: function() {
		console.error('You must implement Environment.buildScene().');
	},

	createCamera: function() {
		var fov = 75;
		var near = 1;
		var far = 10000;

		var camera = new THREE.CombinedCamera((this.app.rendererDomElement.width() / 2), (this.app.rendererDomElement.height() / 2), fov, near, far, near, far);
		camera.position.z = 1000;
		camera.lookAt(new THREE.Vector3(0, 0, 0));
		camera.toPerspective();

		return camera;
	},

	connectControls: function() {
		return this.createControls();
	},

	createControls: function() {
		var controls = new THREE.OrbitControls(this.camera);
		controls.enablePan = true;
		controls.enableZoom = true;
		controls.enableRotate = true;

		return controls;
	},

	rendererResized: function(rendererWidth, rendererHeight) {
		this.camera.cameraP.aspect = rendererWidth / rendererHeight;
		this.camera.updateProjectionMatrix();
	},

	beforeRender: function() {
	},

	render: function() {
		if(this.scene && this.shouldRender) {
			this.beforeRender();

			// Have the mover move things around
			this.mover.move();

			// Update the controls
			this.controls.update();

			// Render the scene
			this.app.renderer.render(this.scene, this.camera);

			// Recursively call render
			requestAnimationFrame(this.render.bind(this));

			this.afterRender();
		}
	},

	afterRender: function() {
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