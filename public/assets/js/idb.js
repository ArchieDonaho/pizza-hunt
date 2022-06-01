// create database to establish database connection
let db; // stores the connected database object

// establish connection to IndexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('pizza_hunt', 1); // acts as an event listener for the database.
/*
  indexedDB is a window object, so technically we could say 'window.indexedDB'.
  .open() takes 2 parameters: database name, and database version. The version starts at 1,
  and if any other number is detected it means tehre was a change in the database structure
*/

//this event will emit if the database version changes to establish a new database
request.onupgradeneeded = function (event) {
  //save a reference to the database
  const db = event.target.result;
  //create an object store (table) called 'new_pizza', set it to have an auto incrementing primary key of worts
  db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon a successful
request.onsuccess = function (event) {
  // when db is successfully created with its object store or simply established a connection, save reference to db in global variable
  db = event.target.result;

  // check if app is online, if yes, run uploadPizza() to send all local db data to api
  if (navigator.onLine) {
    uploadPizza();
  }
};

// upon an error
request.onerror = function (event) {
  console.log(event.target.errorCode);
};

// will execute if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
  // open a new transaction with the database with read and write permissions
  const transaction = db.transaction(['new_pizza'], 'readwrite');

  // access the object store for 'new_pizza'
  const pizzaObjectStore = transaction.objectStore('new_pizza');

  // add record to your store with add method
  pizzaObjectStore.add(record);

  // db.transaction(['new_pizza'], 'readwrite').objectStore('new_pizza').add(record)
}

//
function uploadPizza() {
  // open a transaction to the db
  const transaction = db.transaction(['new_pizza'], 'readwrite');

  // access the object store for 'new_pizza'
  const pizzaObjectStore = transaction.objectStore('new_pizza');

  // get all records from store and set to a variable (async function)
  const getAll = pizzaObjectStore.getAll();
  // upon successful .getAll() execution..
  getAll.onsuccess = function () {
    // if there was data, send it to the api server
    if (getAll.result.length > 0) {
      fetch('/api/pizzas', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open transaction
          const transaction = db.transaction(['new_pizza'], 'readwrite');
          // access the new_pizza objectstore
          const pizzaObjectStore = transaction.objectStore('new_pizza');
          // clear all items out
          pizzaObjectStore.clear();
          alert('All saved pizza has been submitted');
        })
        .catch((err) => console.log(err));
    }
  };
}

// listen for app coming back online
window.addEventListener('online', uploadPizza);
