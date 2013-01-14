/**
 * Created with JetBrains PhpStorm.
 * User: BIG papa
 * Date: 13.01.13
 * Time: 19:36
 * To change this template use File | Settings | File Templates.
 */
var GameObject = (function ( _ , host) {
    var defaults = {
        eventController: host.eventController
    };
    function GameObject(options) {
        //Если options не передан, присваиваем ему пустой объект
        options = options || {};
        //Расширяем options дефолтными параметрами, если их нет в options
        _.defaults(options, defaults);
        this.eventController = options.eventController;
    }

    var trigger = function( eventName, options ){
        options = options || {};
        this.eventController.publish( eventName, options );
        return this;
    };

    var subscribe = function( channel, fn) {
        this.eventController.subscribe( channel, fn, this);
        return this;
    };

    //Заполняем прототип
    GameObject.prototype = {
        constructor: GameObject,
        trigger: trigger,
        subscribe: subscribe,
        on: subscribe,
        DIRECTION_UP: 3,
        DIRECTION_DOWN: -3,
        DIRECTION_RIGHT: 1,
        DIRECTION_LEFT: -1,
        DIRECTION_ZERO: 0
    };

    //Возвращаем наш конструктор существа
    return GameObject;
})( _, window); //Выполняем наш модуль и передаем в него _ (конструктор lodash)
