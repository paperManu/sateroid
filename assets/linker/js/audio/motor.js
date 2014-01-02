var Motor = function (context) {
    var audio = context;
    
    var now = audio.currentTime;   
    var waveform = "sawtooth";
    var noise = new PinkNoise(context);
    var noiseGain = audio.createGain();
    noiseGain.gain.value = 0.2;
    this.out = audio.createGain();
    this.carrier = audio.createOscillator();
    this.carrier.type = waveform;
    this.carrierRectifier = audio.createGain();

    this.carrier.connect(this.carrierRectifier);
    this.carrierRectifier.gain.value = 1;
    // this.carrierRectifier.gain = this.carrier * 1.5;
    this.carrier.frequency.value = 1500.0;
    
    this.noiseADSR = context.createGain();
    //this.carrierRectifier.connect(this.out);
    noise.connect(noiseGain);
    noiseGain.connect(this.noiseADSR);
    this.carrierRectifier.connect(this.noiseADSR.gain);
    this.noiseADSR.connect(this.out);
    //this.noiseADSR.gain.cancelScheduledValues(now);
    //this.noiseADSR.gain.linearRampToValueAtTime(1, now + 0.1);
    //this.out.gain.linearRampToValueAtTime(1.0, now + 0.1);
    this.out.connect(audio.destination);
}

Motor.prototype.start = function (time) {
    var fade = 0.5;
    //this.noiseADSR.gain.linearRampToValueAtTime(0, time + 0.1);
    this.out.gain.linearRampToValueAtTime(1, time + fade + 0.1);
    this.carrier.start(time);
}

Motor.prototype.stop = function (time) {
    var fade = 1.5;
    //this.noiseADSR.gain.cancelScheduledValues(time);
    this.out.gain.linearRampToValueAtTime(0, time + fade);
    this.carrier.stop(time + fade + 0.2);
}

