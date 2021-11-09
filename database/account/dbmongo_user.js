const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://cloudwithclown:ZH5Knz%40-%235n6YRT@cloudwithclown.y9f8f.mongodb.net";
   
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect((error, client) => {
  if (error) {
     return console.log('connection failed');
  }
  console.log('connection successful');
});
