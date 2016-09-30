var http = require('http');
var request = require('request');

function SensorAPI(){
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

  this.convertEnertalk = function(data, callback){
      var result = {
        "@type": "Observation",
        "phenomenonTime": "2016-09-30",
        "result": data.activePower,
        "resultTime": "2016-09-30",
        "@context": "http://webizing.org",
        "name": "string",
        "alternateName": "string",
        "description": "string",
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
        "metadata": {
          "author": "string",
          "created": "2016-09-30",
          "modified": "2016-09-30"
        },
        "dataStreamsId": "string"
      }
      callback(result)
  }
}

sensorAPI = new SensorAPI()
module.exports = sensorAPI;
