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
     *
     *  TODO обернуть в модуль
     */
    document.addEventListener('DOMContentLoaded', function () {

        //Ищем в документе канвас по ID и сохраняем ссылку на него
        var canvas = document.getElementById('main-canvas'),

            //Берем контекст 2д
            ctx = canvas.getContext('2d'),

            eventController = new EventController(),

            kbController = new KeyboardController({
                'eventController': eventController
            }),

            renderer = new Artist({
                canvas: canvas,
                eventController: eventController
            }),
            hero = new Hero({
                eventController:eventController
            });
        hero.y = canvas.height-hero.height;

        renderer.addObject( hero, canvas, {buffer: true});
        renderer.start();
    });

})();
