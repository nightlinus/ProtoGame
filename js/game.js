/**
 * Created with JetBrains PhpStorm.
 * User: OgarkovMA
 * Date: 10.01.13
 * Time: 15:47
 */
document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('main-canvas');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    GameController.init();
    var monster = new Creature();
    var Hero = new Hero();
    console.log(monster);
});
