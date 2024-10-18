document.addEventListener('DOMContentLoaded', function() {
    const noteForm = document.getElementById('noteForm');
    const noteTitle = document.getElementById('noteTitle');
    const noteBody = document.getElementById('noteBody');
    const notesList = document.getElementById('notesList');
  
    loadNotes();
  
    noteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const title = noteTitle.value;
      const body = noteBody.value;
      const dateCreated = new Date().toLocaleString();
  
      const newNote = {
        title,
        body,
        dateCreated,
        dateModified: dateCreated
      };
  
      saveNote(newNote);
    });
  
    function saveNote(note) {
      chrome.storage.local.get({notes: []}, function(data) {
        const notes = data.notes;
        notes.push(note);
        chrome.storage.local.set({notes}, function() {
          displayNotes(notes);
        });
      });
    }
  
    function loadNotes() {
      chrome.storage.local.get({notes: []}, function(data) {
        displayNotes(data.notes);
      });
    }
  
    function displayNotes(notes) {
      notesList.innerHTML = '';
      notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'list-group-item';
        noteElement.innerHTML = `
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${note.title}</h5>
            <small>Created: ${note.dateCreated}</small>
          </div>
          <p class="mb-1">${note.body}</p>
          <div class="d-flex justify-content-end">
            <button class="btn btn-danger btn-sm me-2" onclick="deleteNote(${index})">Delete</button>
          </div>
        `;
        notesList.appendChild(noteElement);
      });
    }
  
    window.deleteNote = function(index) {
      chrome.storage.local.get({notes: []}, function(data) {
        const notes = data.notes;
        notes.splice(index, 1);
        chrome.storage.local.set({notes}, function() {
          displayNotes(notes);
        });
      });
    }
  });
  