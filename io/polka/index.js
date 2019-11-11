const polka = require('polka')
const cors = require('cors')
const bodyParser = require('body-parser').json

const {callMethodCtrl} = require('../../controllers')
const PORT = process.env.PORT || 3030



function makeServer(){
  const app = polka()

  // Middleware
  app.use(cors()).use(bodyParser())

  // Routing
  app.post('/api/:methodName', (req, res) => {
    const request = {
      body: req.body,
      params: req.params
    }

    callMethodCtrl(request).then(resp => {
      const {body, status, headers} = resp
      res.statusCode = status
      Object.keys(resp.headers).forEach(h => {
        res.setHeader(h, resp.headers[h])
      })
      res.end(body)
    })
  })

  app.listen(3030, null, null, (err) => {
    if(err) {
      console.log(err)
    }

    console.log("> Listening on port " + PORT)
  })
}

module.exports = makeServer