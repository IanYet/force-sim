uniform float pointSize;
// uniform mat4 projectionMatrix;
// uniform mat4 modelViewMatrix;
// uniform vec3 position;

void main() {
    gl_PointSize = pointSize;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}