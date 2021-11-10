const mongoose= require('mongoose');

mongoose.connect('mongodb://cloudwithclown:ZH5Knz@-#5n6YRT@cloudwithclown-shard-00-00.y9f8f.mongodb.net:27017/account?retryWrites=true&w=majority')
.then(() => {
    console.log('Connection succes');
})
.catch(err => console.log('Error: ' + err));
