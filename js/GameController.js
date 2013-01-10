/**
 * Created with JetBrains PhpStorm.
 * User: OgarkovMA
 * Date: 10.01.13
 * Time: 16:08
 * To change this template use File | Settings | File Templates.
 */
var GameController = (function(){
    var key;
    var detectKey = function(event){
        key = event.keyCode;
        return this;
    };

    var eventHandlers = function(){
        document.addEventListener('keydown', detectKey(event));
    };

    var init = function(){
        eventHandlers();
    };

    return {
        'init' : init
    };

})();