const express = require('express');
const cors=require('cors')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express()
const port=process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
   res.send('My code no rund YYYYYYYYYYYYYY')
})

const uri = "mongodb+srv://admin:admin@cluster0.g9i8u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("asadul");
    const asadulCollection = database.collection("users");

    app.get('/users',async(req,res)=>{
      const users=asadulCollection.find();
      const result= await users.toArray()
      res.send(result)
    })
    app.get('/users/:id',async(req,res)=>{
      const id=req.params.id;
      const qurey= {_id: new ObjectId (id)}
      const users= await asadulCollection.findOne(qurey)
      res.send(users)
    })
    app.post('/users', async(req,res)=>{
      const user=req.body;
      console.log('lsdlasdlkf',user);
      const result= await asadulCollection.insertOne(user)
      res.send(result)
    })
    app.put('/users/:id',async(req,res)=>{
      const id =req.params.id;
      const UsersUP=req.body;
      console.log('alsdklf',UsersUP,id);

      const filter = { _id:new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name:UsersUP.name,
          email:UsersUP.email
        }
      }
      const result=await asadulCollection.updateOne(filter,updateDoc,options)
      res.send(result)
    })
    app.delete('/users/:id',async(req,res)=>{
      const id=req.params.id;
      console.log('removed id ', id);
      const qurey={_id: new ObjectId(id)}
      const result= await asadulCollection.deleteOne(qurey)
      res.send(result)
    })


    app.listen(port,()=>{
      console.log(`my port${port}`);
   })
   
  } catch (err) {
    console.log(err);
  }
}
run().catch(console.dir);
