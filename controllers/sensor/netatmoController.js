var request = require('request')

function netatmoController(){
  this.login = function(req, res){
    res.render('sensorhub/netatmo/login')
  }
  this.access_token = function(req, res){
    var access_token = null // access_token
    var device_id = req.param('device_id') // device_id

    // make request options
    var headers = {
        'Host': 'api.netatmo.com',
        'Content-Type':     'application/x-www-form-urlencoded',
        'charset': 'UTF-8'
    }
    var options = {
        url: 'https://api.netatmo.com/oauth2/token',
        method: 'POST',
        headers: headers,
        form: {
          'grant_type': 'password',
          'username': req.param('id'), // login id
          'password' : req.param('password'), // login password
          'client_id': req.param('client_id'), // app client_id
          'client_secret': req.param('client_secret'), // app secret
          'redirect_uri' : req.param('redirect_uri'), // redirect_url : dashboard
          'device_id' : req.param('device_id'), // device_id
          'scope' : req.param('scope') // scope
        }
    }

    // request access_token
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          json = JSON.parse(body) // parse data to json
          access_token = json.access_token // get accee_token

          res.render('sensorhub/netatmo/access_token', {access_token : access_token, device_id : device_id})
        }
        else {
          console.log("Fail : "+response.statusCode)
          console.log(body)
        }
    })
  }
  this.dashboard = function(req, res){
    var access_token = req.param('access_token')
    var device_id = req.param('device_id')

    /* set session */
    req.session.netatmo_access_token = access_token
    req.session.netatmo_device_id = device_id
    req.session.netatmo_logged_on = true

    // make request options
    var headers = {
        'Host': 'api.netatmo.com',
        'Content-Type':     'application/x-www-form-urlencoded',
        'charset': 'UTF-8'
    }
    var options = {
        url: 'https://api.netatmo.com/api/getstationsdata',
        method: 'POST',
        headers: headers,
        form: {
          "access_token" : access_token,
          "device_id" : device_id,
          "get_favorites" : false
        }
    }

    // request station data
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          result = JSON.parse(body)

          console.log("Success")
          console.log("Original Data : ")
          console.log(body)

          console.log("Result : ")
          console.log(result)

          console.log("Devices : ")
          console.log(result.body.devices)

          console.log("Modules : ")
          console.log(result.body.devices[0].modules)

          var devices = result.body.devices // send devices info to view page
          req.session.devices = devices

          res.redirect('../sensorhub#netatmo')
        }
        else {
          console.log("Fail : "+response.statusCode)
          console.log(body)
        }
    })
  }
}

netatmoController = new netatmoController()
module.exports = netatmoController
