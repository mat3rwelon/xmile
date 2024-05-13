class DefaultColor {
	constructor () {}
}

function randomNumber(min, max = null) {
	if (max !== null) {
		min = Math.ceil(min)
		max = Math.floor(max)
		return Math.floor(Math.random() * (max - min + 1)) + min
	} else {
		return Math.floor(Math.random() * min) + 1
	}
}

function chooseItem(arr) {
	return arr[Math.floor(Math.random() * arr.length)]
}

exports.RandomColors = function RandomColors(_a = { n: 1, usePrefix: false }) {
	if (this instanceof RandomColors && _a.colors) {
		return _a.colors
	}
	let colors = []
	let n = _a.n || 1
	let usePrefix = _a.usePrefix || false
	for (let _i = 0; _i < n; _i++) {
		let redColor = randomNumber(0, 255)
		let greenColor = randomNumber(0, 255)
		let blueColor = randomNumber(0, 255)
		let red = redColor.toString(16).padStart(2, '0')
		let green = greenColor.toString(16).padStart(2, '0')
		let blue = blueColor.toString(16).padStart(2, '0')
		
		if (usePrefix) {
			colors.push(`#${red + green + blue}`)
		} else {
			colors.push(red + green + blue)
		}
	}
	return new RandomColors({ colors })
}
exports.DefaultColor = DefaultColor
exports.randomNumber = randomNumber
exports.chooseItem = chooseItem