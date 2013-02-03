/**
 * Created within ProtoGame.
 * User: OgarkovMA
 * Date: 16.01.13
 * Time: 15:48
 * Пока нигде не используется, надо думать над модулем.
 */
var GameController = (function ( _ ) {
    function GameController( options ) {
        options = options || {};
        this.canvas = options.canvas;
        this.mediator = new EventController();
        this.control = new KeyboardController();
        this.artist = new Artist();
        this.phys = new PhysEngine();
    }

    var addGameObject = function ( object, options ) {
        return this;
    };

    var addGameObjects = function ( object, options, count ) {
        for (var i = 0; i < count; i++) {
            addGameObject(object, options);
        }
        return this;
    };

    GameController.prototype = {
        constructor: GameController,
        addGameObject: addGameObject,
        addGameObjects: addGameObjects
    };

    return GameController;
})( _ );