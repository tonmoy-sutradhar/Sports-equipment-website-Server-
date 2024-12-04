require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
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

    app.post("/sports", async (req, res) => {
      const data = req.body;
      const result = await sportsCollection.insertOne(data);
      res.send(result);
      console.log(data);
    });
    app.post("/users", async (req, res) => {
      const data = req.body;
      const result = await usersCollection.insertOne(data);
      res.send(result);
      console.log(data);
    });

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
