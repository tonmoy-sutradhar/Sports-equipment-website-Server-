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
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cjt8m.mongodb.net/Sports-equipment?retryWrites=true&w=majority`;

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
    console.log("Connected to MongoDB!");

    const sportsCollection = client
      .db("Sports-equipment")
      .collection("equipment");
    const usersCollection = client.db("Sports-equipment").collection("users");

    // 2. Get all data from Database
    app.get("/equipment", async (req, res) => {
      try {
        const result = await sportsCollection.find().toArray();
        res.send(result);
      } catch (err) {
        console.error("Error fetching equipment:", err);
        res.status(500).send({ message: "Failed to fetch equipment" });
      }
    });

    // 3. Get any one specific equipment
    app.get("/equipment/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await sportsCollection.findOne(query);
        res.send(result);
      } catch (err) {
        console.error("Error fetching equipment by ID:", err);
        res.status(500).send({ message: "Failed to fetch equipment by ID" });
      }
    });

    // 1. Post add Equipment data
    app.post("/equipment", async (req, res) => {
      try {
        const newEquipment = req.body;
        const result = await sportsCollection.insertOne(newEquipment);
        res.send(result);
      } catch (err) {
        console.error("Error adding equipment:", err);
        res.status(500).send({ message: "Failed to add equipment" });
      }
    });

    // 4. Delete equipment from database using specific ID
    app.delete("/equipment/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await sportsCollection.deleteOne(query);
        res.send(result);
      } catch (err) {
        console.error("Error deleting equipment:", err);
        res.status(500).send({ message: "Failed to delete equipment" });
      }
    });

    // 5. Update equipment data
    app.put("/equipment/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const update = req.body;
        const equipmentUpdate = {
          $set: {
            photo: update.photo,
            itemName: update.itemName,
            categoryName: update.categoryName,
            description: update.description,
            price: update.price,
            rating: update.rating,
            stockStatus: update.stockStatus,
            processingTime: update.processingTime,
            customization: update.customization,
          },
        };
        const result = await sportsCollection.updateOne(
          filter,
          equipmentUpdate,
          options
        );
        res.send(result);
      } catch (err) {
        console.error("Error updating equipment:", err);
        res.status(500).send({ message: "Failed to update equipment" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your MongoDB deployment successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
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
