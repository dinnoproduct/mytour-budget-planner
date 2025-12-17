export const getPluralForm = (n: number, key: string): string => {
	let suffix = 'other'
	if (n === 1) {
		suffix = 'one'
	}
	if (n >= 2 && n <= 4) {
		suffix = 'few'
	}
	if ((n >= 5 && n <= 20) || (n % 10 >= 5 && n % 10 <= 9) || (n % 10 === 0)) {
		suffix = 'many'
	}

	return `${key}.${suffix}` as string
}
