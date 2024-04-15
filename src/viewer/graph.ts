import { BufferAttribute, BufferGeometry, Color, Points, ShaderMaterial, Vector2 } from 'three'
import { EdgeBasic, GraphBasic, VertexBasic } from '../lib'
import { glContext } from '.'
import { Line2, LineGeometry, LineMaterial } from 'three/examples/jsm/Addons.js'

/**
 * initial graph in threejs.
 *
 * vertices -> Points
 *
 * edges -> Line2[]
 *
 * @returns
 */
export async function initGraph() {
	const data: GraphBasic = (await import('../data/data0.json')).default
	glContext.graph = data

	const { scene } = glContext

	const points = await initVertices(data.vertices)
	glContext.points = points
	scene.add(points)

	for (let edge of data.edges) {
		const line = initEdge(edge)
		glContext.lines.push(line)
		scene.add(line)
	}
}

async function initVertices(vertices: VertexBasic[]): Promise<Points> {
	const num = vertices.length
	const position = new Float32Array(num * 3)
	const weight = new Int32Array(num)
	const radius = new Float32Array(num)

	for (let i = 0; i < num; ++i) {
		const vertex = vertices[i]

		position[i * 3 + 0] = vertex.coord?.[0] ?? 0
		position[i * 3 + 1] = vertex.coord?.[1] ?? 0
		position[i * 3 + 2] = vertex.coord?.[2] ?? 0

		weight[i] = vertex.weight ?? 1
		radius[i] = vertex.radius ?? 1
	}

	const geo = new BufferGeometry()
	geo.setAttribute('position', new BufferAttribute(position, 3))
	geo.setAttribute('weight', new BufferAttribute(weight, 1))
	geo.setAttribute('radius', new BufferAttribute(radius, 1))

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

export const lineMat = new LineMaterial({
	color: 0xffff00,
	linewidth: 1.5,
	resolution: new Vector2(window.innerWidth, window.innerHeight),
})

function initEdge(edge: EdgeBasic): Line2 {
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
