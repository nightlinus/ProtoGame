/**
 * User: OgarkovMA
 * Date: 10.01.13
 * Time: 16:34
 * модуль существа
 */
var Creature = (function (_, parentClass) {
    var STATE_IDLE = 0,
        STATE_MOVE = 1,
        STATE_JUMP = 2;
    // Дефолтные параметры объекта
    var defaults = {
        'width': 10,
        'height': 10,
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
        this.direction = 1;

        this.speed = 1/10;
        //Время последней отрисовки
        this.lastDraw = null;
        this.on('key:right', function( event ){
            if (event.state == 'up') {
                self.changeState(STATE_IDLE)
                this.lastDraw = null;
            } else {
                self.changeState(STATE_MOVE)
            }
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
        this.x += (0.5 + this.direction * this.speed * dt) | 0;

        //Возвращем сам объект для реализации method chaining
        return this;
    };

    var draw = function( timeStamp, prevState, canvas) {
        switch (this.state) {
            case STATE_IDLE:
                return false;
            case STATE_MOVE:
                this.move( timeStamp);
                break;
            case STATE_JUMP:
                this.jump( timeStamp );
                break;
        }
        this.paint( prevState, canvas );
        return this.lastDraw = timeStamp;
    };

    var paint = function( prevState, canvas ){
        var ctx = canvas.getContext('2d');
        ctx.clearRect(prevState.x, prevState.y, this.width, this.height);
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        return this;
    };

    var changeState = function( state ) {
        this.state = state;
        console.log(this);
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
