if (typeof window === 'undefined')
    var THREE = require("three");

/*************/
function World() {
    THREE.Object3D.call(this);

    // Private members
    var lastTick = (new Date).valueOf();

    /*********/
    var computeCollisions = function() {
    }

    /*********/
    this.getState = function() {
        var graph = [];

        for (child in this.children) {
            var obj = {
                name: this.children[child].name,
                position: this.children[child].position,
                rotation: this.children[child].rotation
            };
            graph.push(obj);
        }

        return graph;
    }

    /*********/
    this.update = function() {
        var currentTick = (new Date).valueOf();
        var delta = currentTick - lastTick;
        lastTick = currentTick;
    }
}

World.prototype = Object.create(THREE.Object3D.prototype);
World.prototype.constructor = World;

/*************/
function Item() {
    THREE.Object3D.call(this);

    this.direction = new THREE.Vector3(1, 0, 0);
    this.speed = 0.0;
    this.gyro = new THREE.Vector3(0, 0, 0);
    this.life = 1;

    /*********/
    this.accelerate = function(value, direction) {
    }

    /*********/
    this.impact = function() {
    }

    /*********/
    this.rotate = function(angle) {
        this.rotateOnAxis(new THREE.Vector3(1, 0, 0), angle);
        console.log(this.rotation);
    }

    /*********/
    this.update = function(delta) {
    }
}

Item.prototype = Object.create(THREE.Object3D.prototype);
Item.prototype.constructor = Item;

/*************/
function Ship() {
    Item.call(this);
}

Ship.prototype = Object.create(Item.prototype);
Ship.prototype.constructor = Ship;

/*************/
function Laser() {
    Item.call(this);
}

Laser.prototype = Object.create(Item.prototype);
Laser.prototype.constructor = Laser;

/*************/
function Asteroid() {
    Item.call(this);
}

Asteroid.prototype = Object.create(Item.prototype);
Asteroid.prototype.constructor = Asteroid;

/*************/
if (typeof window === 'undefined') {
    exports.World = World;
    exports.Ship = Ship;
    exports.Laser = Laser;
    exports.Asteroid = Asteroid;
}
else {
    define(World);
    define(Ship);
    define(Laser);
    define(Asteroid);
}
