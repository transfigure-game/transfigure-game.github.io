Environment = Class.extend({

	domElement: null,

	scene: null,
	movingObjects: [],

	camera: null,
	controls: null,
	
	renderer: null,

	construct: function() {
		// Reference the element on the DOM to store the environment
		this.domElement = $('#environment');

		// Create and build the scene
		this.scene = new THREE.Scene();
		this.buildScene();
	
		// Create the camera
		this.camera = this.createCamera();

		// Create the renderer and add it to the DOM
		this.renderer = this.createRenderer();

		// Connect to app controls
		this.controls = this.connectControls();

		// Render the scene
		this.render();
	},

	buildScene: function() {
		console.error('You must implement Environment.buildScene().');
	},

	createCamera: function() {
		var fov = 90;
		var near = 1;
		var far = 10000;

		var camera = new THREE.CombinedCamera((this.domElement.width() / 2), (this.domElement.height() / 2), fov, near, far, near, far);
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

	createRenderer: function() {
		// Create the renderer
		var renderer = new THREE.WebGLRenderer({
			antialias: true,
			//alpha: true,
		});

		// Set its size
		renderer.setSize(this.domElement.width(), this.domElement.height());

		// Add the renderer to the DOM
		this.domElement.append(renderer.domElement);

		// Listen to window resize events
		$(window).resize(function() {
			this.resizeRenderer();
		}.bind(this));

		return renderer;
	},

	resizeRenderer: function() {
		this.camera.cameraP.aspect = this.domElement.width() / this.domElement.height();
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.domElement.width(), this.domElement.height());
	},

	beforeRender: function() {
	},

	render: function() {
		if(this.scene) {
			this.beforeRender();

			// Recursively call render
			requestAnimationFrame(this.render.bind(this));

			// Update the controls
			this.controls.update();

			// Render the scene
			this.renderer.render(this.scene, this.camera);

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