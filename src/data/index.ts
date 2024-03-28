import { Edge, Vertex } from '../lib'

interface Graph {
	vertices: Vertex[]
	edges: Edge[]
}

export function geneData(): Graph {
	const graphData: Graph = {
		vertices: [],
		edges: [],
	}

	console.log(JSON.stringify(graphData))
	return graphData
}
