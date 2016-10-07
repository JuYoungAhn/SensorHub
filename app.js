/**
    KIST IMRC SensorHub App
    https://github.com/JuYoungAhn
*/
var express = require('express')
var http = require('http');
var url = require('url')
var request = require('request')
var app = express()
var bodyParser = require('body-parser')
var multer = require('multer')
var moment = require('moment')
var querystring = require('querystring')
var session = require('express-session')
var SmappeeAPI = require('smappee-nodejs')
var moment = require('moment')
var enertalk = require('./my-enertalk')
var sensorApi = require('./sensor-api')
var smappee = null
var async = require('async')
var schedule = require('node-schedule')

// Load jsdom, and create a window.
var jsdom = require("jsdom").jsdom
var doc = jsdom()
var window = doc.defaultView
// Load jQuery with the simulated jsdom window.
$ = require('jquery')(window)

app.locals.pretty = true
app.set('view engine', 'jade')
app.set('views', './views')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(session({secret: '1234567890QWERTY'}))

var session = null
var enertalkLoggedOn = false
var netatmoLoggedOn = false
var smappeeLoggedOn = false
var foobotLoggedOn = false
var loggingStarted = false

/* data logging */
var j = schedule.scheduleJob(' */5 * * * *', function(){
    if(loggingStarted){
      // smappee 로그인이 완료되었을 때만 실행
      if("smappee_logged_on" in session){
        sensorApi.smappeeLogging(smappee, session.smappee_service_location_id)
      }
      if("enertalk_logged_on" in session){
        sensorApi.enertalkLogging(session.enertalk_access_token, session.enertalk_uuid)
      }
    }
});

app.use(function(req,res,next){
    /* session을 pass하지 않고도 view에서 사용할 수 있게 하는 코드  */
    session = req.session
    res.locals.session = req.session
    loggingStarted = true
    next()
})

// Main Page
app.get('/', function(req, res){
  res.render('index')
})

