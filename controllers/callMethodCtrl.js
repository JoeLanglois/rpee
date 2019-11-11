function makeCallMethodCtrl({callMethod} = {}){
  return function callMethodCtrl(request){
    const {body} = request
    const args = body.args || []
    const methodName = request.params.methodName

    return callMethod(methodName, args).then(resp => {
      const status = resp.status
      const body = JSON.stringify(resp.results)

      return {
        status,
        body,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    })
  }
}

module.exports = makeCallMethodCtrl

