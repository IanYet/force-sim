import {
	PerspectiveCamera,
	WebGLRenderer,
	Scene,
	Mesh,
	MeshBasicMaterial,
	IcosahedronGeometry,
	Points,
} from 'three'
import { Line2, OrbitControls } from 'three/examples/jsm/Addons.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { initGraph } from './graph'
import { ForceSimulator, Graph } from '../lib'
import { updateGraph } from './draw'

export { updateGraph }

const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new WebGLRenderer({ alpha: true, antialias: true })
const scene = new Scene()
const control = new OrbitControls(camera, renderer.domElement)
const stats = new Stats()

/**
 * global three context
 */
export const glContext = {
	renderer,
	camera,
	scene,
	control,
	stats,
	loopId: 0,
	graph: {} as Graph,
	points: {} as Points,
	lines: [] as Line2[],
}

/**
 * initialize three
 * @returns
 */
export async function initViewer() {
	const { renderer, camera, scene, control, stats } = glContext
	const el = document.getElementById('app')
	//@ts-ignore
	window['glContext'] = glContext

	if (!el) return

	el.style.background = 'linear-gradient(0deg ,#c1c2c3, #eeeeee)'

	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setClearAlpha(0)
	el.appendChild(renderer.domElement)

	camera.position.set(0, 0, 10)
	camera.updateProjectionMatrix()

	scene.add(camera)

	control.update()
	control.enabled = true

	el.appendChild(stats.dom)

	const cube = new Mesh(
		new IcosahedronGeometry(1, 1),
		new MeshBasicMaterial({ color: 0x888888, wireframe: true })
	)
	scene.add(cube)

	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})

	glContext.loopId = requestAnimationFrame(loop)

	await initGraph()

	const sim = new ForceSimulator(3)
	sim.initGraph(glContext.graph)

	sim.onUpdate = updateGraph
	sim.tick()
}

function loop(_: number) {
	const { renderer, camera, scene, stats } = glContext

	glContext.loopId = requestAnimationFrame(loop)

	renderer.render(scene, camera)
	stats.update()
}
