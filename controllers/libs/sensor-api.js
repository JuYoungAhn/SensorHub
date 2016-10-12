var http = require('http');
var request = require('request');
var async = require('async')
var moment = require('moment')
var SmappeeAPI = require('smappee-nodejs')
var enertalk = require('./my-enertalk')

function SensorAPI(){
  var smappeeDatastreamId = '57f6ec75cc63dbf1787912f6'
  var enertalkDatastreamId = '57f6eeb4cc63dbf1787912fc'
  var smappeeSensorId = '57f5bcc5cc63dbf1787912f2'
  var enertalkSensorId = '57f6ec75cc63dbf1787912f6'

  this.getSensors = function(callback){
    // make request options
    var headers = {
        'Content-Type': 'application/json',
    }
    var options = {
        url: 'http://kistvr.webizing.org/Sensors',
        method: 'GET',
        headers: headers
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          result = JSON.parse(body)
          callback(result)
        }
        else {
          console.log("Fail : "+response.statusCode)
          console.log(body)
        }
    })
  }

  this.getDatastreams = function(callback){
    // make request options
    var headers = {
        'Content-Type': 'application/json',
    }
    var options = {
        url: 'http://kistvr.webizing.org/DataStreams',
        method: 'GET',
        headers: headers
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          result = JSON.parse(body)
          callback(result)
        }
        else {
          console.log("Fail : "+response.statusCode)
          console.log(body)
        }
    })
  }
  this.getObservations = function(callback){
    // make request options
    var headers = {
        'Content-Type': 'application/json',
    }
    var options = {
        url: 'http://kistvr.webizing.org/Observations',
        method: 'GET',
        headers: headers
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          result = JSON.parse(body)
          callback(result)
        }
        else {
          console.log("Fail : "+response.statusCode)
          console.log(body)
        }
    })
  }
  this.getObservedProperties = function(callback){
    // make request options
    var headers = {
        'Content-Type': 'application/json',
    }
    var options = {
        url: 'http://kistvr.webizing.org/ObservedProperties',
        method: 'GET',
        headers: headers
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          result = JSON.parse(body)
          callback(result)
        }
        else {
          console.log("Fail : "+response.statusCode)
          console.log(body)
        }
    })
  }
  this.insertObservation = function(observation, callback){
    var headers = {
        'Content-Type': 'application/json',
    }
    var options = {
        url: 'http://kistvr.webizing.org/Observations',
        method: 'POST',
        headers: headers,
        form : observation
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // result = JSON.parse(body)
          // console.log(JSON.parse(body))
        }
        else {
          console.log("Fail : "+response.statusCode)
          console.log(body)
        }
    })
  }

  this.smappeeLogging = function(smappee, serviceLocationId){
    var locals = {}

    async.series([
        // get energy consumption
        function(callback) {
            var from = moment().subtract(11, 'minute').utc().valueOf() // 현재 timestamp 10분전
            var to = moment().utc().valueOf() // 현재 timestamp
            var aggregation = 1 // 주기 5분
            smappee.getConsumptions(serviceLocationId, aggregation, from, to, function(result){
              console.log("from : "+from)
              console.log("to : "+to)
              console.log(result)
              locals.data = result
              callback()
            })
        },
        // get event
        function(callback){
            from = moment().subtract(5, 'minute').utc().valueOf() // 현재 timestamp 5분전
            var to = moment().add(1, 'minute').utc().valueOf() // 현재 timestamp
            smappee.getEvents(serviceLocationId, "1", from, to, 1000, function(result) {
                console.log(result);
                locals.eventData = result
                callback()
            });
        },
        // convert data format
        function(callback){
            convertSmappeePower(locals.data, function(result){
              console.log(result)
              locals.observation = result
              callback()
            })
        },
        // insert data to webzing platform
        function(callback) {
          if(locals.observation != null){
            new SensorAPI().insertObservation(locals.observation, function(result){
              locals.result = result
              console.log(result)
              callback()
             })
           }
           else {
             callback()
           }
        }
    ], function(err) {
          if (err){
            console.log(err)
            return next(err)
          }
          console.log("smappee datas have logged successfully at : "+moment().utc().valueOf())
    })
  }
  this.enertalkLogging = function(accessToken, uuid){
    var locals = {}

    async.series([
        // get realtime energy consumption
        function(callback) {
            enertalk.getRealtimeUsage(accessToken, uuid, function(result){
              console.log(result)
              locals.data = result
              callback()
            })
        },
        // converty enertalk data
        function(callback){
            convertEnertalk(locals.data, function(result){
              console.log(result)
              locals.observation = result
              callback()
            })
        },
        // insert data to webizing platform
        function(callback) {
          new SensorAPI().insertObservation(locals.observation, function(result){
            locals.result = result
            console.log(locals.result)
            callback()
           })
        }
    ], function(err) {
          if (err) {
            console.log(err)
            return next(err)
          }
          console.log("enertalk observation is logged at : "+locals.data.timestamp)
    })
  }
  /**************************** helper ****************************/
  var convertSmappeePower = function(data, callback){
    if(data.consumptions.length > 0){
      var day = moment(data.consumptions[0].timestamp)
      var resultTime = day.format()
      var result = {
        "@type": "Observation",
        "result": data.consumptions[0].consumption,
        "phenomenonTime": resultTime,
        "resultTime": resultTime,
        "@context": "http://webizing.org",
        "name": "smappeePower",
        "alternateName": "active power",
        "description": "power from smappee",
        "size": {
          "x": 1,
          "y": 1,
          "z": 1,
          "id": 0
        },
        "category": [
          "string"
        ],
        "sameAs": [
          "string"
        ],
        "image": "string",
        "dataStreamsId": smappeeDatastreamId
      }
      callback(result)
    }
    else {
      callback(null)
    }
  }
  var convertEnertalk = function(data, callback){
      var day = moment(data.timestamp)
      var resultTime = day.format()
      var result = {
        "@type": "Observation",
        "phenomenonTime": resultTime,
        "resultTime": resultTime,
        "result": data.activePower/1000.0,
        "@context": "http://webizing.org",
        "name": "enertalkPower",
        "alternateName": "active power",
        "description": "power from enertalk",
        "size": {
          "x": 1,
          "y": 1,
          "z": 1,
          "id": 0
        },
        "category": [
          "string"
        ],
        "sameAs": [
          "string"
        ],
        "image": "string",
        "dataStreamsId": enertalkDatastreamId
      }
      callback(result)
  }
}

sensorAPI = new SensorAPI()
module.exports = sensorAPI;
