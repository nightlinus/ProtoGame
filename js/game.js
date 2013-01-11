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
    ctx.fillStyle = '#000000';

    //Просто проверяем, что он работает
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Это УГ, сейчас пытается слушать события клавиатуры
    //@TODO подумать над видом контроллера и его функционалом
    GameController.init(); // Так лучше не делать, надо через new

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
});
