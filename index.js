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

async function starts() {
	const client = new WAConnection()
	client.logger.level = 'warn'
	
	client.loadAuthInfo('./session.json')
	client.on('connecting', () => {
		console.log(color("Connecting Baileys", 'green'))
	})
	client.on('open', () => {
		console.log(color("Connected Baileys", 'green'))
	})
	await client.connect({timeoutMs: 30 * 1000})
        fs.writeFileSync('./session.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
       
      client.on('chat-update', async (mek) => {
            try {
                 if (!mek.hasNewMessage) return
                 mek = mek.messages.all()[0]
                 if (!mek.message) return
		 if (mek.key.fromMe) return 
                 mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
		 const content = JSON.stringify(mek.message)
		 const from = mek.key.remoteJid
		 const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
		 body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
		 budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
	         const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
                 const botNumber = client.user.jid
                 const isGroup = from.endsWith('@g.us')
                 const sender = isGroup ? mek.participant : mek.key.remoteJid
		 pushname = client.contacts[sender] != undefined ? client.contacts[sender].vname || client.contacts[sender].notify : undefined
            
        
                 switch(command) {
                    case 'request':
                       client.sendMessage(from, 'Progress 23%', text)
                    break
                 }


            } catch (e) {
                 console.log('Error : %s', color(e, 'red') 
        }
    })
}

starts()




module.exports = app
