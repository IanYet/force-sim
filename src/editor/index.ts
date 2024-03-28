import { PerspectiveCamera, WebGLRenderer, Scene } from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'

const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new WebGLRenderer({ alpha: true, antialias: true })
const scene = new Scene()
const control = new OrbitControls(camera, renderer.domElement)
const stats = new Stats()

export const glContext = {
	renderer,
	camera,
	scene,
	control,
	stats,
	loopId: 0,
}

export function initEditor() {
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

	camera.position.set(0, 0, 100)
	camera.updateProjectionMatrix()

	scene.add(camera)

	control.update()
	control.enabled = false

	el.appendChild(stats.dom)

	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})

	glContext.loopId = requestAnimationFrame(loop)
}

function loop(_: number) {
	const { renderer, camera, scene, stats } = glContext

	glContext.loopId = requestAnimationFrame(loop)

	renderer.render(scene, camera)
	stats.update()
}
