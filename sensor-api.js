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
}

sensorAPI = new SensorAPI()
module.exports = sensorAPI;
