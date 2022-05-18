const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.g2tmf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const tasksName = client.db("toDo").collection("tasks");

    // GET All Tasks
    app.get("/tasks", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = tasksName.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // POST A Task
    app.post("/tasks", async (req, res) => {
      const newTask = req.body;
      const result = await tasksName.insertOne(newTask);
      res.send(result);
    });

    // Delete A Task
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await tasksName.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Server");
});

app.listen(port, () => {
  console.log(`Listening to Port ${port}`);
});
