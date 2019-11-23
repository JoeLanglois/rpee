const {api, endpoints} = require('./domain/index')
const makeServer = require('./io/polka')

api.getEndpoints = () => endpoints()
api.getEndpoints.internal = true

api.createUser = async (userData) => {
  if(!userData) {
    return {
      error: "Invalid user data"
    }
  }

  if(!userData.name) {
    return {
      error: "Invalid name"
    }
  }

  return {
    id: Date.now(),
    name: userData.name
  }
}

api.echoContext = async (ctx) => {
  return ctx
}

makeServer().listen(3030)
