const axios = require('axios')
const { fromBuffer } = require('file-type')
const fs = require('fs')
const { FormData, Blob } = require('formdata-node')
const { URL } = require('url')
const Imgbb = require('imgbb-uploader')
const { chooseItem } = require('./Colors')

const getBuffer = async function getBuffer(url, options) {
	try {
		options ? options : {}
		const res = await axios({
			method: 'get',
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (error) {
		console.log(`Error: ${error}`)
	}
}

class Telegraph {
	#baseUrl = 'https://telegra.ph'
	
	constructor(file) {
		let buffer, form, blob, _res
		if (typeof file === 'string') {
			if (fs.existsSync(file)) {
				buffer = fs.readFileSync(file)
				fromBuffer(buffer).then(res => {
					if (res.mime.startsWith('image') || res.mime.startsWith('video')) {
						form = new FormData()
						blob = new Blob([buffer.buffer], { type: res.mime })
						
						form.append('file', blob, 'tmp.' + res.ext)
						axios.post(this.#baseUrl + '/upload', {
							body: form
						},
						{
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						}).then(_r => {
							_res = _r.data
							if (_res.error) throw _res.error
							this.link = _res[0].src
						}).catch(e => {
							if (e.data?.error) throw e.data.error
							else throw e
						})
					} else {
						throw 'Only support uploading image and video'
					}
				}).catch(e => console.error)
			} else if (Telegraph.isUrl(file)) {
				getBuffer(file).then(res => {
					buffer = res
					fromBuffer(buffer).then(res => {
						if (res.mime.startsWith('image') || res.mime.startsWith('video')) {
							form = new FormData()
							blob = new Blob([buffer.buffer], { type: res.mime })
							
							form.append('file', blob, 'tmp.' + res.ext)
							axios.post(this.#baseUrl + '/upload', {
								body: form
							},
							{
								headers: {
									'Content-Type': 'multipart/form-data'
								}
							}).then(_r => {
								_res = _r.data
								if (_res.error) throw _res.error
								this.link = _res[0].src
							}).catch(e => {
								if (e.data?.error) throw e.data.error
								else throw e
							})
						} else {
							throw 'Only support uploading image and video'
						}
					}).catch(e => {
						throw e
					})
				}).catch(e => {
					throw e
				})
			} else {
				throw 'Invalid file path or url'
			}
		} else if (file instanceof Buffer) {
			buffer = file
			fromBuffer(buffer).then(res => {
				if (res.mime.startsWith('image') || res.mime.startsWith('video')) {
					form = new FormData()
					blob = new Blob([buffer.buffer], { type: res.mime })
					
					form.append('file', blob, 'tmp.' + res.ext)
					axios.post(this.#baseUrl + '/upload', {
						body: form
					},
					{
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					}).then(_r => {
						_res = _r.data
						if (_res.error) throw _res.error
						this.link = _res[0].src
					}).catch(e => {
						if (e.data?.error) throw e.data.error
						else throw e
					})
				} else {
					throw 'Only support uploading image and video'
				}
			})
		} else {
			throw 'Only support uploading image and video'
		}
	}
	
	static isUrl(s) {
		try {
			new URL(s)
			return true
		} catch (e) { return false }
	}
}

function generateFileName(length = 10, upperCase = false) {
	let fileName = 'xmile-'
	let chars = '0123456789abcdefghijklmnoqrstuvwxyz'
	for (let _i = 0; _i < length; _i++) {
		fileName += chooseItem(chars)
	}
	if (upperCase) return fileName.toUpperCase()
	else return fileName
}

exports.default = Telegraph
exports.getBuffer = getBuffer
exports.imgbb = async function (apiKey, file, name = generateFileName()) {
	let data = {
		apiKey: apiKey,
		name: name
	}
	if (Telegraph.isUrl(file)) {
		data.imageUrl = file
	} else if (fs.existsSync(file)) {
		data.imagePath = file
	} else if (file instanceof Buffer) {
		data.base64string = file.toString('base64')
	}
	return await Imgbb(data)
}