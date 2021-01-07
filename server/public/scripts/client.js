$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
  $('#bookShelf').on('click', '.readBtn', markRead);
  $('#bookShelf').on('click', '.deleteBtn', deleteBook);

}; //end addClickHandlers

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}; //end handleSubmit

function markRead() {
  console.log('clicked READ');
  //id for url and WHERE clause
  const id = $(this).closest('tr').data('book').id;
  console.log(id);
  //data for SET clause in UPDATE
  const dataToSend = {
    direction: $(this).text()
  }

  $.ajax({
    url: `/books/${id}`,
    type: 'PUT',
    data: dataToSend
  }).then(function(response){
    console.log('marked as READ');
    refreshBooks();
  }).catch(function(error){
    alert('error marking book as read');
  })

}; //end markRead

function deleteBook() {
  console.log('clicked DELETE');
  const id = $(this).closest('tr').data('book').id;
  console.log(id);

  $.ajax({
    url: `/books/${id}`,
    type: 'DELETE'
  }).then(function(response) {
    refreshBooks();
  }).catch(function(error) {
    alert('error in delete');
  })

}; //end deleteBook

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}; //end addBook

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}; //end refreshBooks


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    let $tr = $('<tr></tr>');
    $tr.data('book', book);
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $tr.append(`<td>${book.status}</td>`);
    $tr.append(`<td><button class="readBtn">READ</td>`);
    $tr.append(`<td><button class="deleteBtn">DELETE</td>`);
    $('#bookShelf').append($tr);
  }
}; //end renderBooks
