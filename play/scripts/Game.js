Game = Class.extend({

	scene: null,
	camera: null,
	renderer: null,

	cube: null,

	construct: function() {
		// Create the scene
		this.scene = new THREE.Scene();

		// Create the camera
		this.camera = new THREE.PerspectiveCamera(45, $('#game').width() / $('#game').height(), 0.1, 1000);
		//this.camera = new THREE.OrthographicCamera(75, $('#game').width() / $('#game').height(), 0.1, 1000);
		this.camera.position.z = 5;

		// Create the renderer and add it to the DOM
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
		});
		this.renderer.setSize($('#game').width(), $('#game').height());
		$('#game').append(this.renderer.domElement);

		// Create a cube
		var geometry = new THREE.BoxGeometry(1, 1, 1);
		//var geometry = new THREE.SphereGeometry(1, 128, 128);
		var material = new THREE.MeshNormalMaterial();
		//var material = new THREE.MeshPhongMaterial({
		//	color: 0x00AAFF,
		//});
		//var material = new THREE.MeshLambertMaterial({
		//	color: 0x00AAFF,
		//});
		this.cube = new THREE.Mesh(geometry, material);

		// Add it to the scene
		this.scene.add(this.cube);

		// create a point light
		var pointLight = new THREE.PointLight(0xFFFFFF);

		// set its position
		pointLight.position.x = 1.5;
		pointLight.position.y = 1.5;
		pointLight.position.z = 2.5;

		// add to the scene
		this.scene.add(pointLight);

		var light = new THREE.AmbientLight( 0x404040 ); // soft white light
		this.scene.add( light );

		this.render();
	},

	render: function() {
		requestAnimationFrame(this.render.bind(this));

		this.cube.rotation.x += 0.01;
		this.cube.rotation.y += 0.01;

		this.renderer.render(this.scene, this.camera);
	},

});

$(document).ready(function() {
	$('.ui.checkbox').checkbox();
	$('.popup').popup({
    	position : 'right center',
  	});

	var game = new Game();
});