const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId;

const app = express()
 app.use(cors())
 app.use(bodyParser.json())
require('dotenv').config()
const port = 5000

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1msfu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("emaJohntwo").collection("products");
  const ordersCollection = client.db("emaJohntwo").collection("oredrs");
 app.post('/addProducts' , (req, res) => {
     const products = req.body;
     productCollection.insertOne(products)
     .then(result => {
        res.send(result.insertedCount)
     })
 })


 app.get('/products' , (req, res) => {
   productCollection.find({})
   .toArray((err , documents)=>{
     res.send(documents)
   })
 })

 app.get('/product/:id' , (req, res) => {
  productCollection.find({_id: ObjectId(req.params.id)})
  .toArray((err , documents)=>{
    res.send(documents[0])
  })
})

app.post('/productsByKeys', (req, res) => {
  const productKeys = req.body;
  productCollection.find({key: { $in: productKeys} })
  .toArray( (err, documents) => {
      res.send(documents);
  })
})

//for order details ----- order collection 
app.post('/addOrder' , (req, res) => {
  const order = req.body;
  ordersCollection.insertOne(order)
  .then(result => {
     res.send(result.insertedCount > 0)
  })
})
console.log('running good');
 
});


app.listen( port)