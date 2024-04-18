import type { ForceSimulator } from './ForceSimulator'
import { distance, minus, multiplyScalar, plus } from './math'

/**
 * Force exerted by a edge on two vertices, just likes a string, following Hooke's law.
 *
 * @param eLength Edge default length, at which neither tensile nor repulsive forces are produced.
 * Used if edge.length doesn't exist.
 * Measured in **m**.
 * Default is 10.
 * @param eFactor Formula is **F = k * δx**, this value indiacates fator **k**.
 * Used if edge.factor doesn't exist.
 * Measured in **N/m**.
 * Default is 1.
 * @returns
 */
export const springForce =
	(eLength: number = 10, eFactor: number = 1) =>
	(sim: ForceSimulator): ForceSimulator => {
		const { vertices, edges } = sim.graphData!

		for (let edge of edges) {
			const vS = vertices.find((vertex) => vertex.id === edge.source)!
			const vT = vertices.find((vertex) => vertex.id === edge.target)!

			const r = distance(vS.coord, vT.coord)
			const l = edge.length ?? eLength
			const k = edge.factor ?? eFactor

			const f = (r - l) * k

			const wS = vS?.weight ?? sim.vWeight
			const wT = vT?.weight ?? sim.vWeight
			vS.acceleration = plus(
				vS.acceleration,
				multiplyScalar(minus(vT.coord, vS.coord), f / r / wS)
			)
			vT.acceleration = plus(
				vT.acceleration,
				multiplyScalar(minus(vS.coord, vT.coord), f / r / wT)
			)
		}

		return sim
	}
