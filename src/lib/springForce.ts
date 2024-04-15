import type { ForceSimulator } from './ForceSimulator'
import { distance, minus, multiplyScalar } from './math'

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
	(sim: ForceSimulator, t: number): ForceSimulator => {
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
			const aS = multiplyScalar(minus(vT.coord, vS.coord), f / r / wS)
			const aT = multiplyScalar(minus(vS.coord, vT.coord), f / r / wT)

			vS.coord.forEach((x, i) => (vS.coord[i] = x + vS.velocity[i] * t + 0.5 * aS[i] * t * t))
			vT.coord.forEach((x, i) => (vT.coord[i] = x + vT.velocity[i] * t + 0.5 * aT[i] * t * t))
			vS.velocity.forEach((v, i) => (vS.velocity[i] = v + t * aS[i]))
			vT.velocity.forEach((v, i) => (vT.velocity[i] = v + t * aT[i]))
		}

		return sim
	}
