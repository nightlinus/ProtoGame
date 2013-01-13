/**
 * Created with JetBrains PhpStorm.
 * User: BIG papa
 * Date: 12.01.13
 * Time: 15:50
 * To change this template use File | Settings | File Templates.
 */
var KeyboardController = (function ( _ , host ) {
    var defaults = {
        'eventController': host.eventController,
        'events': {
            '$37': 'key:left',
            '$38': 'key:up',
            '$39': 'key:right',
            '$40': 'key:down',
            '$32': 'key:space'
        }
    };
    function KeyboardController( options ) {
        options = options || {};
        _.defaults(options, defaults);
        this.eventController = options.eventController;
        this.events = options.events;
        this.pressed = {};
        this.hook();
    }

    var hook = function(){
        handleDown = handleDown.bind(this);
        handleUp = handleUp.bind(this);
        host.addEventListener('keydown', handleDown);
        host.addEventListener('keyup', handleUp);
    };

    var handleDown = function( event ){
        var key = '$' + event.keyCode;

        //Если уже нажата кнопка, то ничего не делаем
        if (this.pressed[key] || !this.events[key]) return this;

        //Если не нажата, то добавляем в массив нажатых
        this.pressed[key] = event.timeStamp;

        //Вызываем событие в соответствии с конфигом
        return this.trigger(this.events[key], {'state':'down'});
    };

    var handleUp = function( event ){
        var key = '$' + event.keyCode;
        if (!this.events[key]) return this;
        this.pressed[key] = null;
        return this.trigger(this.events[key], {'state':'up'});
    };

    var trigger = function( eventName, options ){
        options = options || {};
        console.log(eventName, options.state);
        this.eventController.publish( eventName, options );
        return this;
    };


    //Заполняем прототип
    KeyboardController.prototype = {
        constructor: KeyboardController,
        hook: hook,
        trigger: trigger
    };

    //Возвращаем конструктор класса
    return KeyboardController;
})( _ , window );