const express = require("express");
const fs = require("fs");
const path = require("path");

// Create a new router
const static = require("express").Router();

// Serve static files from the 'public' directory
static.use(express.static(path.join(__dirname, "public")));

// Handle GET request at the root route
static.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Export the router
module.exports = static;