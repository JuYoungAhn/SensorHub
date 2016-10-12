var sensorApi = require(process.cwd()+'/controllers/libs/sensor-api')
var async = require('async')

function sensorThingsController(){
  this.things = function(req, res){
    res.render('sensorhub/sensorthings/things')
  }
  this.sensors = function(req, res){
    sensorApi.getSensors(function(result){
      console.log(result)
      res.render('sensorhub/sensorthings/sensors', {sensors : result})
    })
  }
  this.datastreams = function(req, res){
    sensorApi.getDatastreams(function(result){
      res.render('sensorhub/sensorthings/datastreams', {datastreams : result})
    })
  }
  this.observations = function(req, res){
    var locals = {};
    async.parallel([
        function(callback) {
          sensorApi.getObservations(function(result){
            locals.observations = result
            callback()
          })
        },
        function(callback) {
          sensorApi.getDatastreams(function(result){
            locals.dataStreams = result
            callback()
          })
        }
    ], function(err) {
        if (err) return next(err)
        res.render('sensorhub/sensorthings/observations', locals)
    });
  }
  this.observedProperties = function(req, res){
    sensorApi.getObservedProperties(function(result){
      console.log(result)
      res.render('sensorhub/sensorthings/observed_properties', {observedProperties : result})
    })
  }
  this.datalogging = function(req, res){
    res.render('sensorhub/sensorthings/datalogging')
  }
}

sensorThingsController = new sensorThingsController()
module.exports = sensorThingsController
