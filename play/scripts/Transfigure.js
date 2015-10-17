Transfigure = Class.extend({

	scene: null,
	sceneObjects: {},
	camera: null,
	controls: null,
	renderer: null,
	settings: null,

	construct: function() {
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

		// Create the player
		var playerGeometry = new THREE.BoxGeometry(75, 75, 75);
		var playerMaterial = new THREE.MeshNormalMaterial();
		this.sceneObjects.player = new THREE.Mesh(playerGeometry, playerMaterial);
		this.sceneObjects.player.position.y = playerGeometry.vertices[0].x;
		this.sceneObjects.player.position.x = -1000;
		this.sceneObjects.player.position.z = -1000;
		this.scene.add(this.sceneObjects.player);

		// Create the finish (a sphere)
		var finishGeometry = new THREE.SphereGeometry(75 / 2, 32, 32);
		var finishMaterial = new THREE.MeshNormalMaterial();
		this.sceneObjects.finish = new THREE.Mesh(finishGeometry, finishMaterial);
		this.sceneObjects.finish.position.y = finishGeometry.vertices[0].y;
		this.sceneObjects.finish.position.x = 1000;
		this.scene.add(this.sceneObjects.finish);
		
		// Create the grid
		var gridMaterial = new THREE.LineBasicMaterial({
			color: 0x2F2F2F,
		});
		this.sceneObjects.grid = this.createGrid(gridMaterial, 25, 25, 100, 100);
		this.scene.add(this.sceneObjects.grid);

		// Create the floor
		var floor = new THREE.Mesh(new THREE.BoxGeometry(25 * 100, 10, 25 * 100), new THREE.MeshLambertMaterial({
			color: 0x0F0F0F,
		}));
		floor.position.y = -5.5;
		this.scene.add(floor);

		// Create ambient light
		//var ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
		var ambientLight = new THREE.AmbientLight(0xFFFFFF); // Full white
		this.scene.add(ambientLight);
	},

	createGrid: function(material, width, height, cellWidth, cellHeight) {
		var size = (width * cellWidth) / 2;
		var step = cellWidth;
		var geometry = new THREE.Geometry();

		for(var i = -size; i <= size; i += step) {
			geometry.vertices.push(new THREE.Vector3(-size, 0, i));
			geometry.vertices.push(new THREE.Vector3(size, 0, i));
			geometry.vertices.push(new THREE.Vector3(i, 0, -size));
			geometry.vertices.push(new THREE.Vector3(i, 0, size));
		}

		var grid = new THREE.LineSegments(geometry, material);

		return grid;
	},

	createCamera: function() {
		this.camera = new THREE.CombinedCamera(($('#game').width() / 2), ($('#game').height() / 2), 90, 0.1, 100000, 0.1, 100000);
		this.camera.position.y = 1350;
		this.camera.lookAt(this.sceneObjects.player.position);
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

		return this.renderer;
	},

	render: function() {
		requestAnimationFrame(this.render.bind(this));
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	},

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