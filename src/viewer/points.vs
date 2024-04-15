uniform float pointSize;
attribute int weight;
attribute float radius;
flat varying int vWeight;

void main() {
    vWeight = weight;
    gl_PointSize = radius * pointSize;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}