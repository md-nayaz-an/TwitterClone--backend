const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://akifcham:PNvcNG0IJUvlJAWT@cluster0.2i2ktdx.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  async function run() {
    try {
    
      await client.connect();
    
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully are connected to MongoDB!");
    
      const postCollection = client.db('database').collection('posts')  //This is post collection
      const userCollection = client.db('database').collection('users')  //This is user collection

        //get
        app.get('/post', async (req, res) => {
            const post = (await postCollection.find().toArray()).reverse();
            res.send(post);
        })
        
        app.get('/user', async (req, res) => {
          const user = await userCollection.find().toArray();
          res.send(user);
        })

         //This is what im trying to figure out boss
        app.get('/getPhone', async (req, res) => { 
          const phonenumber = req.query.phonenumber;
          const user = await userCollection.find({phonenumber:phonenumber}).toArray();
          console.log(user);
          res.send(user);
        })

        app.get('/loggedInUser', async(req, res) => {
          const email = req.query.email;
          const user = await userCollection.find({email:email}).toArray();
          res.send(user);
        })



        app.get('/userPost', async(req, res) => {
          const email = req.query.email;
          const post = (await postCollection.find({email:email}).toArray()).reverse();
          res.send(post);
        })

        //post
        app.post('/post', async (req, res) => {
            const post = req.body;
            console.log(post);
            const result = await postCollection.insertOne(post);
            res.send(result);
        })

        //register
        app.post('/register', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        //patch
        app.patch('/userUpdates/:email', async(req, res) => {
          const filter = req.params;
          const profile = req.body;
          const options = { upsert: true };
          const updateDoc = { $set: profile};
          const result = await userCollection.updateOne(filter, updateDoc, options);
          res.send(result);
        })

    } catch (error){
        console.log(error);
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Twitter')
})

app.listen(port, () => {
  console.log(`Twitter is listening on the port ${port}`)
})