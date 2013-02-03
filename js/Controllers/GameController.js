/**
 * Created within ProtoGame.
 * User: OgarkovMA
 * Date: 16.01.13
 * Time: 15:48
 * Пока нигде не используется, надо думать над модулем.
 */
var GameController = (function ( _ ) {
    var defaults = {
        phys: true,
        draw: true
    };


    function GameController( options ) {
        options = options || {};
        this.canvas = options.canvas;
        this.mediator = new EventController();
        this.control = new KeyboardController();
        this.artist = new Artist( options );
        this.phys = new PhysEngine();
        this.objects = [];
    }

    var addObject = function ( object, options ) {
        _.defaults(options, defaults);
        var go = new GameObject( object, options );
        if (options.phys) go.physModel = this.phys.addObject( go.stateObject, options );
        if (options.draw) go.drawModel = this.artist.addObject(go.stateObject, options );
        this.objects.push(go);
        return this;
    };

    var addObjects = function ( object, options, count ) {
        for (var i = 0; i < count; i++) {
            addObject(object, options);
        }
        return this;
    };

    var start = function(){
        this.artist.start();
    };

    GameController.prototype = {
        constructor: GameController,
        addObject: addObject,
        addObjects: addObjects,
        start: start
    };

    return GameController;
})( _ );