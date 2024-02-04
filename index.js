document.addEventListener('DOMContentLoaded', () => {
    domContentLoader(() => {
        // callback function after DOM content is loaded
    });
});

async function handleFormSubmit(event, callback) {
    event.preventDefault();
    let myObj = {
        title: event.target.title.value,
        description: event.target.description.value,
    };

    try {
        // Add new note
        const response = await axios.post("https://crudcrud.com/api/443ea7e1581449718b5bc71d6cee412f/noteData", myObj);
        console.log(response);
        await domContentLoader(callback); // Update the website with new note details
        event.target.reset(); // Clear the form
    } catch (err) {
        console.error(err);
    }
}

async function domContentLoader(callback) {
    const container = document.getElementById('noteContainer');
    const totalNotesSpan = document.getElementById('totalNotes');
    const showingNotesSpan = document.getElementById('showingNotes');
    container.innerHTML = '';

    try {
        const response = await axios.get("https://crudcrud.com/api/443ea7e1581449718b5bc71d6cee412f/noteData");
        const data = response.data;
        let totalNotes = 0;
        let showingNotes = 0;

        const searchTerm = document.querySelector('input[type="text"]').value.toLowerCase();

        for (const noteObj of data) {
            if (noteObj.title && noteObj.description) {
                totalNotes++;

                const isTitleMatch = noteObj.title.toLowerCase().includes(searchTerm);
                if (isTitleMatch) {
                    showNoteDetails(noteObj, container, callback);
                    showingNotes++;
                }
            }
        }

        // Display the total notes count
        totalNotesSpan.textContent = totalNotes;

        // Display the showing notes count based on the search term
        showingNotesSpan.textContent = showingNotes;

        if (callback && typeof callback === 'function') {
            callback(); // Invoke the callback function if provided
        }
    } catch (err) {
        console.log(err);
    }
}

function showNoteDetails(noteObj, container, callback) {
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

    newDiv.addEventListener('click', async function (event) {
        if (event.target.classList.contains('delete-button')) {
            const noteToDelete = event.target.parentElement;
            noteToDelete.remove();

            try {
                const response = await axios.delete(`https://crudcrud.com/api/443ea7e1581449718b5bc71d6cee412f/noteData/${noteObj._id}`);
                console.log(response);
                await domContentLoader(callback); // Update the total and showing notes count after deleting a note
            } catch (err) {
                console.log(err);
            }
        }
    });
}

function handleSearch(event) {
    //domContentLoader on each search to update showing notes count
    domContentLoader(() => {
        // Your callback function after content is loaded based on search
    });
}

// Attach the handleSearch function to the input field for live search using keyup event
const searchInput = document.querySelector('input[type="text"]');
searchInput.addEventListener('keyup', handleSearch);
