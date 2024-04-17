export function Caeser(str: string, num: number) {
	let result = '';

	for (let i = 0; i < str.length; i++) {
		result += String.fromCharCode(str.charCodeAt(i) + num);
	}

	return result;
}
