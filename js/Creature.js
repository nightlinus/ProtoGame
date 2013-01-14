/**
 * User: OgarkovMA
 * Date: 10.01.13
 * Time: 16:34
 * модуль существа
 */
var Creature = (function (_, parentClass) {
    var STATE_IDLE = 0,
        STATE_MOVE = 1;

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
        'animationState': STATE_IDLE,
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

        //Присваиваем состояние анимации
        this.animationState = options.animationState;

        //Присваиваем координаты
        this.x = options.x;
        this.y = options.y;

        //Направоение по умолчанию: вперед
        this.direction = 0;


        //Speed in px per second
        this.speed = 100;
        //Время последней отрисовки
        this.lastDraw = null;
        this.on('move', function( event ){
            if (event.state == 'off') {
                self.direction -= event.direction;
            } else {
                self.direction += event.direction;
            }
            if (!self.direction) {
                self.changeState(STATE_IDLE);
                this.lastDraw = null;
                return;
            }
            self.changeState(STATE_MOVE);
        });
    }

    /**
     * Метод для перемещения объекта в указанную координату
     * @param x
     * @return {*}
     */
    var traverseTo = function (x) {
        this.x = x;

        //Возвращаем сам объект, для образования цепочек: creature.traverseTo(10).move(20).move(10)
        return this;
    };

    /**
     * Метод для расчета координаты спустя deltaTime с последней анимации
     * @return {*}
     * @param timeStamp
     */
    var move = function (timeStamp) {
        var dt = timeStamp - (this.lastDraw || timeStamp);
        this.animationState += STATE_MOVE;
        this.x += (this.direction * this.speed * dt / 1000) | 0;

        //Возвращем сам объект для реализации method chaining
        return this;
    };

    var draw = function( timeStamp, prevState, canvas) {
        switch (this.state) {
            case STATE_IDLE:
                return false;
            case STATE_MOVE:
                this.move( timeStamp );
                break;
        }
        this.paint( prevState, canvas );
        return this.lastDraw = timeStamp;
    };

    var paint = function( prevState, canvas ){
        var ctx = canvas.getContext('2d'),
            buffer = canvas.buffer || false,
            self = this,
            state = buffer ? {x: 0, y: 0} :{ x: self.x, y: self.y  };
        //Чистим прошлый кадр
        ctx.clearRect(prevState.x, prevState.y, this.width, this.height);
        //Рисуем заново
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.save();
        ctx.translate(state.x + this.width / 2, state.y + this.height / 2);
        ctx.arc(0, 0, this.width/2, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.restore();
        ctx.closePath();
        return this;
    };

    var changeState = function( state, direction ) {
        this.state = state;
        return this;
    };

    //Заполняем прототип
    Creature.prototype = Object.create(parentClass.prototype);
    Creature.prototype.constructor = Creature;
    Creature.prototype.traverseTo = traverseTo;
    Creature.prototype.move = move;
    Creature.prototype.draw = draw;
    Creature.prototype.paint = paint;
    Creature.prototype.changeState = changeState;

    //Возвращаем наш конструктор существа
    return Creature;
})( _, GameObject ); //Выполняем наш модуль и передаем в него _ (конструктор lodash)
