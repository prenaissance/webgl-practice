class Camera {
    private _holding = false;
    constructor(
        public position = new DOMPoint(0, 0, 0),
        public angleX = 0,
        public angleY = 0,
    ) {
        document.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "w":
                    this.position.x += Math.sin(this.angleX) * 0.1;
                    this.position.z += Math.cos(this.angleX) * 0.1;
                    break;
                case "s":
                    this.position.x -= Math.sin(this.angleX) * 0.1;
                    this.position.z -= Math.cos(this.angleX) * 0.1;
                    break;
                case "a":
                    this.position.x -= Math.cos(this.angleX) * 0.1;
                    this.position.z += Math.sin(this.angleX) * 0.1;
                    break;
                case "d":
                    this.position.x += Math.cos(this.angleX) * 0.1;
                    this.position.z -= Math.sin(this.angleX) * 0.1;
                    break;
                case " ":
                    this.position.y += 0.1;
                    break;
                case "Shift":
                    this.position.y -= 0.1;
                    break;
            }
        });

        document.addEventListener("pointerdown", (e) => {
            this._holding = true;
        });
        document.addEventListener("pointerup", (e) => {
            this._holding = false;
        });

        document.addEventListener("pointermove", (e) => {
            if (this._holding) {
                this.angleX -= e.movementX * 0.01;
                this.angleY -= e.movementY * 0.01;
            }
        });
    }

    get viewMatrix() {
        return new DOMMatrix()
            .rotateSelf(-this.angleY * 180, -this.angleX * 180)
            .translateSelf(-this.position.x, -this.position.y, -this.position.z);
    }
}

export default Camera;