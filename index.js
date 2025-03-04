
const express = require('express');
const app = express()
require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.elvxgab.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const runningCampaignCollection =  client.db("crowdFundingDB").collection("runningCampaigns")

async function run() {
  try {
    await client.connect();


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);



app.get('/runningCampaign', async (req, res) => {

  try {

    const result = await runningCampaignCollection.find().limit(6).toArray()

    res.send(result)
    
  } catch (error) {
    console.log(error.message)
  }

})




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})