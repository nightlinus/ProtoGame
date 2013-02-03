/**
 * Created within ProtoGame.
 * User: OgarkovMA
 * Date: 16.01.13
 * Time: 13:26
 *
 */
'use strict';

var PhysEngine = (function ( _, parentClass, PhysModel ) {

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
            len = collection.length,
            model;
        for (var i = len; i > -1; i-- ) {
            model = collection[i];
            if (model.destroy()) {
                collection.slice(i, 1);
                i++;
                continue;
            }
            model.applyForces()
                 .move( dt )
                 .checkColisions( collection, i);
        }
    };


    PhysEngine.prototype = Object.create(parentClass.prototype);
    PhysEngine.prototype.constructor = PhysEngine;
    PhysEngine.prototype.addObject = addObject;
    PhysEngine.prototype.removeObject = removeObject;
    PhysEngine.prototype.process = process;

    return PhysEngine;
})( _, GameObject, PhysModel );