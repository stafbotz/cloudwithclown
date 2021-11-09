const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://cloudwithclown:ZH5Knz%40-%235n6YRT@cloudwithclown.y9f8f.mongodb.net";
const dbName = 'account';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect((error, client) => {
  if (error) {
     return console.log('connection failed');
  }
  // Select database
  const db = client.db(dbName);

  // Add a single data to the user collection
  db.collection('user').insertOne({firstName: 'alok', lastName: 'ayonima', email: 'aloknima@gmail.com', password: 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg'}, (error, result) => {
    if (error) {
      return console.log('failed to add data');
    }
    console.log(result);
  }
)
});
