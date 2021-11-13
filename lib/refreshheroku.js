const fetch = require('node-fetch');

const addvisitor = () => {
    return fetch('https://clownbypsn.herokuapp.com/addons/herokunosleep');
}

module.exports = { addvisitor }

