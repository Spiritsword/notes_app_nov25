// CRUD ROUTES

//Required modules
const express = require("express");
const fs = require("fs");
const path = require("path");


//Creating a new router
const crud = require("express").Router();

//Middleware to parse incoming JSON requests


//Defining the path to the JSON file
const dataFilePath = path.join(__dirname, "../data.json");


//DATABASE BASE FUNCTIONS

// Function to read data from the JSON file
const readData = () => {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

//Function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

//RESPONDING TO CLIENT CRUD REQUESTS

//Handling POST request to save new note
//A new, unique ID is created, just higher than maximum previous ID
crud.post("/data", (req, res) => {
  const currentData = readData();
  const maxNoteID = currentData[0].maxNoteID;
  currentData[0].maxNoteID = maxNoteID+1;
  const newData = {id:(maxNoteID+1), ...req.body};
  currentData.push(newData);
  writeData(currentData);
  res.json({ message: "Note saved successfully" /*note: newData*/ });
});

//Handling GET request to read all notes
crud.get("/data/all_notes", (req, res) => {
  const all_notes = readData();
  res.json(all_notes);
});

//Handling GET request to read a particular note by ID
crud.get("/data/:id", (req, res) => {
  const data = readData();
  const item = data.find((item) => item.id == req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Data not found" });
  }
  res.json(item);
});

//Handling PUT request to update a particular note
crud.put("/data/:id", (req, res) => {
    const currentData = readData();
    const noteIndex = currentData.findIndex((note) => note.id == req.params.id);
    if (noteIndex == -1) {
      return res.status(404).json({ message: "Note not found" });
    };
    const newData = {id:req.params.id, ...req.body};
    currentData.splice(noteIndex, 1, newData)
    writeData(currentData);
    res.json({ message: "Data updated successfully", array: currentData});
});

//Handling DELETE request to delete a particular note
crud.delete("/data/:id", (req, res) => {
    currentData = readData();
    const noteIndex = currentData.findIndex((note) => note.id == req.params.id);
    if (noteIndex == -1) {
      return res.status(404).json({message: "Data not found"});
    };
    currentData.splice(noteIndex, 1)
    writeData(currentData);
    res.json({message: "Data deleted successfully"});
});

crud.all(/(.*)/, (req, res) => {
  res.status(404).send("Route not found");
});

module.exports = crud;