const {api} = require('./domain/index')
const makeServer = require('./io/polka')

module.exports = {api, makeServer}