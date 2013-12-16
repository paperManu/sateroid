require.config({
  urlArgs: "bust=" + (new Date()).getTime(),
  paths: {
    underscore: '/linker/js/underscore-min',
    jqueryui: '/linker/js/jquery-ui'
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



require(['jquery', 'jqueryui'],

  function(jquery, jqueryui) {
    console.log("Init main");
  }
);