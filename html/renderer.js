class Renderer {
    constructor (e) {
        this.engine = e;
    }

    update (dt) {

        this.engine.update(dt);
        this.engine.bodies.forEach(function (b) {
            b.draw();
        });
    }
}
