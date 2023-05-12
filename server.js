const {MongoClient, ServerApiVersion} = require("mongodb");
const uri =
  "mongodb+srv://prasannas544:OVnRMt463dBd5jTT@cluster0.lbgpcrz.mongodb.net/?retryWrites=true&w=majority";
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Set up body parser middleware to parse JSON from POST requests
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Set up endpoint to handle POST requests
app.post("/submit-form-data", (req, res) => {
  // Extract form data from the request body
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  const {name, email, topic, message} = req.body;
  run(name, email, topic, message).catch(console.dir);
  let data = {
    status: "200",
    msg: "Contact made successfully",
  };
  res.json(data);
});
app.post("/send-device-code", (req, res) => {
  // Extract form data from the request body
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  const {device_id,user_name} = req.body;
  quizAppDB(user_name, device_id).catch(console.dir);
  let data = {
    status: "200",
    msg: "Device notif_id sent successfully",
  };
  res.json(data);
});

// Start server listening on specified port
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

async function run(name, email, topic, message) {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    console.log("Connected successfully to server");

    const database = client.db("portfolio");
    const collection = database.collection("contact_us");

    // Insert a document with name, email, and address fields
    const result = await collection.insertOne({
      name: name,
      email: email,
      topic: topic,
      msg: message,
    });
    console.log(
      `${result.insertedCount} documents were inserted with _id: ${result.insertedId}`
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("Connection closed");
  }
}
async function quizAppDB(user_name,device_id) {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    console.log("Connected successfully to server");

    const database = client.db("quizApp");
    const collection = database.collection("notificationsIDs");

    // Insert a document
    const result = await collection.insertOne({
      user_name: user_name,
      device_id:device_id,
    });
    console.log(
      `${result.insertedCount} documents were inserted with _id: ${result.insertedId}`
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("Connection closed");
  }
}
