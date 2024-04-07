import { BufferAttribute, BufferGeometry, Color, Points, ShaderMaterial } from 'three'
import { Graph, Vertex } from '../lib'
import { glContext } from '.'

export async function initGraph() {
	const data: Graph = await import('../data/data0.json')
	const { scene } = glContext

	const points = await initVertices(data.vertices)
	scene.add(points)
}

async function initVertices(vertices: Vertex[]): Promise<Points> {
	const num = vertices.length
	const position = new Float32Array(num * 3)

	for (let i = 0; i < num; ++i) {
		const vertex = vertices[i]

		position[i + 0] = vertex.coord?.[0] ?? 0
		position[i + 1] = vertex.coord?.[1] ?? 0
		position[i + 2] = vertex.coord?.[2] ?? 0
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
