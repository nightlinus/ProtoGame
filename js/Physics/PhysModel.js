/**
 * Created within ProtoGame.
 * User: OgarkovMA
 * Date: 03.02.13
 * Time: 19:59
 *
 */
'use strict';

var PhysModel = (function ( _, parentClass ) {

    var PHYS_DELTA = 0.02,
        g = 10;

    function PhysModel( object, options ){
        var self = this;
        this.id = object.id;
        this.stateObject = object;
        this.onCollision = object.onCollision || null;
        Object.defineProperty(this, 'speed', {
            get: function() {
                return self.stateObject.speed;
            },
            set: function( newValue ) {
                return self.stateObject.speed = newValue;
            }
        });
    }

    var fastCollisionDetect = function( obj1, obj2 ) {
        return (
            (obj2.x >= obj1.x && obj2.x <= obj1.x + obj1.width)
                ||
                (obj2.x + obj2.width >= obj1.x && obj2.x + obj2.width <= obj1.x + obj1.width)
            )
            &&
            (
                (obj2.y >= obj1.y && obj2.y <= obj1.y + obj1.height)
                    ||
                    (obj2.y + obj2.height >= obj1.y && obj2.y + obj2.height <= obj1.y + obj1.height)
                );
    };

    var preciseCollisionDetect = function( obj1, obj2 ) {
        return true;
    };

    var rotateCoordinates = function( sourceX, sourceY, angle ) {
        if (!angle) return {
            x: sourceX,
            y: sourceY
        };
        return {
            x : sourceX*Math.cos( angle ) - sourceY*Math.sin( angle ),
            y : sourceX*Math.sin( angle ) + sourceY*Math.cos( angle )
        };
    };

    var surroundingRect = function(){
        if (!this.angle) return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
        var firstPoint,
            secondPoint,
            thirdPoint,
            fourthPoint,
            xMin,
            yMin;

        firstPoint = rotateCoordinates(this.x, this.y, this.angle);
        secondPoint = rotateCoordinates(this.x+this.width, this.y, this.angle);
        fourthPoint = rotateCoordinates(this.x+this.width, this.y+this.height, this.angle);
        thirdPoint = rotateCoordinates(this.x, this.y+this.height, this.angle);
        xMin = Math.min(firstPoint.x, secondPoint.x, thirdPoint.x, fourthPoint.x);
        yMin = Math.min(firstPoint.y, secondPoint.y, thirdPoint.y, fourthPoint.y);

        return {
            x: xMin,
            y: yMin,
            width: Math.max(firstPoint.x, secondPoint.x, thirdPoint.x, fourthPoint.x) - xMin,
            height: Math.max(firstPoint.y, secondPoint.y, thirdPoint.y, fourthPoint.y) - yMin
        };
    };

    var hasCollision = function( direction ) {
        if (!this.collisions[direction]) {
            return false;
        }
        return true;
    };

    var applyForces = function() {
        if (!this.hasCollision('down')) {
            this.speed.y = this.speed.y - g*PHYS_DELTA;
        }
        return this;
    };

    var move = function( time ){
        this.x = this.speed.x*time;
        this.y = this.speed.y*time;
        return this;
    };

    var checkCollisions = function( collection, selfNumber){
        var objects = collection.slice(selfNumber, 1),
            len = objects.length;
        for (var i = len; i > -1; i--) {
            if  (this.detectCollision(objects[i])) {
                this.onCollision();
                objects[i].onCollision();
            }
        }
        return this;
    };

    var detectCollision = function( object ) {
        if (!fastCollisionDetect(this, object)) {
            return false;
        }
        return preciseCollisionDetect(this, object);
    };


    PhysModel.prototype = Object.create( parentClass.prototype );
    PhysModel.prototype.constructor = PhysModel;
    PhysModel.prototype.surroundingRect = surroundingRect;
    PhysModel.prototype.fastCollisionDetect = fastCollisionDetect;
    PhysModel.prototype.applyForces = applyForces;
    PhysModel.prototype.move = move;
    PhysModel.prototype.checkCollisions = checkCollisions;
    PhysModel.prototype.detectCollision = detectCollision;



    return PhysModel;
})( _, GameObject );