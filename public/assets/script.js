//GLOBAL DECLARATIONS, DEFINITIONS, AND INITIALISATION

const addButton = document.getElementById("addbutton");
const noteListCol = document.getElementById("notelistcol");
var newNoteInput = document.getElementById("newnote");
var noteListArray = [];
var newArray = [];
var newNote;

//FUNCTIONS FOR INTERACTING WITH THE SERVER

//Function for extracting trimmed list of notes from extracted full data by removing maxNoteId element at start of data array
function extractNoteListArray(data){
    data.shift();
    return(data);
}

//Function to fetch raw list of notes from the backend
const fetchAllData = async () => {
    try {
        const response = await fetch("/data/all_notes");
        const data = await response.json();
        noteListArray = extractNoteListArray(data);
        return(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// Function to fetch a single note
const fetchOneData = async (id) => {
    try {
        const response = await fetch(`/data/${id}`);
        const data = await response.json();
        return(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// Function to post a single note
const postData = async (text) => {
    try {
        const response = await fetch(
            "/data", {
                method: "POST",
                headers: {
				    'Content-Type': 'application/json',
				    Accept: 'application/json',
			    },
                body: JSON.stringify({
                    'text':text
                })
            }
        );
        return "note added";
    }
    catch (error) {
        console.error("Error posting data:", error);
    }
};

// Function to update a single note
const updateData = async (id, text) => {
    try {
        const response = await fetch(`/data/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                'text':text
            })
        })
        return response;
    }        
    catch (error) {
        console.error("Error posting data:", error);
    }
};

// Function to delete a single note
const deleteData = async (id) => {
    try {
        const response = await fetch(`/data/${id}`, {
            method: 'DELETE'
        });
        return response;
    }        
    catch (error) {
        console.error("Error posting data:", error);
    }
};

// Function to handle form submission to add new data
addButton.addEventListener("click", async (event) => {
    try {
        event.preventDefault();
        const newNote = newNoteInput.value;
        fetchAllData();
        if (noteCheck(newNote, noteListArray)) {
            response = await postData(newNote);
            newNoteInput.value = ""; // Clearing input field
            topLoop(); // Refreshing the DOM
        }
    }
    catch (error) {
      console.error("Error adding data:", error);
    }
})

//FUNCTIONS FOR UPDATING THE DOM

//Helper functions for formatting and for adding event listeners to buttons

//Function to add the delete listener to a note's delete button
function addDeleteListener (noteDeleteNode) {
    noteDeleteNode.addEventListener("click", async (event) => {
        try {
            event.preventDefault();
            await deleteData(noteDeleteNode.id);
            topLoop(); // Refreshing the DOM
            }
        catch (error) {
        console.error("Error deleting data:", error);
        }
    });
}

//This function formats a note's save button
function formatSave(noteEditNode, noteTextNode, note){
//Replacing edit button with a save button
        noteEditNode.className = "col-2 taskedit bg-warning";
        noteEditNode.textContent = "Save";
//Defining the text node as an "text" area
        noteTextNode = document.createElement("textarea");
        noteTextNode.setAttribute('rows', 6);
        noteTextNode.defaultValue = note.text;
        return noteTextNode;
}

//This function adds a save event listener to an edit button that has been clicked
function addSaveListener(noteEditNode, noteTextNode, note){
    noteEditNode.addEventListener("click", async (event) => {
        try {
            event.preventDefault();
            noteListArray = await fetchAllData();
            //When the save button is clicked, the edited text becomes the fixed note description
            if (note.text == noteTextNode.value){
                topLoop(); //Refreshing the page
            }
            else if (noteCheck(noteTextNode.value, noteListArray)){
                await updateData(noteEditNode.id, noteTextNode.value);
                topLoop(); //Refreshing the page
            }
            else {
                topLoop(); //Refreshing the page
            }            
        }
        catch (error) {
        console.error("Error updating data:", error);
        }
    })
}

//This function formats a note's edit button
function formatEdit(noteEditNode, noteTextNode, note) {
    noteEditNode.className = "col-2 noteedit bg-success";
    noteEditNode.textContent = "Edit";
    noteTextNode = document.createElement("div");
    noteTextNode.innerHTML = `<pre>${note.text}</pre>`;
    return noteTextNode;
}

//This function adds a listener a note's edit button
function addEditListener(noteEditNode) {
    noteEditNode.addEventListener("click", async (event) => {
        try {
            event.preventDefault();
            noteListArray = await fetchAllData();
            //Displaying the notes, with the current note in edit mode (i.e. with save button)
            showNotes(noteListArray, noteEditNode.id);
        }
        catch (error) {
            console.error("Error editing data:", error);
        }
    })
}

//Helper function to check if the text of a note is duplicated in another note
function foundIn(text, noteListArray){
    duplicate = false;
    noteListArray.forEach(function (note) {duplicate = (duplicate || text==note.text)})
    return duplicate;
}

//Helper function to check if a new note is empty or a duplicate
function noteCheck(text, noteListArray){
//Excluding empty tasks
    if (text == ""){
        alert("Please write non-blank note in the box.")
        return false;
    }
//Excluding duplicate tasks
    (text, noteListArray);
    if (foundIn(text, noteListArray)){
        alert("Please write unique task");
        return false;
    }
    else {
        return true
    }
};


//Function to display the notes extracted from the server in the DOM
//"id" is the note id of the note for which the edit button has been clicked
//If no note is being edited, then "id" is -1
function showNotes(noteListArray, id) {
    
    //Clearing display of notes, in order to rebuild
    currentNotes.innerHTML = "";

    //Adding notes into the display, one at a time    
    noteListArray.forEach( function (note) {

        //Node generation

        //"noteTitleNode" is the node displaying the note number label
        //"noteEditNode" is the edit button associated with the note
        //"noteDeleteNode" is the delete button associated with the note
        //"noteTextNode" is the note description associated with the note
        //"noteNode" is the full note row
        const noteNode = document.createElement("div");
        const noteTitleNode = document.createElement("button");
        const noteEditNode = document.createElement("button");
        const noteDeleteNode = document.createElement("button");
        var noteTextNode = document.createElement("div");

        //Note styling
        noteNode.className = "row pb-3";
        noteTitleNode.className = "col-2 notetitle bg-primary";
        noteDeleteNode.className = "col-2 notedelete bg-danger";

        //Note content
        noteTitleNode.textContent = `Note ${note.id}`;
        noteDeleteNode.textContent = "Delete";

        //Labelling the delete node with the note id, so that the id can be accessed when the delete event listener is triggered.
        noteDeleteNode.id = note.id;

        //Adding delete event listener
        addDeleteListener(noteDeleteNode)

        //Labelling the edit node with the note id, so that the id can be accessed when the edit event listener is triggered.
        noteEditNode.id = note.id;

        //If node has been clicked for editing, format edit button as save button and add save listener.
        if (noteEditNode.id == id) {
            noteTextNode = formatSave(noteEditNode, noteTextNode, note);
            addSaveListener(noteEditNode, noteTextNode, note);
        }

        //Adding edit functionality

        //If the note has not been marked for editing, then set up the edit button, and add edit event listener.
        else {
            noteTextNode = formatEdit(noteEditNode, noteTextNode, note);
            addEditListener(noteEditNode);
        }

        //Formatting note text
        noteTextNode.className = "col-6 notetext border";

        //Add the note into the DOM       
        noteNode.appendChild(noteTitleNode);
        noteNode.appendChild(noteTextNode);
        noteNode.appendChild(noteEditNode);
        noteNode.appendChild(noteDeleteNode);
        currentNotes.appendChild(noteNode);
    })

    //Clearing the "new note" input field
    newNoteInput.value = "";
    }

//INITIALISATION OF PAGE

async function topLoop () {

// Retrieve notes from server
    allNotes = await fetchAllData();

// Retrieve notes from server    
    showNotes(allNotes, -1);
}

topLoop();