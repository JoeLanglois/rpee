const {callMethod} = require('../actions/callMethod')
const makeCallMethodCtrl = require('./callMethodCtrl')

module.exports = {
  callMethodCtrl: makeCallMethodCtrl({callMethod})
}