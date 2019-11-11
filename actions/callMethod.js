const {api} = require('../domain/index')

const methodNotFoundResponse = methodName => Promise.resolve({
  results: {
    internalError: "MethodNotFound",
    methodName,
  },
  status: 500
})

function makeCallMethod({logErr, isDev, handlers} = {}){
  const callMethod = (methodName, args = []) => {
    const handler = handlers[methodName]
    if(!handler) return methodNotFoundResponse(methodName)
  
    // Call the handler
    return handler(...args).then(results => {
      return {status: 200, results}
    }).catch(err => {
      logErr(err)
      return {status: 500, results: isDev ? {
        name: err.name,
        message: err.message
      }: {error: "An unexpected has occured."}}
    })
  }

  return callMethod
}


const callMethod = makeCallMethod({handlers: api, logErr: console.log, isDev: process.env.NODE_ENV !== 'production'})

module.exports = {
  callMethod
}