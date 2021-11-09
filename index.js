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
app.listen(PORT, () => {
    console.log(color("Server running on port " + PORT, 'green'))
})

app.get('/jsondatabase', function (req, res) {
    res.render('home');
});
app.get('/jsondatabase/register', (req, res) => {
    res.render('register');
});

const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};

const users = [
    // This user is added to the array to avoid creating a new user on each restart
    {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com',
        // This is the SHA256 hash for value of `password`
        password: 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg='
    }
];

app.post('/register', (req, res) => {
    const { email, firstName, lastName, password, confirmPassword } = req.body;

    // Check if the password and confirm password fields match
    if (password === confirmPassword) {

        // Check if user with the same email is also registered
        if (users.find(user => user.email === email)) {

            res.render('register', {
                message: 'User already registered.',
                messageClass: 'alert-danger'
            });

            return;
        }

        const hashedPassword = getHashedPassword(password);

        // Store user into the database if you are using one
        users.push({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        res.render('login', {
            message: 'Registration Complete. Please login to continue.',
            messageClass: 'alert-success'
        });
    } else {
        res.render('register', {
            message: 'Password does not match.',
            messageClass: 'alert-danger'
        });
    }
});

module.exports = app
