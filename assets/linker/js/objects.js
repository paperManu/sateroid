if (typeof window === 'undefined') {
    var THREE = require("three");
    var isInNode = true;
}
else {
    var isInNode = false;
}

var SPACE_SIZE = 10;
var SPACE_VISIBLE = true;
var MAX_ASTEROID = 5;

/*************/
function World() {
    THREE.Object3D.call(this);

    this.type = "World";

    // Private members
    var lastTick = (new Date).valueOf();
    var sockets = [];

    if (SPACE_VISIBLE) {
        var geometry = new THREE.CircleGeometry(SPACE_SIZE, 64, 0);
        var material = new THREE.MeshBasicMaterial({color: 0x0000aa});
        var space = new THREE.Mesh(geometry, material);
        space.position.z = -1;
        space.name = "Space";
        this.add(space);
    }

    var asteroidNumber = 0;

    /*********/
    var computeCollisions = function() {
    }

    /*********/
    this.addObject = function(object) {
        if (object.type === undefined)
            return;

        this.add(object);
        if (isInNode) {
            for (var socket in sockets) {
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
    this.removeObject = function(object) {
        if (object.type === undefined)
            return;

        this.remove(object);
        if (object.type == "Asteroid")
            asteroidNumber--;

        if (isInNode) {
            for (var socket in sockets) {
                sockets[socket].emit("removeObject", [object.type, object.name]);
            }
        }
    }

    /*********/
    this.setState = function(state) {
        if (typeof state != typeof [])
            return;

        for (var item in state) {
            for (var i in this.children)
                if (this.children[i].name == state[item].name)
                    var child = this.children[i];
            if (child === undefined || child.name == "Space")
                continue;

            child.position.set(state[item].position.x, state[item].position.y, state[item].position.z);
            child.rotation.set(state[item].rotation.x, state[item].rotation.y, state[item].rotation.z);
            child.setVisible();
        }
    }

    /*********/
    this.update = function() {
        var currentTick = (new Date).valueOf();
        var delta = (currentTick - lastTick) * 0.001;
        if (delta == 0)
            return;

        lastTick = currentTick;

        // Update objects in space
        for (var i in this.children) {
            if (this.children[i].name == "Space")
                continue;
            this.children[i].update(delta);
            if (this.children[i].life == 0) {
                this.removeObject(this.children[i]);
            }
        }

        // Add randomly an asteroid
        if (Math.random() > 0.999 && asteroidNumber < MAX_ASTEROID) {
            var asteroid = new Asteroid();
            asteroid.name = "Asteroid" + Math.floor(Math.random() * 1e6);
            asteroid.position.set((Math.random() * 2.0 - 1.0) * SPACE_SIZE / 2.0, (Math.random() * 2.0 - 1.0) * SPACE_SIZE / 2.0, 0);
            this.addObject(asteroid);
            asteroidNumber++;
        }
    }
}

World.prototype = Object.create(THREE.Object3D.prototype);
World.prototype.constructor = World;

/*************/
function Item() {
    THREE.Object3D.call(this);

    this.type = "Item";
    this.infinite = true;
    this.direction = new THREE.Vector3(1, 0, 0);
    this.speed = new THREE.Vector3(0, 0, 0);
    this.acceleration = 0.0;
    this.gyro = new THREE.Vector3(0, 0, 0);
    this.life = 1;
    this.maxSpeed = 0.01;

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
    this.setVisible = function() {
        for (var i in this.children) {
            this.children[i].visible = true;
        }
    }

    /*********/
    this.update = function(delta) {
        //console.log(this.type, this.acceleration, this.speed.length());
        // Update orientation
        this.rotateOnAxis(new THREE.Vector3(0, 0, 1), this.gyro.z * delta);

        // Update speed according to acceleration
        var direction = new THREE.Vector3(1, 0, 0);
        direction.applyAxisAngle(new THREE.Vector3(0, 0, 1), this.rotation.z);
        this.speed.add(direction.multiplyScalar(this.acceleration * delta));

        // Limit the maximum speed
        if (this.speed.length() > this.maxSpeed)
            this.speed.setLength(this.maxSpeed);

        // Update position according to speed
        this.position.add(this.speed);

        // Check if we went too far, then come back on the other side
        if (this.position.length() > SPACE_SIZE)
            if (this.infinite)
                this.position.negate();
            else
                this.life = 0;
    }
}

Item.prototype = Object.create(THREE.Object3D.prototype);
Item.prototype.constructor = Item;

/*************/
function Ship() {
    Item.call(this);

    this.type = "Ship";

    if (!isInNode) {
        var geometry = new THREE.PlaneGeometry(1, 1);
        var material = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture('images/ship.png', new THREE.CubeReflectionMapping)});
        material.transparent = true;
        var mesh = new THREE.Mesh(geometry, material);
        mesh.visible = false;
        this.add(mesh);
    }

    /*********/
    this.fire = function() {
        var world = this.parent;
        var laser = new Laser();
        laser.setDirection(this.rotation, this.position);
        laser.name = this.name + Math.floor(Math.random() * 1e6);
        world.addObject(laser);
    }
}

Ship.prototype = Object.create(Item.prototype);
Ship.prototype.constructor = Ship;

/*************/
function Laser() {
    Item.call(this);
    
    this.type = "Laser";
    this.infinite = false;
    this.maxSpeed = 0.01;
    this.acceleration = 100;

    if (!isInNode) {
        var geometry = new THREE.PlaneGeometry(0.1, 0.1);
        var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        var mesh = new THREE.Mesh(geometry, material);
        mesh.visible = false;
        this.add(mesh);
    }

    this.setDirection = function(direction, position) {
        this.rotation = direction.clone();
        this.position = position.clone();
    }
}

Laser.prototype = Object.create(Item.prototype);
Laser.prototype.constructor = Laser;

/*************/
function Asteroid() {
    Item.call(this);

    this.type = "Asteroid";
    this.maxSpeed = 0.001;
    this.gyro.z = (Math.random() * 2.0 - 1.0) * 0.1;

    var direction = new THREE.Vector3(1, 0, 0);
    direction.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.random() * 2 * Math.PI);
    this.speed.add(direction.multiplyScalar(Math.random() * this.maxSpeed));

    if (!isInNode) {
        var geometry = new THREE.PlaneGeometry(2, 1);
        var material = new THREE.MeshBasicMaterial({color: 0xaa0000});
        var mesh = new THREE.Mesh(geometry, material);
        mesh.visible = false;
        this.add(mesh);
    }
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
