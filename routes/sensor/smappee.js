var express = require('express')
var router = express.Router()
var smappeeController = require(process.cwd()+'/controllers/sensor/smappeeController')

router.get('/smappee', smappeeController.login)
router.post('/smappee/login', smappeeController.loginPro)
router.get('/smappee/dashboard', smappeeController.dashboard)
router.get('/smappee/getConsumptions', smappeeController.getConsumptions)
router.get('/smappee/getServiceLocationInfo', smappeeController.getServiceLocationInfo)

module.exports = router
