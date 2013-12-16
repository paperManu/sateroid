require.config({
  urlArgs: "bust=" + (new Date()).getTime(),
  paths: {
    underscore: '/linker/js/libs/underscore-min',
    jqueryui: '/linker/js/libs/jquery-ui',
    world : '/linker/js/world'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    jqueryui: {
      deps: ['jquery']
    }
  }
});

require(['jquery', 'jqueryui', 'world'],

  function(jquery, jqueryui, world) {
    console.log("Init main");

     var socket = io.connect();
     socket.on('connect', function socketConnected() {

      socket.emit("test", "test ok");
      });

    //world.patate();
    
  }
);