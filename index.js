const {api, endpoints} = require('./domain/index')
const makeServer = require('./io/polka')

api.getEndpoints = _ => endpoints()
api.getEndpoints.internal = true

module.exports = {api, makeServer}
