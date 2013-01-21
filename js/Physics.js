/**
 * Created within ProtoGame.
 * User: OgarkovMA
 * Date: 16.01.13
 * Time: 13:26
 *
 */
'use strict';

var PhysEngine = (function ( _, parentClass ) {

//**************************PhysEngine*********************************//

    function PhysEngine(){
        this.physModels = [];
        this.world = null;
    }

    var addObject = function( object, options){
        this.physModels.push(new PhysModel(object, options));
        return this;
    };

    var removeObject = function( id ){
        var collection = this.physModels,
            i;
        for ( i = collection.length; i > -1; i--) {
            if (collection[i].id == id) {
                collection.splice( i, 1 );
                return true;
            }
        }
        return false;
    };

    var process = function( dt ){
        var collection = this.physModels,
            len = collection.length;
        for (var i = 0; i < len; i++ ) {

        }
    };


    PhysEngine.prototype = Object.create(parentClass.prototype);
    PhysEngine.prototype.constructor = PhysEngine;
    PhysEngine.prototype.addObject = addObject;
    PhysEngine.prototype.removeObject = removeObject;



//**************************PhysModel*********************************//


    function PhysModel( object, options ){
        this.id = object.id;
        this.nativeObject = object;
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
        var firstPoint, secondPoint, thirdPoint, fourthPoint, xMin, yMin;
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

    PhysModel.prototype = Object.create( parentClass.prototype );
    PhysModel.prototype.constructor = PhysModel;
    PhysModel.prototype.surroundingRect = surroundingRect;
    PhysModel.prototype.fastCollisionDetect = fastCollisionDetect;

    
    
    
    return PhysEngine;
})( _, GameObject );