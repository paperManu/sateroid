define(['three'], function(){
	'use strict';

    /*********/
    // Socket.io messages
    var socket = io.connect();
    socket.on("graph", function(graph) {
        console.log(graph);
    });

    /*********/
    // THREE.js variables
    var _scene, _camera;
    var _renderer;

    /*********/
	function initialize() {
	    console.log("init world");
        _scene = new THREE.Scene();
        _camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        _renderer = new THREE.WebGLRenderer();
        _renderer.setSize(window.innerWidth, window.innerHeight);
        //document.getElementById("world").appendChild(_renderer.domElement);
        document.body.appendChild(_renderer.domElement);

        var geometry = new THREE.CubeGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        var cube = new THREE.Mesh(geometry, material);
        _scene.add(cube);
        _camera.position.z = 5;
	}

    /*********/
    function renderLoop() {
        requestAnimationFrame(renderLoop);
        // Get the current state from the server
        socket.emit("update");
        // Render the scene
        _renderer.render(_scene, _camera);
    }

    /*********/
	return {
		initialize : initialize,
        renderLoop : renderLoop
	}
});
