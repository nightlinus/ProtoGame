/**
 * User: OgarkovMA
 * Date: 10.01.13
 * Time: 16:34
 * модуль существа
 */
var Creature = (function( _ ){
    // Дефолтные параметры объекта
    var defaults = {
        'width': 10,
        'height': 10,
        'speed': 10,

        //Coordinates
        'x': 0,
        'y': 0
    };

    /**
     * Конструктор нашего существа
     * @param options
     * @constructor
     */
    function Creature( options ){
        //Если options не передан, присваиваем ему пустой объект
        options = options || {};

        //Расширяем options дефолтными параметрами, если их нет в options
        _.extend(options, defaults);

        // Присваиваем объекту его ширину и высоту
        this.width = options.width;
        this.height = options.height;

        // Присваиваем координаты
        this.x = options.x;
        this.y = options.y;
    }

    /**
     * Метод для перемещения объекта в указанную координату
     * @param x
     * @return {*}
     */
    var traverseTo = function(x){
        this.x = x;

        //Возвращаем сам объект, для образования цепочек: creature.traverseTo(10).move(20).move(10)
        return this;
    };

    /**
     * Метод для расчета координаты спустя deltaTime с последней анимации
     * @param deltaTime
     * @return {*}
     */
    var move = function(deltaTime){
        this.x += this.speed*deltaTime;

        //Возвращем сам объект для реализации method chaining
        return this;
    };

    //Пишем в прототип правильный конструктор
    Creature.prototype.constructor = Creature;

    // Пишем функционал в прототип
    Creature.prototype.traverseTo = traverseTo;
    Creature.prototype.move = move;

    // Возвращаем наш конструктор существа
    return Creature;
})( _ ); // Выполняем наш модуль и передаем в него _ (конструктор lodash)
