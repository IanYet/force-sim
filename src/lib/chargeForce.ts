import type { ForceSimulator } from './ForceSimulator'
import { distance, minus, multiplyScalar, plus } from './math'

/**
 * Charge between vertices.
 *
 * Formula of force between vertices is **F = k * m1 * m2 / (r^2)**.
 *
 * @param k indicates factor **k**. default is 10. Used if vertex.charge doesn't exist.
 *
 * The positive sign indicates repulsion, while the negative sign indicates attraction.
 *
 * Measured in **N * m^2 / kg^2**
 *
 * @param range What range of vertices exert force on the center vertex, default is inf
 * @returns
 */
export const chargeForce =
	(k: number = 10, range: number = Number.MAX_SAFE_INTEGER) =>
	(sim: ForceSimulator): ForceSimulator => {
		const { vertices } = sim.graphData!

		for (let v1 of vertices) {
			for (let v2 of vertices) {
				if (v1.id === v2.id) continue

				const r = distance(v1.coord, v2.coord)
				if (r > range) continue

				const m2 = v2.weight ?? sim.vWeight
				const aScalar = (k * m2) / r ** 2
				v1.acceleration = plus(
					v1.acceleration,
					multiplyScalar(minus(v1.coord, v2.coord), aScalar / r)
				)
			}
		}

		return sim
	}
