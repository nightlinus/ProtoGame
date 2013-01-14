/**
 * Created with JetBrains PhpStorm.
 * User: OgarkovMA
 * Date: 10.01.13
 * Time: 16:08
 * To change this template use File | Settings | File Templates.
 */
var EventController = (function( _ ){
    var defaults = {

    };
    function EventController( options ) {
        options = options || {};
        _.defaults(options, defaults);

        this.channels = {};
    }

    var publish = function( channel, options) {
        if (!this.channels[channel]) return this;
        var chan = this.channels[channel];
        var event = {
            type: channel,
            timeStamp: Date.now()
        };
        _.defaults(event, options);
        for (var i = 0; i < chan.length; i++) {
            chan.subscribers[i].callback.call(chan.subscribers[i].context, event);
        }
        return this;
    };

    var subscribe = function(channel, fn, context) {
        if (!this.channels[channel])  this.channels[channel] = {};
        var chan = this.channels[channel];
        if (!chan.subscribers) chan.subscribers = [];
        chan.subscribers.push({
            callback: fn,
            context: context
        });
        chan.length = chan.length ? chan.length + 1 : 1;

        return this;
    };
    //Пишем в прототип алиасы для subscribe
    EventController.prototype.on = subscribe;
    EventController.prototype.subscribe = subscribe;

    //Пишем в прототип алиасы для publish
    EventController.prototype.trigger = publish;
    EventController.prototype.publish = publish;
    EventController.prototype.emit = publish;

    //Пишем правильный конструктор
    EventController.prototype.constructor = EventController;
    return EventController;
})( _ );