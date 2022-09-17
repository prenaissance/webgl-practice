import "./style.scss";
import shader from "./shader.glsl";
import frag from "./frag.frag";
import { createProgram, createShader } from "./common/utils/shaderUtils";

const main = () => {
    const container = document.querySelector(".grid-container")!;
    const canvas: HTMLCanvasElement = document.querySelector("#gl-canvas")!;
    const gl = canvas.getContext("webgl2", { alpha: true });
    if (!gl) {
        alert("no webgl2 :(");
        return;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, shader)!;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag)!;
    const program = createProgram(gl, vertexShader, fragmentShader)!;

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        0, 0,
        0, 0.5,
        0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);

    let size = 2;          // 2 components per iteration
    let type = gl.FLOAT;   // the data is 32bit floats
    let normalize = false; // don't normalize the data
    let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0;        // start at the beginning of the buffer

    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.bindVertexArray(vao);

    let primitiveType = gl.TRIANGLES;
    let count = 3;
    gl.drawArrays(primitiveType, offset, count);
};

main();
