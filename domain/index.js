const parseFunction = require('parse-function');
const parser = parseFunction({ecmaVersion: 2017})
const parseArgs = handler => {
  let res = parser.parse(handler)
  return res.args
}

function makeApi({parseFunctionArgs} = {}){
  const api = new Proxy({}, {
    set(handlers, methodName, handler){
      handlers[methodName] = handler

      // Put the arguments as a property of the function
      const args = parseFunctionArgs(handler)
      handlers[methodName].args = args
    }
  })

  return api
}

function makeEndpoints({api} = {}){
  return function endpoints(){
    return Object.keys(api)
      .map(methodName => ({
        name: methodName,
        internal: api[methodName].internal || false,
        args: api[methodName].args
      })) 
  }
}


const api = makeApi({parseFunctionArgs: parseArgs})
const endpoints = makeEndpoints({api})

module.exports = {
  api,
  endpoints
}