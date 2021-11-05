var express = require('express'),
    cors = require('cors'),
    secure = require('ssl-express-www');

const { 
    WAConnection,
    MessageType,
    Presence,
    MessageOptions,
    Mimetype,
    WALocationMessage,
    WA_MESSAGE_STUB_TYPES,
    ReconnectMode,
    ProxyAgent,
    waChatKey
} = require ('@adiwajshing/baileys');
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

async function starts() {
    const client = new WAConnection()
    client.autoReconnect = ReconnectMode.onConnectionLost
    conn.logger.level = 'warn'
    
    client.on('qr', qr => {
       qrcode.generate(qr, {small: true})
       console.log(color("Scan Qr", 'green'))
    })

    fs.existsSync('./session.json') && client.loadAuthInfo ('./session.json')
    client.on('connecting', () => {
       console.log(color("Connecting", 'green'))
    })
    client.on('open', () => {
       console.log(color("Connected", 'green'))
    })
    await client.connect({timeoutMs: 30 * 1000})
    fs.writeFileSync('./session.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
}

starts().catch (err => console.log("unexpected error: " + err))
   



module.exports = app
