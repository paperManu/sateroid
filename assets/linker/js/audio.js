define(['audio'], function(){
    'use strict';
    console.log("Audio loading");
    var context;
    window.addEventListener('load', init, false);
    function init() {
        try {
            // Fix up for prefixing
            window.AudioContext = window.AudioContext||window.webkitAudioContext;
            console.log("We have AudioContext");
            context = new AudioContext();
        }
        catch(e) {
            alert('Web Audio API is not supported in this browser');
        }
    }
    init();
    
    var synthNote = function (type, freq) {
        var now = context.currentTime;
        // carrier
        this.carrier = context.createOscillator();
        this.carrier.type = type;
        //this.carrier.frequency.value = freq;
        this.carrier.connect(context.destination);
        //this.carrier.frequency.cancelScheduledValues(now);
        this.carrier.frequency.setValueAtTime(freq, now);
        this.carrier.frequency.exponentialRampToValueAtTime(0.0, now + 0.1);
        //this.carrier.frequency.linearRampToValueAtTime(0.0, now + 0.2);
        // if (this.carrier.frequency < 20) {
        //     this.carrier.stop(0);
        // }
    }

    synthNote.prototype.start = function (time) {
        this.carrier.start(time);
        //this.ramp.start(time);
        //this.width.start(time);
    }
    
    synthNote.prototype.stop = function (time) {
        this.carrier.stop(time);
        //this.ramp.stop(time);
        //this.width.stop(time);
    }

    var note;
    $(document).keydown(function(e){
        console.log("Key " + e.keyCode);
        if (e.keyCode == 18) {
            note = new synthNote("sawtooth", Math.floor(Math.random() * 1000 + 5000));
            note.start(0);
        }
        
    });
    $(document).keyup(function(e){
        if (e.keyCode == 32) {
            note.stop(0);
        }
    });
});
