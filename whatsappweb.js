const fs = require('fs-extra');
const { Client } = require ('whatsapp-web.js');

const sessionfile = './session.json';
let sessionconfig;
if (fs.exitsSync(sessionfile)) {
    sessionconfig = require(sessionfile);
}
const client = new Client({ puppeteer: { headless: true }, session: sessionconfig });
client.on('qr', (qr) => {
   qrcode.generate(qr, {small: true});
})
client.on('authenticated', (session) => {
    console.log('Authenticated', session);
    sessionconfig = session;
    fs.writeFile(sessionfile, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    })
})
client.on('ready', () => {
   console.log('Client is ready!');
})
client.on('message', msg => {
   if (msg.body == '!ping') {
       msg.reply('pong');
   }
})
client.initialize();
