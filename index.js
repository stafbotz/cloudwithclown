const fs = require('fs-extra');
const { color } = require('./lib/color.js')
const { fetchJson } = require('./lib/fetcher.js')
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

numvisit = 1;
setInterval(() => {
    resvis = fetchJson('https://clownbypsn.herokuapp.com/addons/herokunosleep')
    numvisit++;
    console.log('refresh :' + numvisit);
}, 1000);

app.get('/addons/herokunosleep', function (req, res) {
    res.json({ status: true, thisdown : false, counter: numvisit });
});
app.get('/jsondatabase', function (req, res) {
    res.render('home');
});
app.get('/jsondatabase/v1/register', (req, res) => {
    res.render('register');
});

const crypto = require('crypto');
const users = [
    // This user is added to the array to avoid creating a new user on each restart
];
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};

app.post('/jsondatabase/v1/register', (req, res) => {
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

        fs.mkdirSync('./database/hostdb/' + email);

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

app.get('/jsondatabase/v1/login', (req, res) => {
    res.render('login');
});

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

// This will hold the users and authToken related to users
const authTokens = {};

app.post('/jsondatabase/v1/login', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = getHashedPassword(password);

    const user = users.find(u => {
        return u.email === email && hashedPassword === u.password
    });

    if (user) {
        const authToken = generateAuthToken();

        // Store authentication token
        authTokens[authToken] = user;
        
        // Setting the auth token in cookies
        res.cookie('AuthToken', authToken);

        // Redirect user to the protected page
        res.redirect('/jsondatabase/v1/dashboard');
    } else {
        res.render('login', {
            message: 'Invalid username or password',
            messageClass: 'alert-danger'
        });
    }
});

app.use((req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];
  
    // Inject the user to the request
    req.user = authTokens[authToken];

    next();
});

app.get('/jsondatabase/v1/dashboard', (req, res) => {
    if (req.user) {
        allnamefile = fs.readdirSync('./database/hostdb/' + req.user.email);
        res.render('dashboard', {
            result : allnamefile
        });
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        });
    }
});

app.get('/jsondatabase/v1/create', (req, res) => {
    if (req.user) {
        res.render('create');
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        });
    }
});

app.post('/jsondatabase/v1/create', (req, res) => {
    if (req.user) {
        const { nameFile, contentsFile } = req.body;
        const resultDir = './database/hostdb/' + req.user.email + '/' + nameFile

        if (!nameFile.includes('/')) {
            if (!fs.existsSync(resultDir)) {
                fs.writeFileSync(resultDir, contentsFile);
                res.redirect('/jsondatabase/v1/dashboard');
            } else {
                res.render('create', {
                    message: 'File already exists',
                    messageClass: 'alert-danger'
                });
            }
        } else {
            res.render('create', {
                message: 'Character / not allowed',
                messageClass: 'alert-danger'
            });
       }
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        });
    }
});

app.get('/jsondatabase/v1/delete', (req, res) => {
    if (req.user) {
        const fileToDelete = req.query.chooseFile
        const resultDir = './database/hostdb/' + req.user.email + '/' + fileToDelete

        if (fs.existsSync(resultDir)) {
                fs.unlinkSync(resultDir);
                res.redirect('/jsondatabase/v1/dashboard');
        } else {
                res.redirect('/jsondatabase/v1/dashboard');
      }
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        });
    }
});

app.get('/jsondatabase/v1/write', (req, res) => {
    if (req.user) {
        const fileToWrite = req.query.chooseFile
        const resultDir = './database/hostdb/' + req.user.email + '/' + fileToWrite

        if (fs.existsSync(resultDir)) {
                nameFileValue = fileToWrite;
                contentsFileValue = fs.readFileSync(resultDir, 'utf8');
                res.render('write', {
                    nameFileValue: nameFileValue,
                    contentsFileValue: contentsFileValue
                });
        } else {
                res.redirect('/jsondatabase/v1/dashboard');
      }
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        });
    }
});

app.post('/jsondatabase/v1/write', (req, res) => {
    if (req.user) {
        const { oldNameFile, nameFile, contentsFile } = req.body;
        const oldDir = './database/hostdb/' + req.user.email + '/' + oldNameFile
        const newDir = './database/hostdb/' + req.user.email + '/' + nameFile
        if (!oldNameFile || !nameFile || !fs.existsSync(oldDir) || nameFile.includes('/')) return res.redirect('/jsondatabase/v1/dashboard');
        if ( oldDir != newDir) {
              fs.writeFileSync(oldDir, contentsFile)
              fs.renameSync(oldDir, newDir)
              res.redirect('/jsondatabase/v1/dashboard');
        } else {
            fs.writeFileSync(oldDir, contentsFile)
            res.redirect('/jsondatabase/v1/dashboard');
      }         
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        });
    }
});

app.get('/jsondatabase/v1/logout', function(req, res) {
    cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }
        res.cookie(prop, '', {expires: new Date(0)});
        console.log("user logged out.")
    }
    res.redirect('/jsondatabase/v1/login');
});

module.exports = app
