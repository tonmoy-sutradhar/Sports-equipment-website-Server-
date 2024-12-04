require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cjt8m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const sportsCollection = client
      .db("Sports-equipment")
      .collection("equipment");
    const usersCollection = client.db("Sports-equipment").collection("users");

    // 2. Get all data from Database
    app.get("/equipment", async (req, res) => {
      const cursor = sportsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
      console.log(cursor);
    });

    // 3. Get any one specific equipment
    app.get("/equipment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await sportsCollection.findOne(query);
      res.send(result);
    });

    // 1. Post add Equipment data.
    app.post("/equipment", async (req, res) => {
      const newEquipment = req.body;
      const result = await sportsCollection.insertOne(newEquipment);
      res.send(result);
      // console.log(newEquipment);
    });
    // app.post("/users", async (req, res) => {
    //   const data = req.body;
    //   const result = await usersCollection.insertOne(data);
    //   res.send(result);
    //   console.log(data);
    // });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// Check the server----->>
app.get("/", (req, res) => {
  res.send("Assignment 10 server is running.....!");
});
app.listen(port, () => {
  console.log("Server port is running on port", port);
});

// UGFHU1MGkvzxZGgD
// Sports-equipment

// firebase-->>project-261576270669
