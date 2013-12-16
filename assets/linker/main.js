require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        underscore: '/linker/js/libs/underscore-min',
        jqueryui: '/linker/js/libs/jquery-ui',
        three: '/linker/js/libs/three.min',
        world: '/linker/js/world',
        audio: "/linker/js/audio",
        interface: '/linker/js/interface'
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

require(['jquery', 'jqueryui', 'world', 'interface'],

        function(jquery, jqueryui, world, interface) {

    window.socket = io.connect();

            if (window.document.URL.indexOf("world") >= 0) {
                world.initialize();
                world.renderLoop();
            } else {
                interface.initialize();
            }
        }
       );
