import { Points } from 'three'
import { glContext } from '.'
import type { Graph, Vertex, Edge } from '../lib'
import type { Line2 } from 'three/examples/jsm/Addons.js'

/**
 * update graph when vertices position changed
 */
export function updateGraph(graph: Graph) {
	const { points, lines } = glContext

	updateVertices(graph.vertices, points)

	for (let i = 0; i < graph.edges.length; ++i) {
		updateEdge(graph.edges[i], graph.vertices, lines[i])
	}
}

function updateVertices(vertices: Vertex[], points: Points) {
	const attr = points.geometry.getAttribute('position')

	for (let i = 0; i < vertices.length; ++i) {
		const vertex = vertices[i]
		attr.setXYZ(i, vertex.coord[0] ?? 0, vertex.coord[1] ?? 0, vertex.coord[2] ?? 0)
	}
	attr.needsUpdate = true
}

function updateEdge(edge: Edge, vertices: Vertex[], line: Line2) {
	const [source, target] = [
		vertices.find((v) => v.id === edge.source)!,
		vertices.find((v) => v.id === edge.target)!,
	]

	line.geometry.setPositions([...(source.coord ?? [0, 0, 0]), ...(target.coord ?? [0, 0, 0])])
}
