//NITIALISATION

// Import the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Create an instance of an Express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define the path to the JSON file
const dataFilePath = path.join(__dirname, "data.json");

// Define the port the server will listen on
const PORT = 3001;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


//BASE FILE SERVING RESPONDER FUNCTIONS

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Handle GET request at the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Wildcard route to handle undefined routes
app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});


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
  const newData = { id: uuidv4(), ...req.body };
  const currentData = readData();
  currentData.push(newData);
  writeData(currentData);
  res.json({ message: "Data saved successfully", data: newData });
});

//Read all notes

// Handle GET request to read all notes
app.get("/all_notes", (req, res) => {
  const all_notes = readData();
  res.json(all_notes);
});

//(Read a particular note)

// Handle GET request to retrieve data by ID
app.get("/data/:id", (req, res) => {
  const data = readData();
  const item = data.find((item) => item.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Data not found" });
  }
  res.json(item);
});

// TODO: Handle PUT request  to update a particular note

app.post("/data/put/:id", (req, res) => {
    const currentData = readData();
    const item = currentData.find((item) => item.id === req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Data not found" });
    };
    currentData.delete(item.id)
    const newData = { id: item.id, ...req.body };
    currentData.push(newData);
    writeData(currentData);
    res.json({ message: "Data updated successfully", data: newData });


// TODO: Handle DELETE request to delete a particular note

app.post("/data/delete/:id", (req, res) => {
    currentData = readData();
    const item = currentData.find((item) => item.id === req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Data not found" });
    };
    currentData.delete(item.id)
    writeData(currentData);
    res.json({ message: "Data saved successfully", data: newData });

    
/* Handle POST request at the /echo route
app.post("/echo", (req, res) => {
  // Respond with the same data that was received in the request body
  res.json({ received: req.body });
});
*/
