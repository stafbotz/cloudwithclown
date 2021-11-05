var express = require('express'),
    cors = require('cors'),
    secure = require('ssl-express-www');

const { WAConnection, MessageType, Presence, Mimetype, relayWAMessage, prepareMessageFromContent, GroupSettingChange } = require ('@adiwajshing/baileys');
var { color } = require('./lib/color.js');
const PORT = process.env.PORT || 8080 || 5000 || 3000
const fs = require('fs-extra');
const qrcode =  require('qrcode-terminal');


var mainrouter = require('./routes/main'),
    apirouter = require('./routes/api')

var app = express()
app.enable('trust proxy');
app.set("json spaces",2)
app.use(cors())
app.use(secure)
app.use(express.static("public"))

app.use('/', mainrouter)
app.use('/api', apirouter)

app.listen(PORT, () => {
    console.log(color("Server running on port " + PORT,'green'))
})

module.exports = app
