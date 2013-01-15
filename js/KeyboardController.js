/**
 * User: OgarkovMA
 * Date: 12.01.13
 * Time: 15:50
 * Модуль для организации управления
 * @TODO нужно сделать объект singleton'ом
 */
var KeyboardController = (function ( _ , host, parentClass ) {
    var defaults = {
        'eventController': host.eventController,
        //Через конфиг задаем список событий и соответствующие параметры,
        //а так же коды клавиш
        //@TODO возможно понадобится механизм для назначение клавиш в рантайме, его нет
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

    /**
     * Создаем наш контроллер клавиатуры
     * @param options
     * @constructor
     */
    function KeyboardController( options ) {
        options = options || {};
        _.defaults(options, defaults);

        //Храним ссылку на медиатор, для поддержки собственных событий
        this.eventController = options.eventController;
        this.events = options.events;
        this.pressed = {};

        //Сразу же начинаем слушать клавиатуру
        this.hook();
    }

    /**
     * Метод для начала прослушки нужных событий
     * @return {*}
     */
    var hook = function(){

        //Привязываем коллбэки к контексту контроллера навсегда.
        handleDown = handleDown.bind(this);
        handleUp = handleUp.bind(this);

        //Вешаем прослушку на клавиатуру
        host.addEventListener('keydown', handleDown);
        host.addEventListener('keyup', handleUp);
        return this;
    };

    /**
     * Метод для обработки нажатия клавиши
     * @param event нативное событие
     * @return {*}
     */
    var handleDown = function( event ){
        //Если ключ в хэш таблице int, браузер может применять различные сортировки и прочую шляпу
        //Поэтому делаем ключ в хэше string'ом
        var key = '$' + event.keyCode,
            options = {};

        //Если уже нажата кнопка или в конфиге нет события для этой кнопки, то ничего не делаем
        if (this.pressed[key] || !this.events[key]) return this;

        //Создаем свой wrapper-объект событие для передачи конечным объектам
        options.nativeEvent = event;

        //Индикатор того, что кнопка нажата
        options.state = 'on';

        //Абстргируемся от конкретных кнопок — переходим к направлениям
        options.direction = this.events[key].direction;

        //Если не нажата, то добавляем в массив нажатых
        this.pressed[key] = event.timeStamp;

        //Вызываем событие в соответствии с конфигом
        return this.trigger(this.events[key].event, options);
    };

    /**
     * Метод для обработки отпускания клавиши
     * @param event нативное событие
     * @return {*}
     */
    var handleUp = function( event ){
        var key = '$' + event.keyCode,
            options = {};

        //Если в конфиге нет события для этой кнопки, то ничего не делаем
        if (!this.events[key]) return this;

        //Создаем свой wrapper-объект событие для передачи конечным объектам
        options.nativeEvent = event;

        //Индикатор того, что кнопка отжата
        options.state = 'off';

        //Абстргируемся от конкретных кнопок — переходим к направлениям
        options.direction = this.events[key].direction;

        //Не забываем почистить хэш с нажатыми кнопками. Можно попробовать через delete.
        this.pressed[key] = null;

        //Вызываем событие в соответствии с конфигом
        return this.trigger(this.events[key].event, options);
    };

    //Заполняем прототип
    KeyboardController.prototype = Object.create(parentClass.prototype);
    KeyboardController.prototype.constructor = KeyboardController;
    KeyboardController.prototype.hook = hook;

    //Возвращаем конструктор класса
    return KeyboardController;
})( _ , window, GameObject );