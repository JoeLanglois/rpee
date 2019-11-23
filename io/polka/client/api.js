/*
  Dreamcode API
  const api = makeApi({fetch: window.fetch})
  
  api.getUser('some-user').then(user => {

  })
*/ 

function makeApi({fetch, endpoint} = {}){
  const endpoints = `${endpoint}/api/`
  let ctxHandlers = []

  function ctx(handler){
    ctxHandlers.push(handler)
  }

  return new Proxy({ctx}, {
    get(target, methodName){
      if(methodName === 'ctx') return target.ctx
      
      return function(){
        const args = Array.from(arguments)
        const ctx = ctxHandlers.reduce((acc, h) => {
          return Object.assign(acc, h())
        }, {})
        const url = endpoints + methodName

        return fetch(url, {
          method: 'POST',
          body: JSON.stringify({
            ctx,
            args
          }),
          headers: {
            'Content-type': 'application/json'
          }
        }).then(resp => resp.json())
      }
    }
  })
}

window.api = makeApi({fetch: window.fetch, endpoint: 'http://localhost:3030'})