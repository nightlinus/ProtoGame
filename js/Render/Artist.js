/**
 * User: OgarkovMA
 * Date: 13.01.13
 * Time: 13:36
 *
 * Модуль рендера и его внутренних объектов.
 * Экспортируется только конструктор рендера.
 */
'use strict';

var Artist = (function( _, parentClass, DrawModel ){
    var STATE_IDLE = 0,
        STATE_DRAW = 1,
        defaults = {
            fps: 30
        };

    /**
     * Конструктор рендера.
     * Рендерер умеет ограничивать фпс и оборачивать прорисовку
     * своих DrawModel в requestAnimationFrame
     * @param options
     * @constructor
     */
    function Artist( options ) {
        options = options || {};
        _.defaults(options, defaults);

        //Основной канвас для рисования
        this.canvas = options.canvas;
        this.ctx = options.canvas.getContext('2d');
        this.maxWidth = options.canvas.width;
        this.maxHeight = options.canvas.height;

        //Объект может ограничивать фпс
        this.fps = options.fps;

        //Состояние рендерера(пока не особо используется)
        this.state = STATE_IDLE;

        //Хэш для хранения DrawModel
        this.drawModels = {};

        //Кол-во DrawModel для отрисовки
        this.length = 0;
    }

    /**
     * Метод для добавления DrawModel'ов в рендерер
     * Принимает объект, который нужно рисовать, слой объекта и параметры
     *
     * @param object объект для отрисовки(должен обладать методом draw)
     * @param canvas слой, в который рисовать
     * @param options параметры
     * @return {*|String|String}
     */
    var addObject = function ( object, canvas, options) {
        //Создаем новый DrawModel
        var tempObj = new DrawModel( object, canvas, options);

        //Кладем его в рендерер
        this.drawModels[tempObj.id] = tempObj;

        //Не забываем наращивать кол-во наших объектов
        this.length += 1;

        //Возвращаем guid объекта
        return tempObj.id;
    };

    /**
     * Основной метод рендера, отрисовывает сцену со всеми объектами
     *
     * TODO нужно понять формат timestamp в requestAnimationFrame
     * @param timeStamp
     * @return {*}
     */
    var drawScene = function( timeStamp ) {
        var objects = this.drawModels;

        //Если объектов нет, то останавливаем цикл
        //рисования. Автостарта цикла пока нет
        //TODO можно подумать нужен ли автостарт прорисовки, если появляются объекты
        if (!this.length) return this.stop();

        //проходимся по всем объектам DrawModel и заставляем их отрисовывать себя
        for (var currentObject in objects) {
            objects[currentObject].draw( timeStamp );
        }

        //Проверяем условие завершения цикла рисования
        if (!animationCondition.call(this)) {
            cancelRequestAnimationFrame(null);
            return this;
        }

        //Если всё хорошо, то запрашиваем отрисовку следуещего кадра
        requestAnimationFrame( this.drawScene, this.canvas );

        //Возвращаем ссылку на себя.
        return this;
    };

    /**
     * Функция для определения условия остановки прорисовки
     * Не экспортируется, доступна только в модуле.
     * @return {boolean}
     */
    var animationCondition = function() {
        var result = true;

        //Проверяем состояние рендера
        switch (this.state) {
            case STATE_IDLE:
                result = false;
                break;
            case STATE_DRAW:
                result = true;
                break;
        }
        return result;
    };

    /**
     * Метод начинает цикл рисования и
     * выставляет фпс согласно конфигу.
     * @return {*}
     */
    var start = function() {
        //Ставим состояние рендера в режим рисования
        this.state = STATE_DRAW;

        //Здесь мы из throttle возвращаем функцию-обертку, которая вызывается не чаще чем раз в n милисекунд
        //где n — второй аргумент throttle. Bind привязывает функцию к контексту this навсегда(внутри
        // requestAnimationFrame наш коллбэк вызывается в контексте хост-объекта(window)).
        this.drawScene = _.throttle( this.drawScene, (0.5 + 1000 / this.fps) | 0).bind(this);

        //Запускаем цикл рисования
        requestAnimationFrame(this.drawScene, this.canvas);
        return this;
    };

    /**
     * Метод для остановки цикла рисования
     * @return {*}
     */
    var stop = function(){
        this.state = STATE_IDLE;
        return this;
    };

    //Наследуем прототип от родительского класса
    Artist.prototype = Object.create(parentClass.prototype);

    //Пишем правильный конструктор в прототип
    Artist.prototype.constructor = Artist;

    //Заполняем прототип методами
    Artist.prototype.drawScene = drawScene;
    Artist.prototype.addObject = addObject;
    Artist.prototype.start = start;
    Artist.prototype.stop = stop;

    //Возвращаем конструктор рендера.
    return Artist;
})( _, GameObject, DrawModel );