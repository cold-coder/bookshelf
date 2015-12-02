var dbook = require('../core/dbook')
var assert = require('assert')

describe('Test dbook class', function () {
	describe('Test Name', function (){
		it('name should be 穆斯林的葬礼', function (done) {
			dbook('9787530212233', function (err, book) {
				if (err) throw err
				assert.equal("穆斯林的葬礼", book.name)
				assert.equal("霍达", book.author)
				done()
			})
		})
	})

	describe('Test Author', function (){
		it('author should be 吴军', function (done) {
			dbook('9787115377098', function (err, book) {
				if (err) throw err
				assert.equal("吴军", book.author)
				done()
			})
		})
	})
})