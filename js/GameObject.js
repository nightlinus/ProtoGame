/**
 * User: OgarkovMA
 * Date: 13.01.13
 * Time: 19:36
 * Модуль исходного игрового объекта
 * @TODO Возможно лучше оформить в виде mixin
 */
var GameObject = (function ( _ , host) {
    var defaults = {
        eventController: host.eventController
    };

    /**
     * Конструктор GameObject
     * @param options
     * @constructor
     */
    function GameObject(options) {
        //Если options не передан, присваиваем ему пустой объект
        options = options || {};
        //Расширяем options дефолтными параметрами, если их нет в options
        _.defaults(options, defaults);

        // Храним в себе медиатор для подписки/уведомления о событиях
        this.eventController = options.eventController;
    }

    /**
     * Метод для вызова события с именем eventName
     * @param eventName
     * @param options
     * @return {*}
     */
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

    //Заполняем прототип
    GameObject.prototype = {
        constructor: GameObject,
        trigger: trigger,
        subscribe: subscribe,
        on: subscribe,
        //Константы направления, не очень хорошо их здесь хранить т.к.
        //они уже есть в контролере управления
        //@TODO подумать где хранить эти константы
        DIRECTION_UP: 3,
        DIRECTION_DOWN: -3,
        DIRECTION_RIGHT: 1,
        DIRECTION_LEFT: -1,
        DIRECTION_ZERO: 0
    };

    //Возвращаем наш конструктор существа
    return GameObject;
})( _, window); //Выполняем наш модуль и передаем в него _ (конструктор lodash)
