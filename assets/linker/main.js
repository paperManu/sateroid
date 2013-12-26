require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        underscore: '/linker/js/libs/underscore-min',
        jqueryui: '/linker/js/libs/jquery-ui',
        three: '/linker/js/libs/three.min',
        stats: '/linker/js/libs/stats',
        world: '/linker/js/world',
        audio: "/linker/js/audio",
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
