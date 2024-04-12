import { springForce } from './springForce'
import { GraphBasic, Graph, Vertex } from './type'

export class ForceSimulator {
	/**
	 * dimension, used to slice vertex.coord
	 * @default 3
	 */
	#dimension: number

	get dimension() {
		return this.#graphData
	}

	/**
	 * graphData
	 */
	#graphData?: Graph

	get graphData() {
		return this.#graphData
	}

	/**
	 * power mode
	 */
	#powerMode: 'cpu' | 'gpu' = 'cpu'

	get powerMode() {
		return this.#powerMode
	}
	/**
	 *
	 */
	#rafId: number = 0

	/**
	 * Vertex radius, used if vertex.radius doesn't exist.
	 *
	 * Measured in **m**
	 * @default 0
	 */
	vRadius: number = 0

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
	vCharge: number = 10
	/**
	 * Vertex weight, used if vertex.weight doesn't exist.
	 *
	 * Mesured in **kg**
	 * @default 1
	 */
	vWeight: number = 1
	/**
	 * initial space between vertices
	 */
	#space: number = 10

	/**
	 *
	 */
	onStart: (graphData: Graph) => void = () => {}

	/**
	 *
	 */
	onUpdate: (graphData: Graph) => void = () => {}

	/**
	 *
	 */
	onEnd: (graphData: Graph) => void = () => {}

	constructor(dimension: number = 3, powerMode: 'cpu' | 'gpu' = 'cpu') {
		this.#dimension = dimension
		this.#powerMode = powerMode
	}

	loadGraph(graphData: Graph) {
		this.#graphData = graphData
	}

	initGraph(graphData: GraphBasic): Graph {
		const { vertices, edges } = graphData
		const data: Graph = { vertices: [], edges: [] }
		this.#graphData = data

		const d = this.#dimension

		for (let i = 0; i < vertices.length; ++i) {
			const vertex = vertices[i]
			const vertexBasic: Vertex = { ...vertex, coord: [], velocity: [] }
			data.vertices.push(vertexBasic)

			vertexBasic.velocity.length = d
			vertexBasic.velocity.fill(0)
		}

		for (let edge of edges) {
			data.edges.push({ ...edge })
		}

		//place vertices evenly across the space from the center
		const coordSet = new Set<string>()
		const queue = [new Array(d).fill(0)]

		while (coordSet.size < vertices.length) {
			const coord = queue.shift()!
			coordSet.add(coord.join('~'))

			for (let i = 0; i < d; ++i) {
				const [left, right] = [[...coord], [...coord]]
				left[i] = coord[i] - 1
				right[i] = coord[i] + 1

				if (!coordSet.has(left.join('~'))) queue.push(left)
				if (!coordSet.has(right.join('~'))) queue.push(right)
			}
		}

		const coordIter = coordSet.entries()
		for (let vertex of data.vertices) {
			const coord = coordIter.next().value[0].split('~') as number[]
			vertex.coord = coord.map((c) => c * this.#space)
		}

		return data
	}

	start(t?: number) {
		this.#rafId = requestAnimationFrame((t: number) => this.start(t))
		this.tick(t)
	}

	pause() {
		cancelAnimationFrame(this.#rafId)
	}

	end() {
		cancelAnimationFrame(this.#rafId)
	}

	tick(t?: number) {
		if (!this.#graphData) return

		springForce(9)(this, 0.033)
		this.onUpdate(this.#graphData)
	}
}
