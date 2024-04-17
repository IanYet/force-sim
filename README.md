# force-sim

force simulator for graph layout

## todo plan

-   [x] implement viewer by threejs

    -   [x] initialize three
    -   [x] generate mock data
    -   [x] show vertices with pointscloud
    -   [x] show edges with line2
    -   [x] update points and line2

-   [ ] implement simulator powered by cpu

    -   [x] initialize vertices layout
    -   [x] spring force
    -   [x] charge force

-   [ ] implement simulator powered by gpu

    -   `readBuffer()` in `WebGPU`
    -   `gl.getBufferSubData()` in `WebGL2`
