import "./style.scss";
import vert from "./common/shaders/default.vert";
import frag from "./common/shaders/default.frag";
import { createProgram, createShader } from "./common/utils/shaderUtils";
import * as cube from "./common/shapes/cube";

const container = document.querySelector(".grid-container")!;
const canvas: HTMLCanvasElement = document.querySelector("#gl-canvas")!;
const gl = canvas.getContext("webgl2", { alpha: true });

let fov = Math.PI / 4;
let aspect = (gl?.canvas?.clientWidth || 1) / (gl?.canvas?.clientHeight || 1);

const main = () => {

    if (!gl) {
        alert("no webgl2 :(");
        return;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vert)!;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag)!;
    const program = createProgram(gl, vertexShader, fragmentShader)!;
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    const positionBuffer = gl.createBuffer()!;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.position), gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);

    let size = 3;          // 3 components per iteration
    let type = gl.FLOAT;   // the data is 32bit floats
    let normalize = false; // don't normalize the data
    let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0;        // start at the beginning of the buffer

    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    const colorBuffer = gl.createBuffer()!;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.color), gl.STATIC_DRAW);

    const vaoColors = gl.createVertexArray();
    gl.bindVertexArray(vaoColors);
    gl.enableVertexAttribArray(colorAttributeLocation);

    gl.vertexAttribPointer(
        colorAttributeLocation, 4, type, normalize, stride, offset);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 12, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.bindVertexArray(vaoColors);

    let primitiveType = gl.TRIANGLES;
    let count = cube.position.length / 3;
    gl.drawArrays(primitiveType, offset, count);
};

const worldMatrix = new DOMMatrix(
    [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]
);

const viewMatrix = new DOMMatrix(
    [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]
);

const modelMatrix = new DOMMatrix(
    [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]
);

modelMatrix.rotateSelf(45, 45, 0);
modelMatrix.scale3dSelf(0.3, 0.3, 0.3);
modelMatrix.translateSelf(-0.35, -0.35, -0.35);

const main2 = () => {
    modelMatrix.rotateSelf(-0.5, 0.9, -2);
    if (!gl) {
        alert("no webgl2 :(");
        return;
    }

    const { width, height } = gl.canvas;

    const viewMatrix = new DOMMatrix(
        // [
        //     width / 2, 0, 0, 0,
        //     0, height / 2, 0, 0,
        //     0, 0, 1, 0,
        //     width / 2, height / 2, 0, 1
        // ]
    );

    const projectionMatrix = new DOMMatrix(
        [
            1, 0, 0, 0,
            0, aspect, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]
    );


    let transform = new DOMMatrix();

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vert)!;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag)!;
    const program = createProgram(gl, vertexShader, fragmentShader)!;

    // position 
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const position = [
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.6,
        0.5, 0.5, -0.7,
    ];

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
    const color = [
        1, 0, 0, 1,
        0, 1, 0, 1,
        0, 0, 1, 1,
    ];
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

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);
    gl.enable(gl.DEPTH_TEST);
    const modelMatrixLocation = gl.getUniformLocation(program, "uModelMatrix");
    const viewMatrixLocation = gl.getUniformLocation(program, "uViewMatrix");
    const projectionMatrixLocation = gl.getUniformLocation(program, "uProjectionMatrix");

    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix.toFloat32Array());
    gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix.toFloat32Array());
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix.toFloat32Array());

    gl.drawArrays(gl.TRIANGLES, 0, 12 * 3);
    requestAnimationFrame(main2);
};


requestAnimationFrame(main2);
