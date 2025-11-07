// INITIALISATION

// Import the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const staticroutes = require("./routes/staticroutes");
const crudroutes = require("./routes/crudroutes");

// Create an instance of an Express application
const app = express();

// import static route(s)
app.use(staticroutes);

// import CRUD route(s)
app.use(crudroutes);

// Define the port the server will listen on
const PORT = 3001;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
