const fetch = require('node-fetch');

const addvisitor = () => {
    return fetch('https://clownbypsn.herokuapp.com/api');
}

module.exports = { addvisitor }
