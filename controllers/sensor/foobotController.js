var request = require('request')

function foobotController(){
  this.login = function(req, res){
    res.render('sensorhub/foobot/login')
  }
  this.loginPro = function(req, res){
    // login and redirect to dashboard
    var user_id = req.param('user_id')
    var auth_token = req.param('auth_token')
    var uuid = null

    // make request options
    var headers = {
        'Content-Type': 'application/json',
        'X-API-KEY-TOKEN': auth_token
    }
    var options = {
        url: 'http://api.foobot.io/v2/owner/'+user_id+'/device/',
        method: 'GET',
        headers: headers
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          result = JSON.parse(body)
          console.log(result)

          uuid = result[0].uuid // get uuid

          req.session.foobot_auth_token = auth_token
          req.session.foobot_uuid = uuid
          req.session.foobot_logged_on = true

          // redirect
          res.redirect('/sensorhub#foobot')
        }
        else {
          console.log("Fail : "+response.statusCode)
          console.log(body)
        }
    })
  }
  this.data = function(req, res){
    var uuid = req.param('uuid')
    var auth_token = req.param('auth_token')
    var start = req.param('start')
    var end = req.param('end')
    var average = req.param('average')
    var url = 'http://api.foobot.io/v2/device/'+uuid+'/datapoint/'+start+'/'+end+'/'+average+'/'

    var headers = {
        'Content-Type': 'application/json',
        'X-API-KEY-TOKEN': auth_token
    }
    var options = {
        url: url,
        method: 'GET',
        headers: headers
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          result = JSON.parse(body)
          console.log(result)
          res.render('sensorhub/foobot/data', {result : result})
        }
        else {
          console.log("Fail : "+response.statusCode)
          console.log(body)
        }
    })
  }
  this.dashboard = function(req, res){
    var auth_token = req.session.foobot_auth_token
    var uuid = req.session.foobot_uuid

    if(auth_token == null){
      auth_token = req.param('auth_token')
      uuid = req.param('uuid')

      req.session.foobot_auth_token = auth_token
      req.session.foobot_uuid = uuid
    }

    res.render('sensorhub/foobot/dashboard')
  }
}

foobotController = new foobotController()
module.exports = foobotController
