const express = require("express");
const fs = require("fs");
const path = require("path");

//Creating a new router
const static = require("express").Router();

//Serving static files from the 'public' directory
static.use(express.static(path.join(__dirname, "../public")));

//Handling GET request at the root route
static.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

//Exporting the router
module.exports = static;