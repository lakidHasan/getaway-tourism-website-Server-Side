const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// Middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ofy9u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
       await client.connect();
       console.log('connected to database');
       const database = client.db('tourism');
       const offersCollection = database.collection('offers');
       
    // Get Api
    app.get('/offers', async(req, res)=>{
        const cursor = offersCollection.find({});
        const offers = await cursor.toArray();
        res.send(offers);
    });

    // Get single Offer 
    app.get('/offers/:id', async(req,res) => {
        const id = req.params.id;
        console.log('getting 1 offer',id);
        const query = {_id: ObjectId(id)};
        const offer = await offersCollection.findOne(query);
        res.json(offer);
    })

    
   //    post API 
    app.post('/offers', async(req, res) =>{
        const offer = req.body;
        console.log("hit the post", offer);
          
        const result = await offersCollection.insertOne(offer);
        console.log(result);
        res.json(result);
    });
    //   Delete Api 
    app.delete('/offer/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await offersCollection.deleteOne(query);
        res.json(result);
    })
    }
    finally{
        // await client.close()
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running tourism server');
});

app.listen(port, () => {
    console.log('running server', port);
});