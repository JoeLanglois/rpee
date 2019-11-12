const polka = require('polka')
const cors = require('cors')
const bodyParser = require('body-parser').json
const static = require('serve-static')
const path = require('path')

const ISDEV = process.env.NODE_ENV !== 'production'

const {callMethodCtrl} = require('../../controllers')

function makeServer(){
  const app = polka()

  // Middleware
  app.use(cors()).use(bodyParser())

  // Routing
  if(ISDEV) {
    app.use(static(path.join(__dirname, 'client')))
  }

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

  return app
}

module.exports = makeServer