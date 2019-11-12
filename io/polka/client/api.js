/*
  Dreamcode API
  const api = makeApi({fetch: window.fetch})
  
  api.getUser('some-user').then(user => {

  })
*/ 

function makeApi({fetch, endpoint} = {}){
  const endpoints = `${endpoint}/api/`

  return new Proxy({}, {
    get(_, methodName){
      return function(){
        const args = Array.from(arguments)
        const url = endpoints + methodName

        return fetch(url, {
          method: 'POST',
          body: JSON.stringify({args}),
          headers: {
            'Content-type': 'application/json'
          }
        }).then(resp => resp.json())
      }
    }
  })
}

window.api = makeApi({fetch: window.fetch, endpoint: 'http://localhost:3030'})