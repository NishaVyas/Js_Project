document.addEventListener('DOMContentLoaded', domContentLoader);

function handleFormSubmit(event) {
    event.preventDefault();
    let myObj = {
        title: event.target.title.value,
        description: event.target.description.value,
    };
    // Add new note
    axios.post("https://crudcrud.com/api/0a8eb880f5a34e01982e3f783ff1a693/noteData", myObj)
        .then((response) => {
            console.log(response);
            domContentLoader(); // Update the website with new note details
            event.target.reset(); // Clear the form
        })
        .catch(err => console.error(err));
}

function domContentLoader() {
    const container = document.getElementById('noteContainer');
    const totalNotesSpan = document.getElementById('totalNotes');
    const showingNotesSpan = document.getElementById('showingNotes');
    container.innerHTML = '';

    axios.get("https://crudcrud.com/api/0a8eb880f5a34e01982e3f783ff1a693/noteData")
        .then((response) => {
            const data = response.data;
            let totalNotes = 0;
            let showingNotes = 0;

            const searchTerm = document.querySelector('input[type="text"]').value.toLowerCase();

            data.forEach((noteObj) => {
                if (noteObj.title && noteObj.description) {
                    totalNotes++;

                    const isTitleMatch = noteObj.title.toLowerCase().includes(searchTerm);
                    if (isTitleMatch) {
                        // If there is a search term match, display the note
                        showNoteDetails(noteObj, container);
                        showingNotes++;
                    }
                }
            });

            // Display the total notes count
            totalNotesSpan.textContent = totalNotes;

            // Display the showing notes count based on the search term
            showingNotesSpan.textContent = showingNotes;
        })
        .catch((err) => {
            console.log(err);
        });
}

function showNoteDetails(noteObj, container) {
    const newDiv = document.createElement('div');

    const titleElement = document.createElement('strong');
    titleElement.textContent = noteObj.title;

    const descriptionElement = document.createElement('div');
    descriptionElement.textContent = noteObj.description;

    newDiv.appendChild(titleElement);
    newDiv.appendChild(descriptionElement);
    container.appendChild(newDiv);

    const deleteButton = document.createElement('button');
    const deleteButtonText = document.createTextNode('Delete');
    deleteButton.appendChild(deleteButtonText);
    deleteButton.className = 'delete-button';
    newDiv.appendChild(deleteButton);

    newDiv.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-button')) {
            const noteToDelete = event.target.parentElement;
            noteToDelete.remove();
            axios.delete(`https://crudcrud.com/api/0a8eb880f5a34e01982e3f783ff1a693/noteData/${noteObj._id}`)
                .then((response) => {
                    console.log(response);
                    domContentLoader(); // Update the total and showing notes count after deleting a note
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    });
}

function handleSearch(event) {
    // Trigger domContentLoader on each search to update showing notes count
    domContentLoader();
}

// Attach the handleSearch function to the input field for live search using keyup event
const searchInput = document.querySelector('input[type="text"]');
searchInput.addEventListener('keyup', handleSearch);
