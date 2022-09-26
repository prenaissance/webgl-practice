#version 300 es

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

in vec4 a_position;
in vec4 a_color;

out vec4 v_color;
// all shaders have a main function
void main() {

  v_color = a_color;

  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * a_position;
}