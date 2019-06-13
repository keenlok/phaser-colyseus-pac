const path = require('path')
const express = require('express')
const http = require('http')

const app = express();
const server = http.Server(app);

app.listen(3000, () => {console.log("Listening at 3000")})

app.set('view engine', 'pug')

app.use('/', express.static('dist'))
app.use('/static', express.static('public'))

app.use(require('./routes'))


