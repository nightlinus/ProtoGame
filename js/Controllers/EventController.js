/**
 * User: OgarkovMA
 * Date: 10.01.13
 * Time: 16:08
 *
 * Модуль с медиатором
 */
'use strict';

var EventController = (function( _ ){
    var defaults = {

        },
        instance;


    /**
     * Конструктор нашего медиатора
     * @param options
     * @constructor
     */
    function EventController( options ) {
        //Singleton: если объект уже был создан, то возвращаем его
        if (instance) return instance;

        //Кладем в инстанс ссылку на наш объект
        instance = this;
        options = options || {};
        _.defaults(options, defaults);

        //Создаем хэш для хранения каналов
        this.channels = {};
        return this;
    }

    /**
     * Метод, для оповещения всех подписчиков о событии
     * @param channel
     * @param options
     * @return {*}
     */
    var publish = function( channel, options) {

        //Кэшируем канал
        var chan = this.channels[channel];

        //Если никто не подписан на такой канал, то ничего не делаем
        if (!chan) return this;

        //Создаем кастомный объект события
        var event = {
            type: channel,
            timeStamp: Date.now()
        };

        //Расширяем наше событие параметрами, переданными в метод
        _.defaults(event, options);

        //Кэшируем размер хэша
        var len = chan.length;

        //Проходимся по всем подписчикам и вызываем их коллбэки в заданном контексте
        for (var i = 0; i < len; i++) {
            chan.subscribers[i].callback.call(chan.subscribers[i].context, event);
        }

        //Возвращаем ссылку на медиатор
        return this;
    };

    /**
     * Метод для подписки на события
     * @param channel
     * @param fn
     * @param context
     * @return {*}
     */
    var subscribe = function(channel, fn, context) {

        //Если такого канала еще нет, создаем его
        if (!this.channels[channel])  this.channels[channel] = {};

        //Кэшируем канал
        var chan = this.channels[channel];

        //Создаем массив с подписчиками на канал, если его еще нет
        if (!chan.subscribers) chan.subscribers = [];

        //Добавляем в массив колбэк и контекст для него
        chan.subscribers.push({
            callback: fn,
            context: context
        });

        //Не забываем наращивать длину
        chan.length = chan.length ? chan.length + 1 : 1;

        //Возвращаем ссылку на медиатор
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

    //Возарвщем конструткор нашего медиатора
    return EventController;
})( _ );