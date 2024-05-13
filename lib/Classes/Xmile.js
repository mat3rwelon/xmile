const { imgbb } = require('./Telegraph')
const {
	DefaultColor,
	RandomColors
} = require('./Colors')

class Xmile {
	#boringAvatarsUrl = 'https://source.boringavatars.com/beam'
	#ezgifUrl = 'https://ezgif.com/svg-to-png?url='
	
	constructor (options) {
		this.name = options.name || null
		this.size = options.size || 720
		this.colors = options.colors || new DefaultColor()
		
		this.#boringAvatarsUrl += '/' + this.size
		if (this.name) this.#boringAvatarsUrl += '/' + this.name
		if (this.colors instanceof RandomColors || this.colors instanceof Array) {
			this.#boringAvatarsUrl += `?colors=${this.colors.join(',')}`
		}
		this.#ezgifUrl += this.#boringAvatarsUrl
	}
	
	async create(options) {
		this.#boringAvatarsUrl = 'https://source.boringavatars.com/beam'
		this.#ezgifUrl = 'https://ezgif.com/svg-to-png?url='
		
		this.name = options.name || null
		this.size = options.size || 720
		this.colors = options.colors || new DefaultColor()
		
		this.#boringAvatarsUrl += '/' + this.size
		if (this.name) this.#boringAvatarsUrl += '/' + this.name
		if (this.colors instanceof RandomColors || this.colors instanceof Array) {
			this.#boringAvatarsUrl += `?colors=${this.colors.join(',')}`
		}
		this.#ezgifUrl += this.#boringAvatarsUrl
		
		let res = await this.#get(this.#ezgifUrl)
		console.log(res.request.path)
	}
	
	async #get(url, data, options) {
		return await axios.get(url, data, options)
	}
	
	async #post(url, data, options) {
		return await axios.post(url, data, options)
	}
	
	async #getHtml(url, data, options) {
		return (await this.#get(url, data, options)).data
	}
	
	async #postHtml(url, data, options) {
		return (await this.#post(url, data, options)).data
	}
}

exports.default = Xmile
exports.Xmile = Xmile