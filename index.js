const fs = require('fs-extra');
const { color } = require('./lib/color.js')
const express = require('express')
const cors = require('cors')
const secure = require('ssl-express-www')
const exphbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 8080 || 5000 || 3000
const mainrouter = require('./routes/main')
const apirouter = require('./routes/api')
const dblocalrouter = require('./routes/dblocal')

const app = express()
app.enable('trust proxy')
app.set("json spaces", 2)
app.use(cors())
app.use(secure)
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.engine('hbs', exphbs({extname: '.hbs'}))

app.set('view engine', 'hbs')
app.use('/', mainrouter)
app.use('/api', apirouter)
app.use('/jsondatabase', dblocalrouter)
app.listen(PORT, () => {
    console.log(color("Server running on port " + PORT, 'green'))
})

module.exports = app
