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
    
    var LaserCarrier = function() {
	var now = context.currentTime;
        // carrier
        this.carrier = context.createOscillator();
	this.gain = context.createGain();
        this.carrier.type = "sawtooth";
        //this.carrier.frequency.value = freq;
        this.carrier.connect(this.gain);
	this.gain.connect(context.destination);
	this.gain.value = 0.25;
        this.carrier.frequency.cancelScheduledValues(now);
        this.carrier.frequency.setValueAtTime(17000, now);
        this.carrier.frequency.linearRampToValueAtTime(10.0, now + 5.2);
        // this.carrier.frequency.linearRampToValueAtTime(0.0, now + 0.2);
	
	this.carrier2 = context.createOscillator();
	this.gain2 = context.createGain();
        this.carrier2.type = "sawtooth";
        //this.carrier.frequency.value = freq;
        this.carrier2.connect(this.gain);
	this.gain2.value = 0.25
        this.carrier2.frequency.cancelScheduledValues(now);
        this.carrier2.frequency.setValueAtTime(3600, now);
        this.carrier2.frequency.exponentialRampToValueAtTime(10.0, now + 10.17);
        // this.carrier.frequency.linearRampToValueAtTime(0.0, now + 0.2);
    }

    var Laser = function () {

	var now = context.currentTime;
        // carrier 1
        this.carrier = context.createOscillator();
	this.gain = context.createGain();
        this.carrier.type = "sawtooth";
        //this.carrier.frequency.value = freq;
        this.carrier.connect(this.gain);
	this.gain.value = 0.025;
        this.carrier.frequency.cancelScheduledValues(now);
        this.carrier.frequency.setValueAtTime(1800, now);
        this.carrier.frequency.linearRampToValueAtTime(10.0, now + 0.2);

	// carrier 2
	
	this.carrier2 = context.createOscillator();
	this.gain2 = context.createGain();
        this.carrier2.type = "sawtooth";
        //this.carrier.frequency.value = freq;
        this.carrier2.connect(this.gain2);
	this.gain2.value = 0.25;
        this.carrier2.frequency.cancelScheduledValues(now);
        this.carrier2.frequency.setValueAtTime(1300, now);
        this.carrier2.frequency.linearRampToValueAtTime(10.0, now + 0.37);
	
	// LP filter

	this.lp = context.createBiquadFilter();
	this.lp.type = 0;
	this.lp.frequency.value = 18000;
	this.gain.connect(this.lp);
	this.gain2.connect(this.lp);
	
	// HP filter

	this.hp = context.createBiquadFilter();
	this.hp.type = 1;
	this.hp.frequency.value = 380;
	this.lp.connect(this.hp);
	this.hp.connect(context.destination);


        // var now = context.currentTime;
        // // carrier
        // this.carrier = context.createOscillator();
        // this.carrier.type = "sawtooth";
        // //this.carrier.frequency.value = freq;
        // this.carrier.connect(context.destination);
        // //this.carrier.frequency.cancelScheduledValues(now);
        // this.carrier.frequency.setValueAtTime(17000, now);
        // this.carrier.frequency.exponentialRampToValueAtTime(10.0, now + 0.1);
        // // this.carrier.frequency.linearRampToValueAtTime(0.0, now + 0.2);
    }


    Laser.prototype.start = function (time) {
        this.carrier.start(time);
        this.carrier2.start(time);
        //this.ramp.start(time);
        //this.width.start(time);
    }
    
    Laser.prototype.stop = function (time) {
        this.carrier.stop(time);
        this.carrier2.stop(time);
        //this.ramp.stop(time);
        //this.width.stop(time);
    }

    var note;
    $(document).keydown(function(e){
        console.log("Key " + e.keyCode);
        if (e.keyCode == 17) {
            note = new Laser();
            note.start(0);
        }
        
    });
    $(document).keyup(function(e){
        if (e.keyCode == 17) {
            note.stop(0);
        }
    });
});
