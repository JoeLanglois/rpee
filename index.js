const {api, endpoints} = require('./domain/index')
const makeServer = require('./io/polka')

api.getEndpoints = _ => endpoints()
api.getEndpoints.internal = true

//api.getUser = userId => ({id: userId, name: "jdodjiwoa"})

module.exports = {api, makeServer}

makeServer().listen(3030)