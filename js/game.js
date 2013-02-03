/**
 * User: OgarkovMA
 * Date: 10.01.13
 * Time: 15:47
 * Основной модуль игры
 */
'use strict';
(function () {

    /**
     *  Пока тупо слушаем событие DOMContentLoaded(документ загрузился)
     *  и инициализируем необхожимые переменные.
     */
    document.addEventListener('DOMContentLoaded', function () {

        //Ищем в документе канвас по ID и сохраняем ссылку на него
        var canvas = document.getElementById('main-canvas'),
            game = new GameController({
                canvas: canvas
            });

        //Добавляем героя в игру
        game.addObject( Hero, {
            buffer: true,
            layer: canvas
        });

        //Начинаем игру
        game.start();
    });


})();
