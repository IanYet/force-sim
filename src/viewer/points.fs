precision mediump float;
uniform vec3 color;
flat varying int vWeight;

void main() {
    float r = length(gl_PointCoord - vec2(0.5, 0.5));
    if(r < 0.5) {
        gl_FragColor = vec4(color * float(vWeight / 2), 1.0);
    } else {
        discard;
    }
}