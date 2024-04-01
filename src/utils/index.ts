const uuidSet: Set<string> = new Set()

/**
 * generate uuid
 * @returns uuid
 */
export function uuid(): string {
	const id = crypto.randomUUID()

	if (uuidSet.has(id)) {
		return uuid()
	} else {
		uuidSet.add(id)
		return id
	}
}
