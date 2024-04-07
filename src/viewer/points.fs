precision mediump float;
uniform vec3 color;

void main() {
    float r = length(gl_PointCoord - vec2(0.5, 0.5));
    if(r < 0.5) {
        gl_FragColor = vec4(color, 1.0);
    } else {
        discard;
    }
}