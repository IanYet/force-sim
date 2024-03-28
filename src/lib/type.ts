export interface Vertex {
	id: string
	coord?: number[]
	velocity?: number[]
	radius?: number
	charge?: number
}

export interface Edge {
	id: string
	source: string
	target: string
	length?: number
	factor?: number
}
