app.factory('ArrowFactory', function {
    var Arrow = function (direction, el) {
        this.direction = direction;
        this.el = $(`<${direction}-arrow></${direction}-arrow>`);
        $(`.${direction}-arrow-col`).append(this.el);
    };

    Arrow.prototype.animate = function (bpm) {

    }
})
