const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const itemList = document.querySelector("#item-list");
const clearBtn = document.querySelector("#clear");
const itemFilter = document.querySelector("#filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

// functions
const displayItems = () => {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
};

const onAddItemSubmit = (e) => {
  e.preventDefault();

  const newItem = itemInput.value;

  // Validate Input
  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeItemFromStorate(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert("That item already exists");
      return;
    }
  }

  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = "";
};

const addItemToDOM = (item) => {
  // Create list item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  // Add li to the DOM
  itemList.appendChild(li);
};

const createButton = (classes) => {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
};

const createIcon = (classes) => {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
};

const addItemToStorage = (item) => {
  const itemsFromStorage = getItemsFromStorage();

  // Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};

const getItemsFromStorage = () => {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
};

const onClickItem = (e) => {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
};

const checkIfItemExists = (item) => {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
};

const setItemToEdit = (item) => {
  isEditMode = true;

  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = "#228b22";
  itemInput.value = item.textContent;
  itemInput.focus();
};

const removeItem = (item) => {
  if (confirm("Are you sure?")) {
    // Remove item from DOM
    item.remove();

    // Remove item from storage
    removeItemFromStorate(item.textContent);

    checkUI();
  }
};

const removeItemFromStorate = (item) => {
  let itemsFromStorage = getItemsFromStorage();

  //Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Reset to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};

const clearItems = (e) => {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // Clear from local storage
  localStorage.removeItem("items");

  checkUI();
};

const filterItems = (e) => {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll("li");

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
};

const checkUI = () => {
  itemInput.value = "";

  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    itemFilter.classList.add("hidden");
    clearBtn.classList.add("hidden");
  } else {
    itemFilter.classList.remove("hidden");
    clearBtn.classList.remove("hidden");
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";

  isEditMode = false;
};

const hello = "hello";

// Initialize app
const init = () => {
  // Event Listeners
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);
  checkUI();
};

init();
