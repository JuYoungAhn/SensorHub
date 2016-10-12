var express = require('express')
var router = express.Router()
var foobotController = require(process.cwd()+'/controllers/sensor/foobotController')

router.get('/foobot', foobotController.login)
router.post('/foobot/login', foobotController.loginPro)
router.get('/foobot/dashboard', foobotController.dashboard)
router.post('/foobot/data', foobotController.data)

module.exports = router
