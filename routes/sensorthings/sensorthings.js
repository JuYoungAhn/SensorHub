var express = require('express')
var router = express.Router()
var sensorThingsController = require(process.cwd()+'/controllers/sensorthings/sensorThingsController')

router.get('/sensorthings/things', sensorThingsController.things)
router.get('/sensorthings/sensors', sensorThingsController.sensors)
router.get('/sensorthings/datastreams', sensorThingsController.datastreams)
router.get('/sensorthings/observations', sensorThingsController.observations)
router.get('/sensorthings/observedProperties', sensorThingsController.observedProperties)
router.get('/sensorthings/datalogging', sensorThingsController.datalogging)

module.exports = router
