/**
    By JuYoungAhn
    Contact
    https://github.com/JuYoungAhn
*/
var express = require('express');
var http = require('http');
var url = require('url')
var request = require('request')
var app = express();
var bodyParser = require('body-parser')
var multer = require('multer');
var moment = require('moment');
var querystring = require('querystring');
var path = require("path");
var session = require('express-session')

app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}))
app.use(session({secret: '1234567890QWERTY'}));

/* session을 pass하지 않고도 view에서 사용할 수 있게 하는 코드  */
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

// Main Page
app.get('/', function(req, res){
  res.render('index')
})

/**
    Netatmo
        Reference :
        https://dev.netatmo.com/dev/resources/technical/reference/weatherstation/getstationsdata
*/

/**
    Get Access Token From User Information
*/
app.get('/netatmo', function(req, res){
  req.session.test = 'test'
  res.render('netatmo', {session : req.session})
})
app.get('/netatmo/access_token', function(req, res){
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
        console.log("Success")
        json = JSON.parse(body) // parse data to json
        access_token = json.access_token // get accee_token
        res.render('netatmo_access_token', {access_token : access_token, device_id : device_id})
      }
      else {
        console.log("Fail : "+response.statusCode)
        console.log(body)
      }
  })
})
app.get('/netatmo/dashboard', function(req, res){
  var access_token = req.session.netatmo_access_token
  var device_id = req.session.netatmo_device_id

  // 세션 없을 때
  if(access_token == null){
    // get parameter를 세션으로
    access_token = req.param('access_token')
    device_id = req.param('device_id')
    req.session.netatmo_access_token = access_token
    req.session.netatmo_device_id = device_id
  }

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

        var devices = result.body.devices // send devices info to view page
        req.session.devices = devices

        res.redirect('../#netatmo')
      }
      else {
        console.log("Fail : "+response.statusCode)
        console.log(body)
      }
  })
})

/**
    Enertalk
      Reference :
      https://developer.encoredtech.com/
*/
app.get('/enertalk', function(req, res){
    res.render('enertalk');
});
// 에너톡 로그인 완료후 callback function
app.get('/callback', function(req, res){
  var url = req.url;
  var authCode = url.split("code=")[1];
  res.render('enertalk_callback', {code : authCode})
})
// 코드로부터 Access Token을 받아옴
app.get('/enertalk/codeSubmit', function(req, res){
  var accessToken = null;
  var refreshToken = null;
  var headersUuid = {}
  var uuid = null;
  var code = req.param('code')

  // Get Access Token from Code
  function getAccessToken(code, callback){
    var headers = {
        'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/json'
    }

    var options = {
        url: 'http://enertalk-auth.encoredtech.com/token',
        method: 'POST',
        headers: headers,
        form: {
          'client_id': 'ank5MzYzMEBuYXZlci5jb21faW1yYw==', // insert your client_id
          "client_secret": "x410y4ls6xz80w4zh66l4th3gk7f29z761d13d6", // insert your client_secret
          "grant_type" : "authorization_code",
          "code": code
        }
    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log("Get Access Token")
            console.log("Good")
            accessToken = JSON.parse(body)["access_token"];
            refreshToken = JSON.parse(body)["refresh_token"];
            headersUuid = {'Authorization':'Bearer '+accessToken}
            callback();
        }
        else {
          console.log("Get Access Token")
          console.log("Fail")
        }
    })
  }

  // Get Access Token and Get UUID via callback function */
  getAccessToken(code, function(){
    var optionsUuid = {
        url: 'https://enertalk-auth.encoredtech.com/uuid',
        method: 'GET',
        headers: headersUuid,
    }

    request(optionsUuid, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Get UUID")
            console.log("good")
            uuid = JSON.parse(body)["uuid"]
            console.log("uuid : "+uuid)
            res.redirect('/enertalk/dashboard?uuid='+uuid+'&accessToken='+accessToken)
        }
        else {
          console.log("Get UUID")
          console.log("fail")
        }
    })
  })
})
app.get('/enertalk/realtimeUsage', function(req, res){
  var accessToken = req.param('accessToken')
  var uuid = req.param('uuid')

  var options = {
      url: 'https://api.encoredtech.com/1.2/devices/'+uuid+'/realtimeUsage',
      method: 'GET',
      headers: { 'Authorization' : 'Bearer '+accessToken },
  }

  console.log(options)

  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log("Good")
      }
      else {
        console.log(response.statusCode)
      }
  })
})
app.get('/enertalk/dashboard', function(req, res){
  var accessToken = req.session.enertalk_access_token
  var uuid = req.session.enertalk_uuid

  // 세션이 없으면 생성
  if(accessToken == null){
    accessToken = req.param('accessToken')
    uuid = req.param('uuid')
    req.session.enertalk_access_token = accessToken
    req.session.enertalk_uuid = uuid
  }

  res.redirect('../#enertalk')
})

app.get('/foobot', function(req, res){
  // get parameter
  user_id = 'jy93630@gmail.com'
  password = 'a4809804'

  // make request options
  var headers = {
      'Content-Type': 'application/json',
      'X-API-KEY-TOKEN': 'eyJhbGciOiJIUzI1NiJ9.eyJncmFudGVlIjoiank5MzYzMEBnbWFpbC5jb20iLCJpYXQiOjE0NzI3Nzc1MzIsInZhbGlkaXR5IjotMSwianRpIjoiOTg2ZjYyNGUtZWVlOC00MmEzLTg3ODItNmIyMzA4ZWExYjRmIiwicGVybWlzc2lvbnMiOlsidXNlcjpyZWFkIiwiZGV2aWNlOnJlYWQiXSwicXVvdGEiOjIwMCwicmF0ZUxpbWl0Ijo1fQ.8Kp-xFMNC_h9-iPAwkqmUFnwkXEOfL_u-8YQicE0gX0'
  }
  var options = {
      url: 'http://api.foobot.io/v2/user/'+user_id+'/login/',
      method: 'POST',
      headers: headers,
      form: {
        "password" : password,
      }
  }

  // request station data
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        result = JSON.parse(body)
        console.log(result)
      }
      else {
        console.log("Fail : "+response.statusCode)
        console.log(body)
      }
  })
})

app.listen(3000, function(){
    console.log('Conneted 3000 port!')
})
