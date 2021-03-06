__path = process.cwd()

var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(__path + '/views/home.html')
})
router.get('/api', (req, res) => {
    res.sendFile(__path + '/views/index.html')
})
router.get('/meet', (req, res) => {
    res.sendFile(__path + '/views/meet.html')
})
router.get('/api/news', (req, res) => {
    res.redirect('https://raw.githubusercontent.com/Zhirrr/My-SQL-Results/main/Berita.json')
})


module.exports = router
