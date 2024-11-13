// Selectors
const addInput = document.querySelector(".add-input");
const addButton = document.querySelector(".add-button");
const todoList = document.querySelector(".todo-list")

// Event Listener
addButton.addEventListener("click", addTodo);
todoList.addEventListener("click", handleBtnClick);

// Functions
function addTodo(e) {
    e.preventDefault();
    const input = addInput.value;

    // 組 todo-list item
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const newTodo = document.createElement("li");
    newTodo.classList.add("todo-item")
    newTodo.innerHTML = input;
    todoDiv.appendChild(newTodo);

    const completedButton = document.createElement("button");
    completedButton.innerHTML = "<i class='fas fa-check'></i>";
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "<i class='fas fa-trash'></i>";
    deleteButton.classList.add("delete-btn");
    todoDiv.appendChild(deleteButton);

    // 組好的資料丟到todoList
    todoList.appendChild(todoDiv);

    addInput.value = "";
}

function handleBtnClick(e) {
    const item = e.target;
    const todo = item.parentElement;

    if (item.classList[0] === 'delete-btn') {
        todo.remove();
    }

    if (item.classList[0] === 'complete-btn') {
        todo.classList.toggle("completed");
    }
}