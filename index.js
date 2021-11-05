var express = require('express'),
    cors = require('cors'),
    secure = require('ssl-express-www');
const PORT = process.env.PORT || 8080 || 5000 || 3000
var { color } = require('./lib/color.js');;
const fs = require('fs-extra');
const { Client } = require ('whatsapp-web.js')

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


const sessionfile = './session.json'
let sessionconfig
if (fs.exitsSync(sessionfile) {
    sessionconfig = require(sessionfile)
}
const client = new Client({ puppeteer: { headless: true }, session: sessionconfig })
client.on('qr', (qr) => {
   qrcode.generate(qr, {small: true})
})
client.on('authenticated', (session) => {
    console.log('Authenticated', session)
    sessionconfig = session
    fs.writeFile(sessionfile, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err)
        }
    })
})
client.on('ready', () => {
   console.log('Client is ready!')
})
client.on('message', msg => {
   if (msg.body == '!ping') {
       msg.reply('pong')
   }
})
client.initialize();



module.exports = app
