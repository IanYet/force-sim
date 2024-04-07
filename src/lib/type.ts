export interface Vertex {
	id: string
	coord?: number[]
	velocity?: number[]
	radius?: number
	charge?: number
	weight?: number
}

export interface Edge {
	id: string
	source: string
	target: string
	length?: number
	factor?: number
}
