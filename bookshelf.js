let debounceTimer;

document.addEventListener("DOMContentLoaded", function () {
  const pendingShelf = document.getElementById("pendingShelf");
  const doneShelf = document.getElementById("doneShelf");

  let books = [];

  function refreshShelves() {
    pendingShelf.innerHTML = "";
    doneShelf.innerHTML = "";

    const pendingBooks = books.filter((book) => !book.isComplete);
    const doneBooks = books.filter((book) => book.isComplete);

    pendingBooks.forEach((book) => {
      const bookElement = createBookElement(book);
      pendingShelf.appendChild(bookElement);
    });

    doneBooks.forEach((book) => {
      const bookElement = createBookElement(book);
      doneShelf.appendChild(bookElement);
    });
  }

  function createBookElement(book) {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");
    const bookStatus = book.isComplete ? "done" : "pending";
    bookElement.innerHTML = `
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Year: ${book.year}</p>
        <button class="deleteButton">Delete</button>
        <button class="moveButton">${
          book.isComplete ? "Move to Pending" : "Move to Done"
        }</button>
        <button class="editButton">Edit</button>
      `;

    const editButton = bookElement.querySelector(".editButton");
    editButton.addEventListener("click", () => {
      editBook(book.id);
    });
    const deleteButton = bookElement.querySelector(".deleteButton");
    deleteButton.addEventListener("click", () => {
      deleteBook(book.id);
    });

    const moveButton = bookElement.querySelector(".moveButton");
    moveButton.addEventListener("click", () => {
      moveBook(book.id);
    });
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const searchText = searchInput.value.trim().toLowerCase();
        filterBooks(searchText);
      }, 300);
    });

    function filterBooks(searchText) {
      const pendingBooks = books.filter((book) => !book.isComplete);
      const doneBooks = books.filter((book) => book.isComplete);

      const filteredPendingBooks = filterByTitle(pendingBooks, searchText);
      const filteredDoneBooks = filterByTitle(doneBooks, searchText);

      displayFilteredBooks(filteredPendingBooks, filteredDoneBooks);
    }

    function filterByTitle(booksArray, searchText) {
      if (searchText === "") {
        return booksArray;
      }
      return booksArray.filter((book) =>
        book.title.toLowerCase().includes(searchText)
      );
    }

    function displayFilteredBooks(filteredPendingBooks, filteredDoneBooks) {
      pendingShelf.innerHTML = "";
      doneShelf.innerHTML = "";

      filteredPendingBooks.forEach((book) => {
        const bookElement = createBookElement(book);
        pendingShelf.appendChild(bookElement);
      });

      filteredDoneBooks.forEach((book) => {
        const bookElement = createBookElement(book);
        doneShelf.appendChild(bookElement);
      });
    }

    return bookElement;
  }
  function editBook(id) {
    const bookToEdit = books.find((book) => book.id === id);
    if (bookToEdit) {
      const newTitle = prompt("Enter new title:", bookToEdit.title);
      const newAuthor = prompt("Enter new author:", bookToEdit.author);
      const newYear = prompt("Enter new year:", bookToEdit.year);

      if (newTitle !== null && newAuthor !== null && newYear !== null) {
        bookToEdit.title = newTitle.trim();
        bookToEdit.author = newAuthor.trim();
        bookToEdit.year = newYear.trim();

        refreshShelves();
        saveToLocalStorage();
      }
    }
  }
  function addBook(title, author, year, isComplete) {
    const yearNumber = parseInt(year);

    if (yearNumber < 0) {
      alert("Tahun tidak boleh negatif");
      return;
    }

    const newBook = {
      id: +new Date(),
      title,
      author,
      year: yearNumber,
      isComplete,
    };
    books.push(newBook);
    refreshShelves();
    saveToLocalStorage();
  }

  function deleteBook(id) {
    const confirmation = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (confirmation) {
      books = books.filter((book) => book.id !== id);
      refreshShelves();
      saveToLocalStorage();
    }
  }

  function moveBook(id) {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books[index].isComplete = !books[index].isComplete;
      refreshShelves();
      saveToLocalStorage();
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem("books", JSON.stringify(books));
  }

  function loadFromLocalStorage() {
    const storedBooks = localStorage.getItem("books");
    if (storedBooks) {
      books = JSON.parse(storedBooks);
      refreshShelves();
    }
  }

  loadFromLocalStorage();

  const form = document.querySelector("form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = form.querySelector(".title").value;
    const author = form.querySelector(".writer").value;
    const year = form.querySelector(".year").value;
    const isComplete = form.querySelector(".finishedCheckbox").checked;

    addBook(title, author, year, isComplete);

    form.reset();
  });
});

const colors = [
  "#2196f3",
  "#f43f5e",
  "#ec4899",
  "#d946ef",
  "#a855f7",
  "#8b5cf6",
  "#6366f1",
  "#3b82f6",
  "#0ea5e9",
  "#06b6d4",
  "#14b8a6",
  "#10b981",
  "#22c55e",
  "#84cc16",
  "#eab308",
  "#f59e0b",
  "#f97316",
  "#ef4444",
];

setInterval(() => {
  const color = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.setProperty("--background", color);
}, 5000);

function scrollToBookForm() {
  const bookFormSection = document.getElementById("BookForm");
  bookFormSection.scrollIntoView({ behavior: "smooth" });
}

function scrollToLibrary() {
  const librarySection = document.getElementById("Library");
  librarySection.scrollIntoView({ behavior: "smooth" });
}
