/**
 * Created with JetBrains PhpStorm.
 * User: BIG papa
 * Date: 13.01.13
 * Time: 13:36
 */
var Artist = (function( _, parentClass ){
    var STATE_IDLE = 0,
        STATE_DRAW = 1,
        defaults = {
            fps: 30
        };

    //------------------DrawObject-----------------------//

    function DrawObject( object, canvas, options) {
        options = options || {};
        this.id = object.id = guidGenerator();
        this.nativeObject = object;
        this.layer = canvas;
        this.ctx =  this.layer.getContext('2d');
        this.bufferCanvas = this.layer;
        this.buffer = false;
        if ( options.buffer) {
            this.buffer = true;
            this.bufferCanvas = document.createElement('canvas');
            this.bufferCanvas.buffer = true;
            //document.getElementsByTagName('body')[0].appendChild(this.bufferCanvas);
            this.bufferCanvas.width = this.nativeObject.width;
            this.bufferCanvas.height = this.nativeObject.height;
        }
    }

    var guidGenerator = function() {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };

        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };

    var draw = function( timeStamp ) {
        var obj = this.nativeObject,
            cv  = this.bufferCanvas,
            prevState = {
                x : obj.x,
                y : obj.y
            };
        if (this.nativeObject.draw( timeStamp, prevState, cv)) {
            if ( this.buffer ) {
                this.ctx.clearRect(prevState.x, prevState.y, obj.width, obj.height);
                this.ctx.drawImage(
                    cv,
                    0,
                    0,
                    cv.width,
                    cv.height,
                    obj.x,
                    obj.y,
                    obj.width,
                    obj.height
                );
            }
        }
        return this;
    };

    DrawObject.prototype = Object.create(parentClass.prototype);
    DrawObject.prototype.constructor = DrawObject;
    DrawObject.prototype.draw = draw;

    //-----------------Artist-----------------------//

    function Artist( options ) {
        options = options || {};
        _.defaults(options, defaults);
        this.canvas = options.canvas;
        this.ctx = options.canvas.getContext('2d');
        this.maxWidth = options.canvas.width;
        this.maxHeight = options.canvas.height;
        this.fps = options.fps;
        this.state = STATE_IDLE;

        this.objects = {};
        this.length = 0;
    }

    var addObject = function ( object, canvas, options) {
        var tempObj = new DrawObject( object, canvas, options);
        this.objects[tempObj.id] = tempObj;
        this.length += 1;
        return tempObj.id;
    };

    var drawScene = function( timeStamp ) {
        var objects = this.objects;
        if (!this.length) return this.stop();
        for (var currentObject in objects) {
            objects[currentObject].draw( timeStamp );
        }
        if (!animationCondition.call(this)) cancelRequestAnimationFrame();
        requestAnimationFrame( this.drawScene, this.layer );
        return this;
    };

    var animationCondition = function() {
        var result = true;
        switch (this.state) {
            case STATE_IDLE:
                result = false;
                break;
            case STATE_DRAW:
                result = true;
                break;
        }
        return result;
    };

    var start = function() {
        this.state = STATE_DRAW;
        this.drawScene = _.throttle( this.drawScene, (0.5 + 1000 / this.fps) | 0).bind(this);
        requestAnimationFrame(this.drawScene);
        return this;
    };

    var stop = function(){
        this.state = STATE_IDLE;
        return this;
    };

    Artist.prototype = Object.create(parentClass.prototype);
    Artist.prototype.constructor = Artist;
    Artist.prototype.drawScene = drawScene;
    Artist.prototype.addObject = addObject;
    Artist.prototype.start = start;
    Artist.prototype.stop = stop;
    return Artist;
})( _, GameObject );