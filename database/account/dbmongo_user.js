const mongoose= require('mongoose');

mongoose.connect('mongodb+srv://cloudwithclown:ZH5Knz@-#5n6YRT@cloudwithclown.y9f8f.mongodb.net/account?retryWrites=true&w=majority')
.then(() => {
    console.log('connection succes');
})
.catch(err => console.log('err: ' + err));
