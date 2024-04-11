export interface VertexBasic {
	id: string
	coord?: number[]
	velocity?: number[]
	radius?: number
	charge?: number
	weight?: number
}

export interface EdgeBasic {
	id: string
	source: string
	target: string
	length?: number
	factor?: number
}

export interface GraphBasic {
	vertices: VertexBasic[]
	edges: EdgeBasic[]
}

export interface Vertex {
	id: string
	coord: number[]
	velocity: number[]
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

export interface Graph {
	vertices: Vertex[]
	edges: Edge[]
}

export type RequiredDeep<T> = {
	[P in keyof T]-?: RequiredDeep<T[P]>
}
