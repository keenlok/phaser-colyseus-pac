const express = require('express')
const router = express.Router()

router.get('/', require('./game'))

module.exports = router
