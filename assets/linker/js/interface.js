define([], function(){
	'use strict';

	function initialize() {
		console.log("init interface");
		var player = null;
		
		$("#connexion").submit(function(e) {
			e.preventDefault();

			socket.post("/players/create", {"nickname" : $("#nickname").val() }, function(data) {
				
				if(data.err) {
					alert(data.err);
					return;
				}
			    player = data.player;
			    $("#connexion").remove();
			    $("#control").css('display', 'table');
			    $("#name .val").html(player.nickname);

                socket.emit("logged", player.nickname);
			});
		});


		$(".btn").on('touchstart', function(e) {
		    var idBtn = $(this).data("id");
			$(this).toggleClass("active");
			socket.emit("btn", player.nickname, idBtn, 1 );
		});

		$(".btn").on('touchend', function(e) {
		   	var idBtn = $(this).data("id");
			$(this).toggleClass("active");
			socket.emit("btn", player.nickname, idBtn, 0);
		});


		function touchDirection(e) {
			e.preventDefault();
            var y = e.originalEvent.touches[0].pageY;
            var x = e.originalEvent.touches[0].pageX;

            y = -(y/$("#direction").height()*2-1);
            x = x/$("#direction").width()*2-1;

            socket.emit('direction', player.nickname, x, y);
        }

        function leaveDirection() {
            socket.emit('direction', player.nickname, 10, 10);
        }

        $("#direction").on({
            // 'mousedown' : touchDirection,
            // 'mouseup' : leaveDirection,
            // 'mouseleave' : leaveDirection,
            'touchmove' : touchDirection,
            'touchend' : leaveDirection
            // 'touchstart' : pressIn,
            // 'touchend'   : pressOut
        });
        console.log($("#direction"));
	}



	return {
		initialize : initialize
	}
});
