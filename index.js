
const express = require('express');
const app = express()
require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

app.use(express.json())

app.use(cors({origin: "*", Credential: true}));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.elvxgab.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const campaignCollection =  client.db("crowdFundingDB").collection("campaigns")
const donatedCollection =  client.db("crowdFundingDB").collection("donates")

async function run() {
  try {
    await client.connect();


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
  res.send('Hello')
})
app.get('/allCampaign', async(req, res ) => {
  const result = await campaignCollection.find().toArray()
  res.send(result)
})

app.get('/runningCampaign', async (req, res) => {

  try {
    const id = req.params;
    console.log(id)
    const options = {
      sort: { time: -1 }

    };
    const result = await campaignCollection.find().sort(options.sort).limit(6).toArray()

    res.send(result)
    
  } catch (error) {
    console.log(error.message)
  }

})
app.get('/myDonated/:email', async(req, res) => {
 try {
  const email = req.params.email;

  const query = { email};
  const result = await donatedCollection.find(query).toArray()
  res.send(result)
  
 } catch (error) {
  console.log(error.message)
 }

})
app.get('/myCampaign/:email', async(req, res) => {
 try {
  const email = req.params.email;

  const query = { email};
  const result = await campaignCollection.find(query).toArray()
  res.send(result)
  
 } catch (error) {
  console.log(error.message)
 }

})
app.get('/details/:id', async (req, res) => {

  try {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await campaignCollection.findOne(query)
    res.send(result)
    
  } catch (error) {
    console.log(error.message)
  }

})

app.get('/updateCampaign/:id', async(req,res) => {
  const id = req.params.id
  const query = {_id: new ObjectId(id)}
  const result = await campaignCollection.findOne(query)
  res.send(result)
})
app.post('/donates', async (req, res) => {

  try {
    const donateData = req.body;
    const result = await donatedCollection.insertOne(donateData)
    res.send(result)
  } catch (error) {
    console.log(error.message)
  }

})



app.post('/campaign', async (req, res) => {
  try {
    
    const campaignData = req.body;
    const result = await campaignCollection.insertOne(campaignData)
    console.log(result)

    res.send(result)

  } catch (error) {
    console.log(error.message)
  }
})


app.patch('/updateCampaign/:id', async (req, res) => {

try {
  const id = req.params.id;

  console.log(id)
  const updateData = req.body;
  console.log(updateData)

  const filter = {_id: new ObjectId(id)}

  const updateDoc = {
    $set: {
      email: updateData.email,
      name: updateData.name,
      title: updateData.title,
      type: updateData.type,
      description: updateData.description,
      minDonation: updateData.minDonation,
      deadline: updateData.deadline,
      image: updateData.image
    },
  };

  const options = { upsert: true };


  const result = await campaignCollection.updateOne(filter, updateDoc)
  console.log(result)
  res.send(result)

} catch (error) {
  console.log(error.message)
}

})


app.delete('/delete/:id', async (req,res) => {

  try {
  
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await campaignCollection.deleteOne(query);
    res.send(result);

  } catch (error) {
    console.log(error.message);
  }

})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})