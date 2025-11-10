
 # Notes App 
> The purpose of this app is to gather and display a list of user notes (which can be on any topic or theme, or miscellaneous). The app is designed to be hosted in monorepo form, where the frontend, backend and "database" (the last being in the form of a persistent JSON file) are deployed using an Express server on a 'single origin' domain.

 ## Installation Instructions
 - Step 1: Clone the GitHub repository onto your local machine.
 - Step 2: Navigate to the folder "codebase".
 - Step 3: Run "npm install".
 - Step 4: Enter "npm run start", and ensure that the node server is running successfully.
 - Step 5: Open a browser and navigate to "https://localhost:3001 to see the app.

 ## Usage Information 
 When the app opens, the list of previously entered notes will appear at the top of the page. To enter a new note, click in the "new note" text area, enter your new note, and click "submit". To delete a note, click on the associated "delete" button. To edit a note, click its "edit" button and type the amends into its text field, and click "Save". Each note is numbered one greater than the previous max number for a note. Each note retains its assigned number, regardless of notes with lower numbers being deleted. A note may not be empty, nor a duplicate of another note.

 ## Links 
 - Github repository: https://github.com/Spiritsword/notes_app_nov25
 - Demo instance: https://notes-app-nov25.onrender.com/ (When visiting the site, allow time for the instance to spin up.)
 
 *** 
