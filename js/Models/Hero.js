/**
 * User: OgarkovMA
 * Date: 10.01.13
 * Time: 16:33
 * Модуль героя.
 * В глобальном контексте(window) создаем переменную Hero
 * и присваиваем ей результат анонимной функции. (module pattern)
 */
'use strict';

var Hero = (function( _ , parentClass){
    /**
     * Конструктор нашего объекта(героя)
     * @param options
     * @constructor
     */
    function Hero ( options ) {
        //Вызываем родительский конструктор в контексте нашего объекта
        parentClass.call(this, options);

        //Дальше инициализируем собственные поля класса
    }

    // Наследуем прототип parentClass
    Hero.prototype = Object.create(parentClass.prototype);

    // Пишем правильный конструктор в прототип
    Hero.prototype.constructor = Hero;

    //Возвращаем конструктор класса
    return Hero;
})( _ , Creature); // Вызываем наш модуль с параметрами _ (переменная-бъект lodash) и Creature (базовый класс)
