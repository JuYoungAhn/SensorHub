var express = require('express')
var router = express.Router()
var netatmoController = require(process.cwd()+'/controllers/sensor/netatmoController')

router.get('/netatmo', netatmoController.login)
router.get('/netatmo/access_token', netatmoController.access_token)
router.get('/netatmo/dashboard', netatmoController.dashboard)

module.exports = router
