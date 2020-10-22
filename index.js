const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u2qyt.mongodb.net/todolist?retryWrites=true&w=majority`;
const port = 5000

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("todolist").collection("worklist");
  app.post('/addtolist', (req, res) => {
      const work = req.body;
      collection.insertOne(work)
      .then(result =>{
          res.send(result.insertedCount > 0);
      })
  })
  app.get('/work', (req, res)=>{
      collection.find({email: req.query.email})
      .toArray((err, documents)=>{
          res.send(documents);
      })
  })
  app.delete('/delete/:id', (req, res)=>{
      collection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result =>{
          res.send(result.deletedCount > 0);
    })
  })
  
});

app.get('/', (req, res) => {
  res.send('Hello server bhai')
})

app.listen(process.env.PORT || port)