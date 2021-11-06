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
    client.logger.level = 'warn'
    
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
    
    
   client.on('chat-update', async (mek) => {
       try {
            if (!mek.hasNewMessage) return
            mek = mek.messages.all()[0]
	    if (!mek.message) return
	    mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
	    const content = JSON.stringify(mek.message)
	    const from = mek.key.remoteJid
	    const type = Object.keys(mek.message)[0]
	    const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
	    body = (type === 'conversation' && mek.message.conversation.startsWith('')) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
	    budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
	    const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
            const args = body.trim().split(/ +/).slice(1)
	    const q = args.join(' ')
	    const botNumber = client.user.jid
            const isGroup = from.endsWith('@g.us')
	    const sender = isGroup ? mek.participant : mek.key.remoteJid
	    const totalchat = await client.chats.all()
	    pushname = client.contacts[sender] != undefined ? client.contacts[sender].vname || client.contacts[sender].notify : undefined
      

            switch(command) {
               case 'test':
client.sendMessage(from, 'Aktif', text)
               break
            }

     } catch (e) {
       console.log('Error : %s', color(e, 'red'))
   }
 })
}

starts().catch (err => console.log("unexpected error: " + err))
   
module.exports = app
