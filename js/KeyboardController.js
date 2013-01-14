/**
 * Created with JetBrains PhpStorm.
 * User: BIG papa
 * Date: 12.01.13
 * Time: 15:50
 * To change this template use File | Settings | File Templates.
 */
var KeyboardController = (function ( _ , host, parentClass ) {
    var defaults = {
        'eventController': host.eventController,
        'events': {
            '$37': {
                event : 'move',
                direction: -1
            },
            '$38': {
                event: 'jump',
                direction: 3
            },
            '$39': {
                event: 'move',
                direction: 1
            },
            '$40': {
                event: 'crouch',
                direction: -3
            },
            '$32': {
                event: 'hit',
                direction: 0
            }
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
        var key = '$' + event.keyCode,
            options = {};

        //Если уже нажата кнопка, то ничего не делаем
        if (this.pressed[key] || !this.events[key]) return this;
        options.nativeEvent = event;
        options.state = 'on';
        options.direction = this.events[key].direction;
        //Если не нажата, то добавляем в массив нажатых
        this.pressed[key] = event.timeStamp;

        //Вызываем событие в соответствии с конфигом
        return this.trigger(this.events[key].event, options);
    };

    var handleUp = function( event ){
        var key = '$' + event.keyCode,
            options = {};
        if (!this.events[key]) return this;
        options.nativeEvent = event;
        options.state = 'off';
        options.direction = this.events[key].direction;
        this.pressed[key] = null;
        return this.trigger(this.events[key].event, options);
    };

    //Заполняем прототип
    KeyboardController.prototype = Object.create(parentClass.prototype);
    KeyboardController.prototype.constructor = KeyboardController;
    KeyboardController.prototype.hook = hook;

    //Возвращаем конструктор класса
    return KeyboardController;
})( _ , window, GameObject );