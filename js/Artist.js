/**
 * User: OgarkovMA
 * Date: 13.01.13
 * Time: 13:36
 *
 * Модуль рендера и его внутренних объектов.
 * Экспортируется только конструктор рендера.
 */
var Artist = (function( _, parentClass ){
    var STATE_IDLE = 0,
        STATE_DRAW = 1,
        defaults = {
            fps: 30
        };

    //------------------DrawObject-----------------------//

    /**
     * Конструктор вспомогательного объекта,
     * который будем хранить внутри Artist.
     * Объект должен следить за своим нативным объектом
     * и отрисовывать его при необходимости в слой,
     * указанный в конструкторе.
     *
     * Опционально для объекта моэно включить буффер.
     * @param object объект, который нужно нарисовать
     * @param canvas слой объекта
     * @param options опции
     * @constructor
     */
    function DrawObject( object, canvas, options) {
        options = options || {};
        this.id = object.id = guidGenerator();
        this.nativeObject = object;
        this.layer = canvas;
        this.ctx =  this.layer.getContext('2d');
        //@TODO пересмотреть инициализацию беферного канваса, он должен быть null, но тогда нужно переписывать draw
        this.bufferCanvas = this.layer;
        this.buffer = false;
        if ( options.buffer) {
            this.buffer = true;
            //Создаем канвас в памяти, но не добавляем в DOM.
            this.bufferCanvas = document.createElement('canvas');
            //Метка о том, что канвас буферный. Сделана для нативных объектов,
            //чтобы они знали когда рисоваться «по центру», а когда в оординатах
            this.bufferCanvas.buffer = true;
            //Изменяем канвас под размеры нативного объекта
            this.bufferCanvas.width = this.nativeObject.width;
            this.bufferCanvas.height = this.nativeObject.height;
        }
    }

    /**
     * Метод для генерации уникальнрго id,
     * будем присваивать их DrawObject'ам
     * @return {string}
     */
    var guidGenerator = function() {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };

        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };

    /**
     * Метод прорисовки нативного объекта
     * @TODO По-хорошему использование здесь метода из нативного объекта — плохо. Нужно перейти на события, если не скажется на производительности.
     * @param timeStamp
     * @return {*}
     */
    var draw = function( timeStamp ) {
        var obj = this.nativeObject,
            cv  = this.bufferCanvas,
            //Запоминаем положение объета до отрисовки для очистки этой облсти
            prevState = {
                x : obj.x,
                y : obj.y
            };

        //Вызываем draw нашего нативного объекта, он должен возвратить false, если не изменился
        //@TODO нужно сделать сохранение состояние объекта, а не судить только по координатам
        if (this.nativeObject.draw( timeStamp, prevState, cv)) {

            //Если рисовали в буфер, то нужно скопировать результат в канвас нашего слоя
            if ( this.buffer ) {
                this.ctx.clearRect(prevState.x, prevState.y, obj.width, obj.height);
                this.ctx.drawImage(
                    cv,
                    0,
                    0,
                    cv.width,
                    cv.height,
                    obj.x,
                    obj.y,
                    obj.width,
                    obj.height
                );
            }
        }
        return this;
    };
    //Пишем прототип DrawObject
    DrawObject.prototype = Object.create(parentClass.prototype);//Наследуем от parentClass(GameObject)
    DrawObject.prototype.constructor = DrawObject;
    DrawObject.prototype.draw = draw;

    //-----------------Artist-----------------------//

    /**
     * Конструктор рендера.
     * Рендерер умеет ограничивать фпс и оборачивать прорисовку
     * своих DrawObject в requestAnimationFrame
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

        //Хэш для хранения DrawObject
        this.objects = {};

        //Кол-во DrawObject для отрисовки
        this.length = 0;
    }

    /**
     * Метод для добавления DrawObject'ов в рендерер
     * Принимает объект, который нужно рисовать, слой объекта и параметры
     *
     * @param object объект для отрисовки(должен обладать методом draw)
     * @param canvas слой, в который рисовать
     * @param options параметры
     * @return {*|String|String}
     */
    var addObject = function ( object, canvas, options) {
        //Создаем новый DrawObject
        var tempObj = new DrawObject( object, canvas, options);

        //Кладем его в рендерер
        this.objects[tempObj.id] = tempObj;

        //Не забываем наращивать кол-во наших объектов
        this.length += 1;

        //Возвращаем guid объекта
        return tempObj.id;
    };

    /**
     * Основной метод рендера, отрисовывает сцену со всеми объектами
     *
     * @TODO нужно понять формат timestamp в requestAnimationFrame
     * @param timeStamp
     * @return {*}
     */
    var drawScene = function( timeStamp ) {
        var objects = this.objects;

        //Если объектов нет, то останавливаем цикл
        //рисования. Автостарта цикла пока нет
        //@TODO можно подумать нужен ли автостарт прорисовки, если появляются объекты
        if (!this.length) return this.stop();

        //проходимся по всем объектам DrawObject и заставляем их отрисовывать себя
        for (var currentObject in objects) {
            objects[currentObject].draw( timeStamp );
        }

        //Проверяем условие завершения цикла рисования
        if (!animationCondition.call(this)) {
            cancelRequestAnimationFrame();
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
})( _, GameObject );