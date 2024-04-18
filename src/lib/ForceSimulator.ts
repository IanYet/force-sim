import { GraphBasic, Graph, Vertex } from './type'

export class ForceSimulator {
	/**
	 * dimension, used to slice vertex.coord
	 * @default 3
	 */
	#dimension = 3

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
	 * iter times
	 */
	#iterTimes = 900

	get iterTimes() {
		return this.#iterTimes
	}
	/**
	 * `requestAnimationFrame` id
	 */
	#rafId = 0
	/**
	 * forces
	 */
	#forces = new Map<string, (sim: ForceSimulator) => ForceSimulator>()

	alpha = 1
	alphaMin = 0.001
	#alhpaDecay = 1 - Math.pow(this.alphaMin, 1 / this.#iterTimes)
	/**
	 * initial space between vertices
	 */
	#space = 10

	/**
	 * Vertex radius, used if vertex.radius doesn't exist.
	 *
	 * Measured in **m**
	 * @default 0
	 */
	vRadius = 0

	/**
	 * Vertex weight, used if vertex.weight doesn't exist.
	 *
	 * Mesured in **kg**
	 * @default 1
	 */
	vWeight = 1

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
	onPause: (graphData: Graph) => void = () => {}

	/**
	 *
	 */
	onEnd: (graphData: Graph) => void = () => {}

	/**
	 *
	 * @param dimension default 3
	 * @param powerMode default cpu
	 * @param iterTimes default 300
	 */
	constructor(dimension: number = 3, powerMode: 'cpu' | 'gpu' = 'cpu', iterTimes: number = 300) {
		this.#dimension = dimension
		this.#powerMode = powerMode
		this.#iterTimes = iterTimes
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
			const vertexBasic: Vertex = { ...vertex, coord: [], velocity: [], acceleration: [] }
			data.vertices.push(vertexBasic)

			vertexBasic.velocity.length = d
			vertexBasic.velocity.fill(0)
			vertexBasic.acceleration.length = d
			vertexBasic.acceleration.fill(0)
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

	applyForce(name: string, force: (sim: ForceSimulator) => ForceSimulator): ForceSimulator {
		this.#forces.set(name, force)
		return this
	}

	start() {
		if (!this.#graphData) return

		console.time('raf time:')
		this.#rafId = requestAnimationFrame((t: number) => {
			this.#step(t)
		})
		this.onStart(this.#graphData)
	}

	pause() {
		cancelAnimationFrame(this.#rafId)
		this.onPause(this.#graphData!)
	}

	end() {
		console.timeEnd('raf time:')
		cancelAnimationFrame(this.#rafId)
		this.alpha = 1
		this.onEnd(this.#graphData!)
	}

	tick(t: number = 1 / 30) {
		if (!this.#graphData) return

		for (let [_, force] of this.#forces) {
			force(this)
		}

		for (let vertex of this.#graphData.vertices) {
			vertex.velocity.forEach((v, i) => {
				vertex.coord[i] = vertex.coord[i] + v * t + (vertex.acceleration[i] * t * t) / 2
				vertex.velocity[i] = (v + vertex.acceleration[i] * t) * 0.9 //* better but not enough
				vertex.acceleration[i] = 0
			})
		}

		this.onUpdate(this.#graphData)
	}

	#step(t?: number) {
		if (this.alpha < this.alphaMin) {
			return this.end()
		}

		this.#rafId = requestAnimationFrame((t: number) => this.#step(t))

		this.alpha -= this.alpha * this.#alhpaDecay
		this.tick(1 / 30)
	}
}
