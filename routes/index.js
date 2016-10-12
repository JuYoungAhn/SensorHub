var express = require('express')
var router = express.Router()
var smappee = require('./sensor/smappee')
var enertalk = require('./sensor/enertalk')
var netatmo = require('./sensor/netatmo')
var foobot = require('./sensor/foobot')
var sensorthings = require('./sensorthings/sensorthings')

router.use(smappee)
router.use(enertalk)
router.use(netatmo)
router.use(foobot)
router.use(sensorthings)

// Main Page
router.get('/', function(req, res){
  res.render('index')
})
router.get('/sensorhub', function(req, res){
  res.render('sensorhub/index')
})

module.exports = router
