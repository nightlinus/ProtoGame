/**
 * Created with JetBrains PhpStorm.
 * User: BIG papa
 * Date: 03.02.13
 * Time: 22:23
 * To change this template use File | Settings | File Templates.
 */
var EventMixin = function( EventController ){


    var trigger = function( eventName, options ){
        options = options || {};

        //Вызываем соответствующий метод в нашем медиаторе
        this.eventController.publish( eventName, options );
        return this;
    };

    /**
     * Метод для подписки на события
     * @param channel
     * @param fn
     * @return {*}
     */
    var subscribe = function( channel, fn) {

        //Подписываемся на событие channel в медиаторе
        this.eventController.subscribe( channel, fn, this);
        return this;
    };

    return function( object ) {
        var proto = object.prototype;
        proto.eventController = new EventController();
        proto.subscribe = proto.on = subscribe;
        proto.trigger = proto.emit = trigger;
    };
}( EventController );