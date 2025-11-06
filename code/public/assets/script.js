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
        noteListArray = extractNoteListArray(data);
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
        console.log("posting", text);
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
        console.log("note added log");
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

addButton.addEventListener("click", async (event) => {
    try {
        event.preventDefault();
        const newNote = newNoteInput.value;
        console.log("text from input", newNote );
        response = await postData(newNote);
        newNoteInput.value = ""; // Clear input field
        topLoop(); // Refresh the DOM
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

//Adding delete event listener
        noteDeleteNode.id = note.id;

noteDeleteNode.addEventListener("click", async (event) => {
    try {
        event.preventDefault();
        await deleteData(noteDeleteNode.id);
        topLoop(); // Refresh the DOM
        }
    catch (error) {
      console.error("Error adding data:", error);
    }
});

//Add save functionality - if relevant

//Labelling the edit node with the note id, so that the id can be accessed when the edit event listener is triggered.
        noteEditNode.id = note.id;

//If note has been clicked for editing, replace the edit button with a save button, and requisite functionality
        if (noteEditNode.id == id) {
            noteEditNode.className = "col-2 taskedit bg-warning";
            noteEditNode.textContent = "Save";
//In this case, define the text node as an "input" element...
            var noteTextNode = document.createElement("textarea");
            noteTextNode.setAttribute('rows', 6);
            noteTextNode.defaultValue = note.text;
  
// ...and add save event listener            

            noteEditNode.addEventListener("click", async (event) => {
                try {
                        event.preventDefault();
                        noteListArray = await fetchAllData();
                        //When the save button is clicked, the edited text becomes the fixed note description                    
                        if (noteListArray[noteTextNode.id] == noteTextNode.value){
                        }
                        else if (noteCheck(noteTextNode.value, noteListArray)){
                            await updateData(noteTextNode.id, noteTextNode.value);
                        }
                        topLoop()
                }
                catch (error) {
                console.error("Error adding data:", error);
                }
            })
        }
    
//Add edit functionality - if relevant

//If the note is not already being edited, then set up the edit button, with appropriate functionality
        else {
            noteEditNode.className = "col-2 noteedit bg-success";
            noteEditNode.textContent = "Edit";
            var noteTextNode = document.createElement("div");
            noteTextNode.innerHTML = `<pre>${note.text}</pre>`;

 //Add edit event listener
            noteEditNode.addEventListener("click", async (event) => {
                try {
                    event.preventDefault();
                    noteListArray = await fetchAllData();
//If the edit event listener is triggered, then display the notes, with the current note in edit mode (i.e. with save button)
                    showNotes(noteListArray, noteEditNode.id)
                }
                catch (error) {
                    console.error("Error adding data:", error);
                }
            }
        )

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
            newNoteInput.value = "";

}})};


//MAIN FUNCTION AND CALL

async function topLoop () {

// Retrieve notes from server
    allNotes = await fetchAllData();

// Retrieve notes from server    
    showNotes(allNotes, -1);
}

topLoop()