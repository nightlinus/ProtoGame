/**
 * User: OgarkovMA
 * Date: 10.01.13
 * Time: 15:47
 * Основной модуль игры
 */

/**
 *  Пока тупо слушаем событие DOMContentLoaded(документ загрузился)
 *  и инициализируем необхожимые переменные.
 *
 *  @TODO обернуть в модуль
 */
document.addEventListener('DOMContentLoaded', function () {

    //Ищем в документе канвас по ID и сохраняем ссылку на него
    var canvas = document.getElementById('main-canvas');

    //Берем контекст 2д
    var ctx = canvas.getContext('2d');

    //Цвет заливки канваса
    ctx.strokeStyle = '#000000';

    //Просто проверяем, что он работает
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    var eventController = new EventController();
    var kbController = new KeyboardController({
        'eventController': eventController
    });

    // Создаем экхемпляр монстра
    var monster = new Creature();

    //Создаем экземпляр героя
    var hero = new Hero();

    //Выводим в консоль наши объекты
    console.log(monster);
    console.log(hero);

    //проверяем получил ли наш герой методы из Creature
    hero.traverseTo(100);
    console.log(hero);

    var x = 0;
    var delta = 1;
    var tick = 0;

    function paint( time ){
        requestAnimationFrame(paint, canvas);
        draw();
    }


    function draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
       // ctx.fillStyle = '#ffff00';
        ctx.strokeStyle = '#ff0000';
        //ctx.fillRect(x, 0, 100, 100);
        ctx.strokeRect(x, 0, 100, 100);
       // ctx.drawImage(canvas2, 0, 0 , canvas2.width, canvas2.height, 0, 0, canvas2.width, canvas2.height);
        if ( (x + 100) >= canvas.width || x + delta == 0){
            delta = -1*delta;
        }
        x += delta;
    }
    draw = _.throttle(draw, 1000/30);
    paint(Date.now());
});
