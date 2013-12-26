define(['three', 'stats', 'audio', 'objects'], function(){
	'use strict';

    /*********/
    // THREE.js variables
    var _scene, _camera, _world;
    var _renderer;

    // Framerate counter
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    /*********/
    // Socket.io messages
    var socket = io.connect();
    socket.on("graph", function(graph) {
        _world.setState(graph);
        //console.log(graph);
    });

    socket.on("addObject", function(object) {
        var objectType = Objects[object[0]];
        if (objectType === undefined)
            return;

        var instance = new objectType();
        instance.name = object[1];
        _world.addObject(instance);
    });

    /*********/
	function initialize() {
	    console.log("init world");
        _scene = new THREE.Scene();
        _camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        //_camera = new THREE.OrthographicCamera(-10, 10, -10, 10, 1, 1000);
        _camera.position.z = 10;

        _renderer = new THREE.WebGLRenderer();
        _renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(_renderer.domElement);

        //var geometry = new THREE.CubeGeometry(1, 1, 1);
        //var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        //var cube = new THREE.Mesh(geometry, material);
        //_scene.add(cube);

        _world = new Objects.World();
        _scene.add(_world);
        socket.emit("registerViewer");
	}

    /*********/
    function renderLoop() {
        requestAnimationFrame(renderLoop);

        stats.begin();
        // Get the current state from the server
        socket.emit("update");
        // Render the scene
        _renderer.render(_scene, _camera);
        stats.end();
    }

    /*********/
	return {
		initialize : initialize,
        renderLoop : renderLoop
	}
});
