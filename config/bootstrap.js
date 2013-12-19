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
    var Objects = require("../assets/linker/js/objects.js");

    var _world;

	//when we start the server we removed all players
	Players.find().done(function(err, players) {
		_.each(players, function(player) {
			Players.destroy({id : player.id}).done(function(err) {
				if(err) console.log(err);
			});
		});
	});

	sails.io.sockets.on('connection', function (socket) {
        var ship;
        
		socket.on("btn", function(nickname, btn, value ) {
			console.log(nickname, btn, value);
		});

        socket.on("logged", function(nickname) {
            ship = new Objects.Ship();
            ship.name = nickname;
            _world.addObject(ship);
        });

		socket.on("direction", function(nickname, x, y) {
			console.log(nickname, x, y);
            ship.rotate(x);
		});

		socket.on("disconnect", function() {
			Players.findOne({socketId : socket.id}).done(function(err, player) {
				if(!err && player) {
					Players.destroy({socketId : socket.id}).done(function(err) {
						if(err) {
							console.log("error removed player", err);
							return;
						}
						console.log("Player "+player.nickname+" is disconnected");

                        _world.remove(ship);
					});
				}
			});
		});

        socket.on("registerViewer", function() {
            _world.addSocket(socket);
        });

        socket.on("update", function() {
            var graph = _world.getState();
            socket.emit("graph", graph);
        });
	});

	Players.find().done(function(err, players){
		console.log(err, players);
	});

    /*********/
    // Scene graph main loop
    function gameLoop() {
        _world.update();
        setImmediate(gameLoop);
    }

    function initGame() {
        _world = new Objects.World();
    }

    initGame();
    setImmediate(gameLoop);

    // It's very important to trigger this callack method when you are finished 
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};
