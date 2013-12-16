/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (cb) {
    var StateMachine = require("../assets/linker/js/libs/state-machine.min.js").StateMachine;
    var THREE = require("three");
    var Objects = require("../assets/linker/js/objects.js");
    console.log(Objects);

    /*********/
    // Socket.io related
	sails.io.sockets.on('connection', function (socket) {
		socket.on("test", function(v) {
            socket.emit("test");
		});

        socket.on("test2", function(v) {
            console.log("Acknowledged");
        });
	});

	Players.find().done(function(err, players){
		console.log(err, players);
	});

    /*********/
    var _world;
    // Scene graph main loop
    function gameLoop() {
        _world.update();
        setImmediate(gameLoop);
    }

    function initGame() {
        _world = new Objects.World();
        var player = new Objects.Player();
    }

    initGame();
    setImmediate(gameLoop);

    // It's very important to trigger this callack method when you are finished 
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};