/**
    Netatmo
        Reference :
        https://dev.netatmo.com/dev/resources/technical/reference/weatherstation/getstationsdata
*/
app.get('/netatmo', function(req, res){
  res.render('netatmo/login')
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
        json = JSON.parse(body) // parse data to json
        access_token = json.access_token // get accee_token

        res.render('netatmo/access_token', {access_token : access_token, device_id : device_id})
      }
      else {
        console.log("Fail : "+response.statusCode)
        console.log(body)
      }
  })
})
app.get('/netatmo/dashboard', function(req, res){
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
    res.render('enertalk/login');
});
// 에너톡 로그인 완료후 callback function
app.get('/callback', function(req, res){
  var url = req.url;
  var authCode = url.split("code=")[1];
  res.render('enertalk/callback', {code : authCode})
})
// 코드로부터 Access Token을 받아옴
app.get('/enertalk/codeSubmit', function(req, res){
  var code = req.param('code')
  enertalk.getUuid(code, function(accessToken, uuid){
      res.redirect('/enertalk/dashboard?uuid='+uuid+'&accessToken='+accessToken)
  })
})
app.get('/enertalk/userInformation', function(req, res){
  var acceeToken = req.session.enertalk_access_token
  enertalk.userInformation(accessToken, function(result){
    res.send(result)
  })
})
app.get('/enertalk/deviceInformation', function(req, res){
  var acceeToken = req.session.enertalk_access_token
  var uuid = req.session.enertalk_uuid
  enertalk.deviceInformation(accessToken, uuid, function(result){
    res.send(result)
  })
})
app.get('/enertalk/realtimeUsage', function(req, res){
  var acceeToken = req.session.enertalk_access_token
  var uuid = req.session.enertalk_uuid
  enertalk.getRealtimeUsage(acceeToken, uuid, function(result){
      res.send(result)
  })
})
app.get('/enertalk/dashboard', function(req, res){
  var accessToken = req.session.enertalk_access_token
  var uuid = req.session.enertalk_uuid
  req.session.enertalk_logged_on = true

  /* 세션이 없으면 생성 */
  if(accessToken == null){
    accessToken = req.param('accessToken')
    uuid = req.param('uuid')
    req.session.enertalk_access_token = accessToken
    req.session.enertalk_uuid = uuid
  }
  res.redirect('../#enertalk')
})
/**
  Foobot api
  Reference : http://api.foobot.io/apidoc/index.html
*/
app.get('/foobot', function(req, res){
  res.render('foobot/login')
})
app.post('/foobot/login', function(req, res){
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
        res.redirect('/#foobot')
      }
      else {
        console.log("Fail : "+response.statusCode)
        console.log(body)
      }
  })
})
app.get('/foobot/dashboard', function(req, res){
  var auth_token = req.session.foobot_auth_token
  var uuid = req.session.foobot_uuid

  if(auth_token == null){
    auth_token = req.param('auth_token')
    uuid = req.param('uuid')

    req.session.foobot_auth_token = auth_token
    req.session.foobot_uuid = uuid
  }

  res.render('foobot/dashboard')
})
app.post('/foobot/data', function(req, res){
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
        res.render('foobot/data', {result : result})
      }
      else {
        console.log("Fail : "+response.statusCode)
        console.log(body)
      }
  })
})
/**
  smappee api
  reference : https://smappee.atlassian.net/wiki/display/DEVAPI/API+Methods
  depend on : https://www.npmjs.com/package/smappee-nodejs
*/
app.get('/smappee', function(req, res){
  res.render('smappee/login')
})
app.post('/smappee/login', function(req, res){
  smappee = new SmappeeAPI({
      debug: false,
      clientId: "anjuyeong",
      clientSecret: "tAdAAd9A2p",
      username: req.param('username'),
      password: req.param('password')
  });
  smappee.getServiceLocations(function(output) {
    var serviceLocationId = output.serviceLocations[0].serviceLocationId; // get location id
    req.session.smappee_service_location_id = serviceLocationId // 세션 생성
    req.session.smappee_logged_on = true // smappee logged on flag
    res.redirect('/#smappee')
  })
})
app.get('/smappee/dashboard', function(req, res){
  var serviceLocationId = req.param('serviceLocationId')
  res.render('smappee/dashboard', {serviceLocationId : serviceLocationId})
})
app.get('/smappee/getConsumptions', function(req, res){
  var serviceLocationId = req.param('serviceLocationId')
  var from = req.param('from')
  var to = req.param('to')
  var aggregation = req.param('aggregation')
  smappee.getConsumptions(serviceLocationId, aggregation, from, to, function(result){
    res.send(result)
  })
})
app.get('/smappee/getServiceLocationInfo', function(req, res){
  var serviceLocationId = req.param('serviceLocationId')
  smappee.getServiceLocationInfo(serviceLocationId, function(result){
    res.send(result)
  })
})

/*********************** SensorThing API ***********************/
app.get('/sensorthings/things', function(req, res){
  res.render('sensorthings/things')
})
app.get('/sensorthings/sensors', function(req, res){
  sensorApi.getSensors(function(result){
    console.log(result)
    res.render('sensorthings/sensors', {sensors : result})
  })
})
app.get('/sensorthings/datastreams', function(req, res){
  sensorApi.getDatastreams(function(result){
    res.render('sensorthings/datastreams', {datastreams : result})
  })
})
app.get('/sensorthings/observations', function(req, res, next){
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
      if (err) return next(err);
      res.render('sensorthings/observations', locals)
  });
})
app.get('/sensorthings/observedProperties', function(req, res){
  sensorApi.getObservedProperties(function(result){
    console.log(result)
    res.render('sensorthings/observed_properties', {observedProperties : result})
  })
})
app.get('/sensorthings/dataLogging', function(req, res){
  res.render('sensorthings/datalogging')
})
app.listen(3000, function(){
    console.log('Conneted 3000 port!')
})
