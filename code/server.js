//INITIALISATION

//Specifying the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const staticroutes = require("./routes/staticroutes");
const crudroutes = require("./routes/crudroutes");
const cors = require('cors');
;

//Creating an instance of an Express application
const app = express();

const corsOptions = {
  origin: 'https://notes-app-nov25-5fyx.vercel.app/', // Replace with your actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

//Import static route(s)
app.use(staticroutes);

//Import CRUD route(s)
app.use(crudroutes);

//Defining the port the server will listen on
const PORT = 3001;

//Starting the server and listening on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
