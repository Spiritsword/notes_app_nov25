// INITIALISATION

// Import the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
//const { v4: uuidv4 } = require("uuid");

// Create an instance of an Express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define the path to the JSON file
const dataFilePath = path.join(__dirname, "data.json");

// Define the port the server will listen on
const PORT = 3001;

//BASE FILE SERVING RESPONDER FUNCTIONS

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Website you wish to allow to connect
//     //res.setHeader('Sec-Fetch-Mode', 'no-cors');
    
//     // Request headers you wish to allow
//     //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Pass to next layer of middleware
//     next();
// });

// Handle GET request at the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Wildcard route to handle undefined routes

//DATABASE BASE FUNCTIONS

// Function to read data from the JSON file
const readData = () => {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};


// Function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

//RESPONSES TO CLIENT CRUD REQUESTS

//Create a note

// Handle POST request to save new data with a unique ID
app.post("/data", (req, res) => {
  console.log("posting data");
  console.log("req.body1", req.body);
  const currentData = readData();
  const maxNoteID = currentData[0].maxNoteID;
  currentData[0].maxNoteID = maxNoteID+1;
  const newData = {id:(maxNoteID+1), ...req.body};
  console.log("req.body", req.body);
  //console.log("...req.body", ...req.body);
  currentData.push(newData);
  writeData(currentData);
  res.json({ message: "Note saved successfully" /*note: newData*/ });
});

// Handle GET request to read all notes
app.get("/data/all_notes", (req, res) => {
  const all_notes = readData();
  res.json(all_notes);
});

// Handle GET request to read a particular note by ID
app.get("/data/:id", (req, res) => {
  const data = readData();
  const item = data.find((item) => item.id == req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Data not found" });
  }
  res.json(item);
});

// Handle PUT request  to update a particular note
app.put("/data/:id", (req, res) => {
    const currentData = readData();
    const noteIndex = currentData.findIndex((note) => note.id == req.params.id);
    if (noteIndex == -1) {
      return res.status(404).json({ message: "Note not found" });
    };
    console.log("req.body", req.body);
    //console.log("...req.body", ...req.body);
    const newData = {id:req.params.id, ...req.body};
    currentData.splice(noteIndex, 1, newData)
    writeData(currentData);
    res.json({ message: "Data updated successfully", array: currentData});
});

// TODO: Handle DELETE request to delete a particular note

app.delete("/data/:id", (req, res) => {
    currentData = readData();
    console.log("deleting");
    console.log("id", req.params.id)
    const noteIndex = currentData.findIndex((note) => note.id == req.params.id);
    if (noteIndex == -1) {
      return res.status(404).json({message: "Data not found"});
    };
    currentData.splice(noteIndex, 1)
    writeData(currentData);
    res.json({message: "Data deleted successfully"});
});

app.all(/(.*)/, (req, res) => {
  res.status(404).send("Route not found");
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/*
app.put("/data/:id", (req, res) => {
  var data = readData();
  console.log("id", req.params.id);
  const itemIndex = data.findIndex((item) => item.id === req.params.id);
  console.log("index", itemIndex);
  const newData = { id: req.params.id, ...req.body };
  console.log("newData", newData);
  data.splice(itemIndex, 1, newData);
  console.log("data", data);
  writeData(data);
  res.json({ message: "Data saved successfully", data: newData });
});


// TODO: Handle DELETE request to delete data by ID

app.delete("/data/:id", (req, res) => {
  var data = readData();
  console.log("id", req.params.id);
  const itemIndex = data.findIndex((item) => item.id === req.params.id);
  console.log("index", itemIndex);
  data.splice(itemIndex, 1);
  console.log("data", data);
  writeData(data);
  res.json({ message: "Data saved successfully", data: newData });
});


*/