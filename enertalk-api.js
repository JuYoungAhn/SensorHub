var http = require('http');
var request = require('request');
var querystring = require('querystring');
var moment = require('moment');

function EnertalkAPI(settings) {
    var clientId = settings.clientId;
    var clientSecret = settings.clientSecret;

    this.debug = settings.debug || false;

    var thisObject = this;

    /* Get User Information */
    this.userInformation = function(accessToken, callback){
      var options = {
          url: 'https://api.encoredtech.com/1.2/me',
          method: 'GET',
          headers: { 'Authorization' : 'Bearer '+accessToken },
      }
      request(options, function(error, response, body){
        if (!error && response.statusCode == 200) {
            callback(JSON.parse(body))
        }
        else {
          console.log(response.statusCode)
        }
      })
    }

    /* Get Device Information */
    this.deviceInformation = function(accessToken, uuid, callback){
      var options = {
          url: 'https://api.encoredtech.com/1.2/devices/'+uuid,
          method: 'GET',
          headers: { 'Authorization' : 'Bearer '+accessToken },
      }
      request(options, function(error, response, body){
        if (!error && response.statusCode == 200) {
            callback(JSON.parse(body))
        }
        else {
          console.log(response.statusCode)
        }
      })
    }

    /* Get Realtime Usage */
    this.getRealtimeUsage = function(accessToken, uuid, callback){
        var options = {
            url: 'https://api.encoredtech.com/1.2/devices/'+uuid+'/realtimeUsage',
            method: 'GET',
            headers: { 'Authorization' : 'Bearer '+accessToken },
        }
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(JSON.parse(body))
            }
            else {
              console.log(response.statusCode)
            }
        })
    }
    /* Get Access Token and UUID */
    this.getUuid = function(code, callback){
        getAccessToken(code, function(accessToken, refreshToken){
          var optionsUuid = {
              url: 'https://enertalk-auth.encoredtech.com/uuid',
              method: 'GET',
              headers: {'Authorization':'Bearer '+accessToken},
          }
          request(optionsUuid, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  uuid = JSON.parse(body)["uuid"]
                  callback(accessToken, uuid)
              }
              else {
                console.log("Get UUID Fail")
              }
          })
        })
    }
    /* Helper */
    var getAccessToken = function(code, callback){
      var headers = {
          'User-Agent':       'Super Agent/0.0.1',
          'Content-Type':     'application/json'
      }

      var options = {
          url: 'http://enertalk-auth.encoredtech.com/token',
          method: 'POST',
          headers: headers,
          form: {
            'client_id': clientId, // insert your client_id
            "client_secret": clientSecret, // insert your client_secret
            "grant_type" : "authorization_code",
            "code": code
          }
      }
      request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
              accessToken = JSON.parse(body)["access_token"];
              refreshToken = JSON.parse(body)["refresh_token"];
              callback(accessToken, refreshToken)
          }
          else {
            console.log("Get Access Token Fail")
          }
      })
    }
}

module.exports = EnertalkAPI;
