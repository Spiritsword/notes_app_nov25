//INITIALISATION

//Specifying the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const staticroutes = require("./routes/staticroutes");
const crudroutes = require("./routes/crudroutes");

//Creating an instance of an Express application
const app = express();

//Import static route(s)
app.use(staticroutes);

//Import CRUD route(s)
app.use(crudroutes);

//Defining the port the server will listen on
const PORT = 3001;

//Starting the server and listening on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
