define(['laser', 'noise', 'motor'], function(){
    'use strict';
    console.log("Audio loading");
    var context;
    var projectile;
    var motor;
    // wait for the window to load?
    //    window.addEventListener('load', init, false);
    //    function init() {
    try {
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        console.log("We have AudioContext");
        context = new AudioContext();
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
    }
    // }
    
   // init();
    console.log("AudioContext: ", context);

    $(document).keydown(function(e){
        console.log("Key " + e.keyCode);
        if (e.keyCode == 17) {
            projectile = new Laser(context);
            projectile.start(0);
        } else if (e.keyCode == 38) {
            motor = new Motor(context);
            motor.start(0);
        } else if (e.keyCode == 40) {
            motor.stop(0);
        }
    });
    // $(document).keyup(function(e){
    //     if (e.keyCode == 38) {
    //         motor.stop(0);
    //     }
    // });
});
