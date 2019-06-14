const express = require('express')
const router = express.Router()

router.get('/', require('./home'))
router.get('/game', require('./game'))

module.exports = router
