define(['three', 'stats', 'audioCtl', 'objects'], function(){
	'use strict';

    /*********/
    // THREE.js variables
    var _scene, _camera, _world;
    var _renderer;

    // Framerate counter
    var _stats;

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

    socket.on("removeObject", function(object) {
        var name = object[1];
        var obj = _world.getObjectByName(name);
        if (obj != undefined) {
            _world.remove(obj);
        }
    });

    /*********/
	function initialize() {
        _stats = new Stats();
        _stats.setMode(0);
        _stats.domElement.style.position = 'absolute';
        _stats.domElement.style.left = '0px';
        _stats.domElement.style.top = '0px';
        document.body.appendChild(_stats.domElement);

	    console.log("init world");
        _scene = new THREE.Scene();
        _camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        //_camera = new THREE.OrthographicCamera(-10, 10, -10, 10, 1, 1000);
        _camera.position.z = 10;

        _renderer = new THREE.WebGLRenderer();
        _renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(_renderer.domElement);

        _world = new Objects.World();
        _scene.add(_world);
        socket.emit("registerViewer");
	}

    /*********/
    function renderLoop() {
        requestAnimationFrame(renderLoop);

        _stats.begin();
        // Get the current state from the server
        socket.emit("update");
        // Render the scene
        _renderer.render(_scene, _camera);
        _stats.end();
    }

    /*********/
	return {
		initialize : initialize,
        renderLoop : renderLoop
	}
});
