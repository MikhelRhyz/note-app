const noteTitle = document.querySelector("#noteTitle");
const noteContent = document.querySelector("#noteContent");
const searchInput = document.querySelector("#searchInput");
const addNoteBtn = document.querySelector("#addNoteBtn");
const notesContainer = document.querySelector("#notesContainer");

let notes = [];

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", loadNotes);
addNoteBtn.addEventListener("click", handleAddNote);
searchInput.addEventListener("input", searchNotes);
notesContainer.addEventListener("click", handleNoteActions);

// --- Event Handlers ---
function handleAddNote() {
  if (!noteTitle.value.trim() && !noteContent.value.trim()) return;

  const newNote = { 
    title: noteTitle.value.trim(), 
    content: noteContent.value.trim() 
  };

  notes.push(newNote);
  saveNotes();
  renderNotes();

  noteTitle.value = "";
  noteContent.value = "";
}

function handleNoteActions(e) {
  const li = e.target.closest("li");
  if (!li) return;

  const index = [...notesContainer.children].indexOf(li);

  if (e.target.classList.contains("fa-pen")) {
    // Edit note
    noteTitle.value = notes[index].title;
    noteContent.value = notes[index].content;
    notes.splice(index, 1);
  } 
  else if (e.target.classList.contains("fa-trash")) {
    // Delete note
    if (confirm("Delete this note?")) {
      notes.splice(index, 1);
    }
  }

  saveNotes();
  renderNotes();
}

function searchNotes() {
  const query = searchInput.value.toLowerCase();
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(query) || 
    note.content.toLowerCase().includes(query)
  );
  renderNotes(filteredNotes);
}

// --- Local Storage ---
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() {
  notes = JSON.parse(localStorage.getItem("notes")) || [];
  renderNotes();
}

// --- Rendering ---
function renderNotes(list = notes) {
  notesContainer.innerHTML = "";

  if (list.length === 0) {
    notesContainer.innerHTML = "<p class='text-muted text-center'>No notes yet. Add one above 👆</p>";
    return;
  }

  list.forEach(note => {
    const li = document.createElement("li");

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "note-content-wrapper";

    const title = document.createElement("div");
    title.className = "note-title";
    title.textContent = note.title;

    const content = document.createElement("div");
    content.className = "note-content";
    content.textContent = note.content.length > 100 
      ? note.content.slice(0, 100) + "..." 
      : note.content;

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const editBtn = document.createElement("i");
    editBtn.className = "fa-solid fa-pen";

    const deleteBtn = document.createElement("i");
    deleteBtn.className = "fa-solid fa-trash";

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    contentWrapper.appendChild(title);
    contentWrapper.appendChild(content);

    li.appendChild(contentWrapper);
    li.appendChild(actions);

    notesContainer.appendChild(li);
  });
}

// --- Keyboard Shortcut ---
noteContent.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key === "Enter") {
    handleAddNote();
  }
});
