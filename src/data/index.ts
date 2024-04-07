import { Graph } from '../lib'
import { uuid } from '../utils'

export function geneData(vertexNum: number, edgeNum: number): Graph {
	const graphData: Graph = {
		vertices: [],
		edges: [],
	}

	// generate vertices
	for (let i = 0; i < vertexNum; ++i) {
		const seed = Math.random()
		let weight

		switch (true) {
			case seed > 0.99:
				weight = 5
				break
			case seed > 0.9:
				weight = 4
				break
			case seed > 0.8:
				weight = 3
				break
			case seed > 0.6:
				weight = 2
				break
			default:
				weight = 1
		}

		graphData.vertices.push({
			id: uuid(),
			weight,
			radius: weight,
		})
	}

	const edgeSet: Set<string> = new Set()
	for (let i = 0; i < edgeNum; ++i) {
		let [start, end] = [
			Math.floor(Math.random() * edgeNum),
			Math.floor(Math.random() * edgeNum),
		]

		while (edgeSet.has(`${start}-${end}`) || edgeSet.has(`${end}-${start}`)) {
			;[start, end] = [
				Math.floor(Math.random() * edgeNum),
				Math.floor(Math.random() * edgeNum),
			]
		}

		edgeSet.add(`${start}-${end}`)

		graphData.edges.push({
			id: uuid(),
			source: graphData.vertices[start].id,
			target: graphData.vertices[end].id,
		})
	}

	console.log(JSON.stringify(graphData))
	return graphData
}
