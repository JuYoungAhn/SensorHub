var enertalk = require(process.cwd()+'/controllers/libs/my-enertalk')

function enertalkController(){
  this.login = function(req, res){
    res.render('sensorhub/enertalk/login')
  }
  this.callback = function(req, res){
    var url = req.url;
    var authCode = url.split("code=")[1];
    res.render('sensorhub/enertalk/callback', {code : authCode})
  }
  this.codeSubmit = function(req, res){
    var code = req.param('code')
    enertalk.getUuid(code, function(accessToken, uuid){
        res.redirect('/enertalk/dashboard?uuid='+uuid+'&accessToken='+accessToken)
    })
  }
  this.userInformation = function(req, res){
    var acceeToken = req.session.enertalk_access_token
    enertalk.userInformation(accessToken, function(result){
      res.send(result)
    })
  }
  this.deviceInformation = function(req, res){
    var acceeToken = req.session.enertalk_access_token
    var uuid = req.session.enertalk_uuid
    enertalk.deviceInformation(accessToken, uuid, function(result){
      res.send(result)
    })
  }
  this.realtimeUsage = function(req, res){
    var acceeToken = req.session.enertalk_access_token
    var uuid = req.session.enertalk_uuid
    enertalk.getRealtimeUsage(acceeToken, uuid, function(result){
        res.send(result)
    })
  }
  this.dashboard = function(req, res){
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
    res.redirect('../sensorhub#enertalk')
  }
}

enertalkController = new enertalkController()
module.exports = enertalkController
