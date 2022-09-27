import "./style.scss";
import vert from "./common/shaders/default.vert";
import frag from "./common/shaders/default.frag";
import { createProgram, createShader } from "./common/utils/shaderUtils";
import * as cube from "./common/shapes/cube";
import Camera from "./camera/Camera";

const container = document.querySelector(".grid-container")!;
const canvas: HTMLCanvasElement = document.querySelector("#gl-canvas")!;
const gl = canvas.getContext("webgl2", { alpha: true });

let fov = Math.PI / 2.5;
const f = 1 / Math.tan(fov / 2);
let aspect = (gl?.canvas?.clientWidth || 1) / (gl?.canvas?.clientHeight || 1);
const near = 0.2;
const far = 5;

const camera = new Camera(new DOMPoint(0, 0, -2));

const modelMatrix = new DOMMatrix(
    [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]
);

modelMatrix.scale3dSelf(0.3, 0.3, 0.3);
modelMatrix.translateSelf(0, 0, -3);


const main2 = () => {
    modelMatrix.rotateSelf(-0.5, 0.9, -2);
    if (!gl) {
        alert("no webgl2 :(");
        return;
    }

    const { width, height } = gl.canvas;

    const projectionMatrix = new DOMMatrix(
        [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, 1, 1,
            0, 0, 0, 1
        ]
    );


    let perspectiveMatrix = new DOMMatrix();

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vert)!;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag)!;
    const program = createProgram(gl, vertexShader, fragmentShader)!;

    // position 
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.position), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(
        positionAttributeLocation,
        3,
        gl.FLOAT,
        false, 0, 0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // color
    const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    const colorBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.color), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(
        colorAttributeLocation,
        4,
        gl.FLOAT,
        false, 0, 0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, null);



    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 13, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);

    // gl.enable(gl.CULL_FACE);
    // gl.cullFace(gl.FRONT);
    gl.enable(gl.DEPTH_TEST);

    const modelMatrixLocation = gl.getUniformLocation(program, "uModelMatrix");
    const viewMatrixLocation = gl.getUniformLocation(program, "uViewMatrix");
    const projectionMatrixLocation = gl.getUniformLocation(program, "uProjectionMatrix");
    const perspectiveMatrixLocation = gl.getUniformLocation(program, "uPerspectiveMatrix");

    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.toFloat32Array());
    gl.uniformMatrix4fv(viewMatrixLocation, false, camera.viewMatrix.toFloat32Array());
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix.toFloat32Array());
    gl.uniformMatrix4fv(perspectiveMatrixLocation, false, perspectiveMatrix.toFloat32Array());

    gl.drawArrays(gl.TRIANGLES, 0, 12 * 3);
    requestAnimationFrame(main2);
};


requestAnimationFrame(main2);
