import { BufferAttribute, BufferGeometry, Color, Points, ShaderMaterial, Vector2 } from 'three'
import { Edge, Graph, Vertex } from '../lib'
import { glContext } from '.'
import { Line2, LineGeometry, LineMaterial } from 'three/examples/jsm/Addons.js'

/**
 * initial graph in threejs.
 * vertices -> Points
 * edges -> Line2[]
 *
 * @returns
 */
export async function initGraph() {
	const data: Graph = await import('../data/data0.json')
	glContext.graph = data

	const { scene } = glContext

	const points = await initVertices(data.vertices)
	glContext.points = points
	scene.add(points)

	for (let edge of data.edges) {
		const line = initLine(edge)
		glContext.lines.push(line)
		scene.add(line)
	}
}

async function initVertices(vertices: Vertex[]): Promise<Points> {
	const num = vertices.length
	const position = new Float32Array(num * 3)

	for (let i = 0; i < num; ++i) {
		const vertex = vertices[i]

		position[i * 3 + 0] = vertex.coord?.[0] ?? 0
		position[i * 3 + 1] = vertex.coord?.[1] ?? 0
		position[i * 3 + 2] = vertex.coord?.[2] ?? 0
	}

	const geo = new BufferGeometry()
	geo.setAttribute('position', new BufferAttribute(position, 3))

	const mat = new ShaderMaterial({
		uniforms: {
			color: { value: new Color(0xffffff) },
			pointSize: { value: 20 },
		},
		vertexShader: (await import('./points.vs?raw')).default as unknown as string,
		fragmentShader: (await import('./points.fs?raw')).default as unknown as string,
		transparent: true,
		depthWrite: false,
	})

	const points = new Points(geo, mat)

	return points
}

const lineMat = new LineMaterial({
	color: 0xffff00,
	linewidth: 1.5,
	resolution: new Vector2(window.innerWidth, window.innerHeight),
})

function initLine(edge: Edge): Line2 {
	const {
		graph: { vertices },
	} = glContext

	const [source, target] = [
		vertices.find((v) => v.id === edge.source)!,
		vertices.find((v) => v.id === edge.target)!,
	]

	const geo = new LineGeometry()
	geo.setPositions([...(source.coord ?? [0, 0, 0]), ...(target.coord ?? [0, 0, 0])])

	const line = new Line2(geo, lineMat)

	return line
}
