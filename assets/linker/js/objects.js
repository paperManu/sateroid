if (typeof window === 'undefined') {
    var THREE = require("three");
    var isInNode = true;
}
else {
    var isInNode = false;
}

/*************/
function World() {
    THREE.Object3D.call(this);

    this.type = "World";

    // Private members
    var lastTick = (new Date).valueOf();
    var sockets = [];

    /*********/
    var computeCollisions = function() {
    }

    /*********/
    this.addObject = function(object) {
        if (object.type === undefined)
            return;

        this.add(object);
        if (isInNode) {
            for (socket in sockets) {
                sockets[socket].emit("addObject", [object.type, object.name]);
            }
        }
    }

    /*********/
    this.addSocket = function(socket) {
        sockets.push(socket);
        for (var i in this.children) {
            socket.emit("addObject", [this.children[i].type, this.children[i].name]);
        }
    }

    /*********/
    this.getState = function() {
        var graph = [];

        for (var child in this.children) {
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
    this.setState = function(state) {
        if (typeof state != typeof [])
            return;

        for (var item in state) {
            for (var i in this.children)
                if (this.children[i].name == state[item].name)
                    var child = this.children[i];
            if (child === undefined)
                continue;

            child.position.set(state[item].position.x, state[item].position.y, state[item].position.z);
            child.rotation.set(state[item].rotation.x, state[item].rotation.y, state[item].rotation.z);
        }
    }

    /*********/
    this.update = function() {
        var currentTick = (new Date).valueOf();
        var delta = (currentTick - lastTick) * 0.001;
        lastTick = currentTick;

        for (var i in this.children)
            this.children[i].update(delta);
    }
}

World.prototype = Object.create(THREE.Object3D.prototype);
World.prototype.constructor = World;

/*************/
function Item() {
    THREE.Object3D.call(this);

    this.type = "Item";
    this.direction = new THREE.Vector3(1, 0, 0);
    this.speed = new THREE.Vector3(0, 0, 0);
    this.acceleration = 0.0;
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
        this.gyro.set(0, 0, angle);
    }

    /*********/
    this.move = function(acceleration) {
        this.acceleration = acceleration;
    }

    /*********/
    this.update = function(delta) {
        // Update orientation
        this.rotateOnAxis(new THREE.Vector3(0, 0, 1), this.gyro.z * delta);

        // Update speed according to acceleration
        var direction = new THREE.Vector3(1, 0, 0);
        direction.applyAxisAngle(new THREE.Vector3(0, 0, 1), this.rotation.z);
        this.speed.add(direction.multiplyScalar(this.acceleration * delta));

        // Update position according to speed
        this.position.add(this.speed);
    }
}

Item.prototype = Object.create(THREE.Object3D.prototype);
Item.prototype.constructor = Item;

/*************/
function Ship() {
    Item.call(this);

    this.type = "Ship";

    if (!isInNode) {
        var geometry = new THREE.PlaneGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        var cube = new THREE.Mesh(geometry, material);
        this.add(cube);
    }
}

Ship.prototype = Object.create(Item.prototype);
Ship.prototype.constructor = Ship;

/*************/
function Laser() {
    Item.call(this);
    
    this.type = "Laser";
}

Laser.prototype = Object.create(Item.prototype);
Laser.prototype.constructor = Laser;

/*************/
function Asteroid() {
    Item.call(this);

    this.type = "Asteroid";
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
    var Objects = {
        World: World,
        Ship: Ship,
        Laser: Laser,
        Asteroid: Asteroid
    };

    define(Objects);
}
