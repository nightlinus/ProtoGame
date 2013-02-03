/**
 * User: OgarkovMA
 * Date: 13.01.13
 * Time: 19:36
 * Модуль игрового объекта
 */
'use strict';

var GameObject = (function ( _ , Mixin) {

    /**
     * Конструктор GameObject
     * @param options
     * @constructor
     */
    function GameObject( object, options) {
        //Если options не передан, присваиваем ему пустой объект
        options = options || {};
        this.id = options.id = guidGenerator();
        this.stateObject = new object(options);
        this.physObject = null;
        this.drawObject = null;
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

        return S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4();
    };


    //Заполняем прототип
    GameObject.prototype = {
        constructor: GameObject
    };

    Mixin( GameObject );

    //Возвращаем наш конструктор существа
    return GameObject;
})( _, EventMixin); //Выполняем наш модуль и передаем в него _ (конструктор lodash)
