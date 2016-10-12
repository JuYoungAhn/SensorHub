var express = require('express')
var router = express.Router()
var enertalkController = require(process.cwd()+'/controllers/sensor/enertalkController')

router.get('/enertalk', enertalkController.login)
router.get('/enertalk/callback', enertalkController.callback)
router.get('/enertalk/codeSubmit', enertalkController.codeSubmit)
router.get('/enertalk/userInformation', enertalkController.userInformation)
router.get('/enertalk/deviceInformation', enertalkController.deviceInformation)
router.get('/enertalk/realtimeUsage', enertalkController.realtimeUsage)
router.get('/enertalk/dashboard', enertalkController.dashboard)

module.exports = router
