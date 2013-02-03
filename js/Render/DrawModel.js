/**
 * Created with JetBrains PhpStorm.
 * User: BIG papa
 * Date: 03.02.13
 * Time: 20:00
 * To change this template use File | Settings | File Templates.
 */
'use strict';

var DrawModel = (function( _, parentClass ){

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
    function DrawModel( object, canvas, options) {
        options = options || {};
        this.id = object.id = guidGenerator();
        this.nativeObject = object;
        this.layer = canvas;
        this.ctx =  this.layer.getContext('2d');
        //TODO пересмотреть инициализацию беферного канваса, он должен быть null, но тогда нужно переписывать draw
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
     * будем присваивать их DrawModel'ам
     * @return {string}
     */
    var guidGenerator = function() {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };

        return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
    };

    /**
     * Метод прорисовки нативного объекта
     * TODO По-хорошему использование здесь метода из нативного объекта — плохо. Нужно перейти на события, если не скажется на производительности.
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
        //TODO нужно сделать сохранение состояние объекта, а не судить только по координатам
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
    //Пишем прототип DrawModel
    DrawModel.prototype = Object.create(parentClass.prototype);//Наследуем от parentClass(GameObject)
    DrawModel.prototype.constructor = DrawModel;
    DrawModel.prototype.draw = draw;

    return DrawModel;
})( _, GameObject );