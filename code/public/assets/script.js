// GLOBAL DECLARATIONS, DEFINITIONS, AND INITIALISATION

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

// Function to fetch raw list of notes from the backend

const fetchAllData = async () => {
    try {
        const response = await fetch("http://localhost:3001/data/all_notes");
        const data = await response.json();
        const noteListArray = extractNoteListArray(data);
        return(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

// Function to fetch a single note

const fetchOneData = async (id) => {
    try {
        const response = await fetch(`http://localhost:3001/data/${id}`);
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
            "http://localhost:3001/data", {
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
        console.log("text", text);
        try {
            const response = await fetch(`http://localhost:3001/data/${id}`, {
                method: 'PUT',
                headers: {
				    'Content-Type': 'application/json',
				    Accept: 'application/json',
			    },
                body: JSON.stringify({
                    'text':text
                })
            })
            console.log("response", response);
            return response;
        }        
        catch (error) {
            console.error("Error posting data:", error);
        }
};

// Function to delete a single note

const deleteData = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/data/${id}`,{
                method: 'DELETE'
            });
            console.log(response.value);
            return response;
            
        }        
        catch (error) {
            console.error("Error posting data:", error);
        }
};

// Function to handle form submission to add new data

addButton.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();
        const newNote = newNoteInput.textContent;
        response = await postData(newNote);
        if (response.ok) {
            dataInput.value = ""; // Clear input field
            showNotes(); // Refresh the DOM
        }
    }
    catch (error) {
      console.error("Error adding data:", error);
    }
})

//FUNCTIONS FOR UPDATING THE DOM

// Amend DOM according to retrieved notes

//Function to display the notes extracted from the server
//"id" is the note id of a note for which the edit button has been clicked
//If no note is being edited, then this is -1

function showNotes(noteListArray, id) {
    
//Clear display of notes, to rebuild
    currentNotes.innerHTML = "";

//Adding notes into the display, one at a time
    noteListArray.forEach(function (note) {

//note.text = `<pre>$(note.text)</pre>`

//"noteTitleNode" is the node displaying the note number label
//"noteEditNode" is the edit button associated with the note
//"noteDeleteNode" is the delete button associated with the note
//"noteTextNode" is the note description associated with the note
//"noteNode" is the full note row

//Node generation
        const noteNode = document.createElement("div");
        const noteTitleNode = document.createElement("button");
        var noteEditNode = document.createElement("button");
        const noteDeleteNode = document.createElement("button");
//Node styling
        noteNode.className = "row pb-3";
        noteTitleNode.className = "col-2 notetitle bg-primary";
        noteDeleteNode.className = "col-2 notedelete bg-danger";
//Node content
        noteTitleNode.textContent = `Note ${note.id}`;
        noteDeleteNode.textContent = "Delete";

//Add delete functionality

/* TODO Task deletion functionality added to delete button
        noteDeleteNode.id = note.ID;
        noteDeleteNode.addEventListener(
            "click",
            function(e) {
            e.preventDefault();
            newArray = spliceOut(noteListArray, noteDeleteNode.id);
            showNotes(newArray);
            reset()
            }
        )

*/

//Add save functionality - if relevant

//Labelling the edit node with the note id, so that the id can be accessed when the edit event listener is triggered.
        noteEditNode.id = note.ID;

//If note has been clicked for editing, replace the edit button with a save button, and requisite functionality
        if (noteEditNode.id == id) {
            noteEditNode.className = "col-2 taskedit bg-warning";
            noteEditNode.textContent = "Save";
//In this case, define the text node as an "input" element
            var noteTextNode = document.createElement("textarea");
            noteTextNode.setAttribute('rows', 6);
            noteTextNode.defaultValue = note.text;
  
/* TODO Add save event listener            

            noteEditNode.addEventListener(
                "click",
                function(e) {
                    e.preventDefault();
//When the save button is clicked, the edited text becomes the fixed note description                    
                        if (note.text == noteTextNode.value){
                        }
                        else if (noteCheck(noteTextNode.value, noteListArray)){
                            note.text = noteTextNode.value;
                        }
                        showNotes(noteListArray, -1)

//Rebuilding the note list without any note being in edit mode
                }
            )
                          */  
        }
    
//Add edit functionality - if relevant

//If the note is not already being edited, then set up the edit button, with appropriate functionality
        else {
            noteEditNode.className = "col-2 noteedit bg-success";
            noteEditNode.textContent = "Edit";
            var noteTextNode = document.createElement("div");
            noteTextNode.innerHTML = `<pre>${note.text}</pre>`;

/* TODO Add edit event listener
            noteEditNode.addEventListener(
                "click",
                function(e) {
                    e.preventDefault();
//If the edit event listener is triggered, then display the notes, with the current note in edit mode (i.e. with save button)
                    showNotes(noteListArray, noteEditNode.id)
                }
            )
        }

*/
    }

//Format note text

    //TODO Formatting the note description
            noteTextNode.className = "col-6 notetext border";
            noteTextNode.style.textWrap = "wrap";

//Add the note INto the DOM       
            noteNode.appendChild(noteTitleNode);
            noteNode.appendChild(noteTextNode);
            noteNode.appendChild(noteEditNode);
            noteNode.appendChild(noteDeleteNode);
            currentNotes.appendChild(noteNode);
    
//Clear the "new note" input field
            newNoteInput.value = ""

    })  
}









/*

Code snippet from Week 7 exercise

}

        dataList.innerHTML = ""; // Clear the list before rendering
        data.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.id + ": " + JSON.stringify(item);
        dataList.appendChild(li);
        });


//Add event listeners

//(Event document listener need to be able refresh the page)

document.addEventListener("DOMContentLoaded", () => {
  const dataList = document.getElementById("data-list");
  const dataForm = document.getElementById("data-form");
  const dataInput = document.getElementById("data-input");

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("/data");
      const noteListArray = await response.json();


      dataList.innerHTML = ""; // Clear the list before rendering
      data.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.id + ": " + JSON.stringify(item);
        dataList.appendChild(li);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  // Fetch data on page load
  fetchData();
});


/*

// ADDING NOTES

addButton.addEventListener("click", function(e) {
    e.preventDefault();
    newNote = {
        ID:maxNoteID,
        text:newNoteInput.value
    }
    nC = noteCheck(newNote.text, noteListArray);
    if (nC) {
        maxNoteID++;
        newNote.ID = maxNoteID;
        addNote(newNote)
    }
})

function noteCheck(text, noteListArray){
//Excluding empty notes
    if (text == ""){
        alert("Please write new note in the box.")
        return false;
    }
//Excluding duplicate notes  
    duplicate = false;
    noteListArray.forEach(function (note) {duplicate = (duplicate || text==note.text)})
    if (duplicate){
        alert("Please write unique note");
        return false;
    }
    else {
        return true
    }
};

//Helper function to add new note into note storage array, and display the note list on the page
function addNote(newNote) {
    noteListArray.push(newNote);
    showNotes(noteListArray, -1);
}

//Helper function to display the notes
function showNotes(noteListArray, id) {
//"id" is the note id of a note for which the edit button has been clicked. If no note is being edited, then this is -1.
    //Clear display of notes, to rebuild
    currentNotes.innerHTML = "";

//Adding notes into the display, one at a time
    noteListArray.forEach(function (note) {
        //note.text = `<pre>$(note.text)</pre>`
//"noteTitleNode" is the node displaying the note number label
//"noteEditNode" is the edit button
//"noteDeleteNode" is the delete button
//"noteTextNode" is the note description
//"noteNode" is the full note row
//Node generation
        const noteNode = document.createElement("div");
        const noteTitleNode = document.createElement("button");
        var noteEditNode = document.createElement("button");
        const noteDeleteNode = document.createElement("button");
//Node styling
        noteNode.className = "row pb-3";
        noteTitleNode.className = "col-2 notetitle bg-primary";
        noteDeleteNode.className = "col-2 notedelete bg-danger";
//Node content
        noteTitleNode.textContent = `Note ${note.ID+1}`;
        noteDeleteNode.textContent = "Delete";



//Task deletion functionality added to delete button
        noteDeleteNode.id = note.ID;
        noteDeleteNode.addEventListener(
            "click",
            function(e) {
            e.preventDefault();
            newArray = spliceOut(noteListArray, noteDeleteNode.id);
            showNotes(newArray);
            reset()
            }
        )


//Labelling the edit node with the note id, so that the id can be accessed when the edit event listener is triggered.
        noteEditNode.id = note.ID;


//If note has been clicked for editing, replace the edit button with a save button, and requisite functionality
        if (noteEditNode.id == id) {
            noteEditNode.className = "col-2 taskedit bg-warning";
            noteEditNode.textContent = "Save";
//In this case, define the text node as an "input" element
            var noteTextNode = document.createElement("textarea");
            noteTextNode.setAttribute('rows', 6);
            noteTextNode.defaultValue = note.text;
  
            

            noteEditNode.addEventListener(
                "click",
                function(e) {
                    e.preventDefault();
//When the save button is clicked, the edited text becomes the fixed note description                    
                        if (note.text == noteTextNode.value){
                        }
                        else if (noteCheck(noteTextNode.value, noteListArray)){
                            note.text = noteTextNode.value;
                        }
                        showNotes(noteListArray, -1)

//Rebuilding the note list without any note being in edit mode
                }
            )
        }
//If the note is not already being edited, then set up the edit button, with appropriate functionality
        else {
            noteEditNode.className = "col-2 noteedit bg-success";
            noteEditNode.textContent = "Edit";
            var noteTextNode = document.createElement("div");
            noteTextNode.innerHTML = `<pre>${note.text}</pre>`
            noteEditNode.addEventListener(
                "click",
                function(e) {
                    e.preventDefault();
//If the edit event listener is triggered, then display the notes, with the current note in edit mode
                    showNotes(noteListArray, noteEditNode.id)
                }
            )
        }
//Formatting the note description
        noteTextNode.className = "col-6 notetext border";
        noteTextNode.style.textWrap = "wrap";
//Adding the note to the DOM       
        noteNode.appendChild(noteTitleNode);
        noteNode.appendChild(noteTextNode);
        noteNode.appendChild(noteEditNode);
        noteNode.appendChild(noteDeleteNode);
        currentNotes.appendChild(noteNode);
//Clearing the "new note" input field
        newNoteInput.value = ""
    })
}

//Helper function to remove a deleted note from the note list array
function spliceOut(taskListArray, id) {
    newArray = [];
    id = Number(id);
    taskListArray.forEach(
        function(task){
            if (!(task.ID == id)) {
                newArray.push(task)}
        }
    );
    return newArray
}

//Helper function to reset the task list array with the depleted version
function reset() {
    noteListArray = newArray;
}

*/

//MAIN FUNCTION AND CALL

async function topLoop () {

// Retrieve notes from server
    allNotes = await fetchAllData();

// Retrieve notes from server    
    showNotes(allNotes, -1);
}

topLoop()