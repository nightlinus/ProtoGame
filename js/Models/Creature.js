/**
 * User: OgarkovMA
 * Date: 10.01.13
 * Time: 16:34
 * модуль существа
 */
'use strict';

var Creature = (function (_, parentClass) {
    var ACTION_IDLE = 0,
        ACTION_MOVE = 1,
        ACTION_JUMP = 2,
        ACTION_SLASH = 4,
        ACTION_CROUCH = 8;

    //Направления движения
    var DIRECTION_UP = 3,
        DIRECTION_DOWN = -3,
        DIRECTION_RIGHT = 1,
        DIRECTION_LEFT = -1,
        DIRECTION_ZERO = 0;
    // Дефолтные параметры объекта
    var defaults = {
        'width': 100,
        'height': 100,
        'speed': 10,

        //Animation state
        'animationState': ACTION_IDLE,
        //Coordinates
        'x': 0,
        'y': 0
    };

    /**
     * Конструктор нашего существа
     * @param options
     * @constructor
     */
    function Creature(options) {
        var self = this;

        parentClass.call( this, options);
        //Если options не передан, присваиваем ему пустой объект
        options = options || {};

        //Расширяем options дефолтными параметрами, если их нет в options
        _.defaults(options, defaults);
        this.eventController = options.eventController;

        //Присваиваем объекту его ширину и высоту
        this.width = options.width;
        this.height = options.height;

        //Присваиваем координаты
        this.x = options.x;
        this.y = options.y;

        //Текущее состояние IDLE
        this.state = {
            action: ACTION_IDLE,
            direction: 0
        };

        //Speed in px per second
        this.speed = 100;

        //Время последней отрисовки
        this.lastDraw = null;
        this.on('move', this.stateHandler);
        this.on('jump', this.stateHandler);
    }

    /**
     * Метод для перемещения объекта в указанную координату
     * @param x
     * @return {*}
     * @param y
     */
    var traverseTo = function ( x , y ) {
        this.x = x;
        this.y = y;

        //Возвращаем сам объект, для образования цепочек: creature.traverseTo(10).move(20).move(10)
        return this;
    };

    /**
     * Метод для расчета координаты спустя deltaTime с последней анимации
     * @return {*}
     * @param timeStamp
     */
    var move = function ( timeStamp ) {
        var dt = timeStamp - (this.lastDraw || timeStamp);
        this.x += (this.state.direction * this.speed * dt / 1000) | 0;

        //Возвращем сам объект для реализации method chaining
        return this;
    };

    /**
     * Метод прорисовки в зависимости от состояния
     * @param timeStamp
     * @param prevState
     * @param canvas
     * @return {*}
     */
    var draw = function( timeStamp, prevState, canvas) {
        var currAction = this.state.action;
        if (currAction == ACTION_IDLE && this.lastDraw != null) {
            this.lastDraw = timeStamp;
            return false;
        }
        if (currAction & ACTION_MOVE) this.move( timeStamp );
        this.paint( prevState, canvas );
        return this.lastDraw = timeStamp;
    };

    /**
     * Метод для отрисовки своего состояния
     * @param prevState
     * @param canvas
     * @return {*}
     */
    var paint = function( prevState, canvas ){
        var ctx = canvas.getContext('2d'),
            buffer = canvas.buffer || false,
            self = this,
            state = buffer ? {x: 0, y: 0} :{ x: self.x, y: self.y  };
        //Чистим прошлый кадр
        ctx.clearRect(prevState.x, prevState.y, this.width, this.height);
        //Рисуем заново
        ctx.save();
        ctx.fillStyle = '#000';
        ctx.fillRect(state.x, state.y, this.width, this.height);
        ctx.restore();
        ctx.closePath();
        return this;
    };

    /**
     * Метод для изменения состояния объекта.
     * TODO возможно в будущем нужно убрать, если не обрастет большим функционалом
     * @return {*}
     * @param action
     */
    var changeState = function( action ) {
        this.state.action = action;
        if (action == ACTION_IDLE) this.state.direction = 0;
        return this;
    };

    var stateHandler = function( event ) {
        if (event.state == 'off') {
            this.state.direction -= event.direction;
        } else {
            this.state.direction += event.direction;
        }
        if (!this.state.direction) {
            this.changeState(ACTION_IDLE);
            this.lastDraw = null;
            return;
        }
        switch (this.state.direction) {
            case DIRECTION_ZERO:
                this.changeState(ACTION_IDLE);
                this.lastDraw = null;
                break;
            case DIRECTION_RIGHT:
            case DIRECTION_LEFT:
                this.changeState(ACTION_MOVE);
                break;
            case DIRECTION_UP:
                this.changeState(ACTION_JUMP);
                break;
        }
    };

    //Заполняем прототип
    Creature.prototype = Object.create(parentClass.prototype);
    Creature.prototype.constructor = Creature;
    Creature.prototype.traverseTo = traverseTo;
    Creature.prototype.move = move;
    Creature.prototype.draw = draw;
    Creature.prototype.paint = paint;
    Creature.prototype.changeState = changeState;
    Creature.prototype.stateHandler = stateHandler;

    //Возвращаем наш конструктор существа
    return Creature;
})( _, GameObject ); //Выполняем наш модуль и передаем в него _ (конструктор lodash)
