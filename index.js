var express = require('express'),
    cors = require('cors'),
    secure = require('ssl-express-www');
const PORT = process.env.PORT || 8080 || 5000 || 3000
var { color } = require('./lib/color.js');
const fs = require('fs-extra');
const { WAConnection, MessageType, Presence, Mimetype, GroupSettingChange } = require('@adiwajshing/baileys');

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

function starts() {
	const client = new WAConnection()
	client.logger.level = 'warn'
	
	client.loadAuthInfo('./session.json')
	client.on('connecting', () => {
		console.log(color("Connecting Baileys", 'green')
	})
	client.on('open', () => {
		console.log(color("Connected Baileys", 'green')
	})
	await client.connect({timeoutMs: 30 * 1000})
        fs.writeFileSync('./session.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
        
        client.sendMessage('6283170659182@s.whatsapp.net', 'Hai', MessageType.text)
}

starts()



module.exports = app
