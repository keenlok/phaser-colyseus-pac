const path = require('path')
const express = require('express')
const http = require('http')

const app = express();
const server = http.Server(app);

app.listen(3000, () => {console.log("Listening at 3000")})

app.use('/static', express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../dist/index.html'))
})

app.get('/client/client.js', (req,res) => {
  res.sendFile(path.join(__dirname, '../../../dist/client/client.js'))
})


