/**
    KIST IMRC SensorHub App
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
var smappee = null
var async = require('async')
var schedule = require('node-schedule')
var sensorApi = require(process.cwd()+'/controllers/libs/sensor-api')

app.locals.pretty = true
app.set('view engine', 'jade')
app.set('views', './views')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(session({secret: '1234567890QWERTY'}))
app.use(function(req,res,next){
    /* session을 set안해도 view에서 사용할 수 있게 하는 코드  */
    session = req.session
    res.locals.session = req.session
    loggingStarted = true
    next()
})

app.use(require('./routes'))

var session = null // local session variable
var loggingStarted = false

var j = schedule.scheduleJob(' */1 * * * *', function(){
    if(loggingStarted){
      if("smappee_logged_on" in session){
        sensorApi.smappeeLogging(new SmappeeAPI({
            debug: false,
            clientId: "anjuyeong",
            clientSecret: "tAdAAd9A2p",
            username: 'juyoungahn',
            password: 'a4809804'
        }), session.smappee_service_location_id)
      }
      if("enertalk_logged_on" in session){
        sensorApi.enertalkLogging(session.enertalk_access_token, session.enertalk_uuid)
      }
    }
})

app.listen(3000, function(){
    console.log('Conneted 3000 port!')
})
