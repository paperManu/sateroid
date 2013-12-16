define(['three'], function(){
	'use strict';

    var socket = io.connect();
    socket.on("test", function(state) {
        console.log("prout");
    });
    socket.on("test2", function(state) {
        console.log("super");
    });
    socket.emit("test");

    // THREE.js variables
    var _scene, _camera;
    var _renderer;

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

    function renderLoop() {
        requestAnimationFrame(renderLoop);
        _renderer.render(_scene, _camera);
    }

	return {
		initialize : initialize,
        renderLoop : renderLoop
	}
});
