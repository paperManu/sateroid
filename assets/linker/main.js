require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        underscore: '/linker/js/libs/underscore-min',
        jqueryui: '/linker/js/libs/jquery-ui',
        three: '/linker/js/libs/three.min',
        world: '/linker/js/world',
        audioCtl: "/linker/js/audioCtl",
        laser: "/linker/js/audio/laser",
        noise: "/linker/js/audio/noise",
        motor: "/linker/js/audio/motor",
        objects: "/linker/js/objects",
        interface: '/linker/js/interface'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        jqueryui: {
            deps: ['jquery']
        },
        objects: {
            deps: ['three']
        }
    }
});

require(['jquery', 'jqueryui', 'world', 'interface'], function(jquery, jqueryui, world, interface) {
    window.socket = io.connect();
    if (window.document.URL.indexOf("world") >= 0) {
        world.initialize();
        world.renderLoop();
    } else {
        interface.initialize();
    }
});
