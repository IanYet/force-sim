import { Graph, GraphBasic, VertexBasic } from './type'

export class ForceSimulator {
	/**
	 * dimension, used to slice vertex.coord
	 * @default 3
	 */
	#dimension: number
	/**
	 * graphData
	 */
	#graphData?: GraphBasic

	/**
	 * Vertex radius, used if vertex.radius doesn't exist.
	 *
	 * Measured in **m**
	 * @default 0
	 */
	#vRadius: number = 0

	/**
	 * Charge between vertices. Used if vertex.charge doesn't exist.
	 *
	 * Formula of force between vertices is **F = k * m1 * m2 / (r^2)**,
	 * this value indicates factor **k**
	 *
	 * The positive sign indicates repulsion, while the negative sign indicates attraction.
	 *
	 * Measured in **N * m^2 / kg^2**
	 * @default 10
	 */
	#vCharge: number = 10
	/**
	 * Vertex weight, used if vertex.weight doesn't exist.
	 *
	 * Mesured in **kg**
	 * @default 1
	 */
	#vWeight: number = 1
	/**
	 * Edge default length, at which neither tensile nor repulsive forces are produced.
	 * Used if edge.length doesn't exist.
	 *
	 * Measured in **m**
	 * @default 10
	 */
	#eLength: number = 10
	/**
	 * Force exerted by a edge on a vertex, following Hooke's law.
	 * Used if edge.factor doesn't exist.
	 *
	 * Formula is **F = k * δx**, this value indiacates fator **k**
	 *
	 * Measured in **N/m**
	 * @default 1
	 */
	#eFactor: number = 1

	/**
	 *
	 */
	onStart: (graphData: GraphBasic) => void = () => {}

	/**
	 *
	 */
	onUpdate: (graphData: GraphBasic) => void = () => {}

	/**
	 *
	 */
	onEnd: (graphData: GraphBasic) => void = () => {}

	constructor(dimension: number = 3) {
		this.#dimension = dimension
	}

	loadGraph(graphData: GraphBasic) {
		this.#graphData = graphData
	}

	initGraph(graphData: Graph) {
		const { vertices, edges } = graphData
		const data: GraphBasic = { vertices: [], edges: [] }
		this.#graphData = data

		for (let i = 0; i < vertices.length; ++i) {
			const vertex = vertices[i]
			const vertexBasic: VertexBasic = { ...vertex, coord: [], velocity: [] }
			data.vertices.push(vertexBasic)

			for (let j = 0; j < this.#dimension; ++j) {
				vertexBasic.velocity[j] = 0
				vertexBasic.coord[j] = i
			}
		}

		for (let edge of edges) {
			data.edges.push({ ...edge })
		}
	}

	tick() {
		if (!this.#graphData) return

		this.onUpdate(this.#graphData)
	}
}
