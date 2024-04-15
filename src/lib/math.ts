/**
 * minus v1 - v2
 * @param v1
 * @param v2
 * @returns
 */
export function minus(v1: number[], v2: number[]): number[] {
	return v1.map((v, i) => v - v2[i])
}

/**
 * plus v1 + v2
 * @param v1
 * @param v2
 * @returns
 */
export function plus(v1: number[], v2: number[]): number[] {
	return v1.map((v, i) => v2[i] + v)
}

/**
 * length square
 * @param v
 * @returns
 */
export function lengthSquare(v: number[]): number {
	return v.reduce((res, n) => res + n ** 2, 0)
}

/**
 * length
 * @param v
 * @returns
 */
export function length(v: number[]): number {
	return lengthSquare(v) ** 0.5
}

/**
 * normalize
 * @param v
 * @returns
 */
export function normalize(v: number[]): number[] {
	const l = length(v)
	return v.map((n) => n / l)
}

/**
 * distance square of two vertices
 * @param v1
 * @param v2
 * @returns
 */
export function distanceSquare(v1: number[], v2: number[]): number {
	return lengthSquare(minus(v1, v2))
}

/**
 * distance
 * @param v1
 * @param v2
 * @returns
 */
export function distance(v1: number[], v2: number[]): number {
	return distanceSquare(v1, v2) ** 0.5
}

/**
 * multiply scalar
 * @param v
 * @param s
 * @returns
 */
export function multiplyScalar(v: number[], s: number): number[] {
	return v.map((n) => n * s)
}

/**
 * reverse
 * @param v
 * @returns
 */
export function reverse(v: number[]): number[] {
	return v.map((n) => 0 - n)
}
