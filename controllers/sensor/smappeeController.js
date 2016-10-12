var smappee = null
var SmappeeAPI = require('smappee-nodejs')

function smappeeController(){
  this.login = function(req, res){
    res.render('sensorhub/smappee/login')
  }
  this.loginPro = function(req, res){
    smappee = new SmappeeAPI({
        debug: false,
        clientId: "anjuyeong",
        clientSecret: "tAdAAd9A2p",
        username: req.param('username'),
        password: req.param('password')
    });
    req.session.smappee = smappee
    smappee.getServiceLocations(function(output) {
      var serviceLocationId = output.serviceLocations[0].serviceLocationId; // get location id
      req.session.smappee_service_location_id = serviceLocationId // 세션 생성
      req.session.smappee_logged_on = true // smappee logged on flag
      res.redirect('/sensorhub#smappee')
    })
  }
  this.dashboard = function(req, res){
    var serviceLocationId = req.param('serviceLocationId')
    res.render('sensorhub/smappee/dashboard', {serviceLocationId : serviceLocationId})
  }
  this.getConsumptions = function(req, res){
    var serviceLocationId = req.param('serviceLocationId')
    var from = req.param('from')
    var to = req.param('to')
    var aggregation = req.param('aggregation')
    smappee.getConsumptions(serviceLocationId, aggregation, from, to, function(result){
      res.send(result)
    })
  }
  this.getServiceLocationInfo = function(req, res){
    var serviceLocationId = req.param('serviceLocationId')
    smappee.getServiceLocationInfo(serviceLocationId, function(result){
      res.send(result)
    })
  }
}

smappeeController = new smappeeController()
module.exports = smappeeController
