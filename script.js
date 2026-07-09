// "use strict";

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const todosList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const emptyState = document.querySelector(".empty-state");
const dateElement = document.getElementById("date");
const filters = document.querySelectorAll(".filter");
const themeBtn = document.querySelector("#theme-button");
const themeIcon = document.querySelector("#theme-button i");

let todos = [];
let currentFilter = "all";
checkEmptyState();
setDate();

addTaskBtn.addEventListener("click", () => {
  addTodo(taskInput.value);
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo(taskInput.value);
});

clearCompletedBtn.addEventListener("click", clearCompleted);

function addTodo(text) {
  if (text.trim() === "") return;

  const todo = {
    id: Date.now(),
    text,
    completed: false,
  };

  todos.push(todo);
  saveTodos();
  renderTodos();
  taskInput.value = "";
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
  updateItemsCount();
  checkEmptyState();
}

function updateItemsCount() {
  const uncompletedTodos = todos.filter((todo) => !todo.completed);

  itemsLeft.textContent = `${uncompletedTodos.length} item${
    uncompletedTodos.length !== 1 ? "s" : ""
  } left `;
}

function checkEmptyState() {
  const filteredTodos = filterTodos(currentFilter);
  if (filteredTodos.length === 0) emptyState.classList.remove("hidden");
  else emptyState.classList.add("hidden");
}

function filterTodos(filter) {
  switch (filter) {
    case "active":
      return todos.filter((todo) => !todo.completed);
    case "completed":
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
}

function renderTodos() {
  todosList.innerHTML = "";

  const filteredTodos = filterTodos(currentFilter);

  filteredTodos.forEach((todo) => {
    //// creating li elem and checking if the task is completed ///
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    if (todo.completed) todoItem.classList.add("completed");

    ////// creating label elem and add class checkbox-conatainer ///
    const checkboxContainer = document.createElement("label");
    checkboxContainer.classList.add("checkbox-container");

    ////// creation input ( checkbox ) elem and toggling it ////
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("todo-checkbox");
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    /////creating check mark /////
    const checkmark = document.createElement("span");
    checkmark.classList.add("checkmark");

    ///// appending checkbox and check mark in the checkbox container ////
    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(checkmark);

    //// creating todotext ///
    const todoText = document.createElement("span");
    todoText.classList.add("todo-item-text");
    todoText.textContent = todo.text;

    ///// feature to edit task by double click on it ////
    todoText.addEventListener("dblclick", () => editTodo(todo.id));

    ////// creating edit button ///

    const edtBtn = document.createElement("button");
    edtBtn.classList.add("edit-btn");
    edtBtn.innerHTML = `<i class="ph ph-pencil"></i>`;
    edtBtn.addEventListener("click", () => editTodo(todo.id));

    /// creating delete button

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = `<i class="ph ph-trash"></i>`;
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    todoItem.appendChild(checkboxContainer);
    todoItem.appendChild(todoText);
    todoItem.appendChild(edtBtn);
    todoItem.appendChild(deleteBtn);
    // todoItem.append(checkboxContainer,todoText,edtBtn,deleteBtn)

    todosList.append(todoItem);
  });
}

//////// theme change /////

themeBtn.addEventListener("click", toggleTheme);

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");

  if (isDark) {
    themeIcon.className = "ph ph-sun";
  } else {
    themeIcon.className = "ph ph-moon";
  }

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light",
  );
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeIcon.className = "ph ph-sun";
  }
  else{
    themeIcon.className = "ph ph-moon";
  }
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

function editTodo(id) {
  const todo = todos.find((todo) => todo.id === id);
  const newText = prompt("Edit the task", todo.text);
  if (newText.trim() === "") return;

  todo.text = newText;
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function loadTodos() {
  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) todos = JSON.parse(storedTodos);
  renderTodos();
  checkEmptyState();
}

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    setActiveFilter(filter.getAttribute("data-filter"));
  });
});

function setActiveFilter(filter) {
  currentFilter = filter;

  filters.forEach((item) => {
    if (item.getAttribute("data-filter") === filter) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
  renderTodos();
}

function setDate() {
  const options = { weekday: "long", month: "short", day: "numeric" };
  const today = new Date();

  dateElement.textContent = today.toLocaleDateString("en-US", options);
}

window.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  loadTheme();
  updateItemsCount();
  setDate();
});
