const toDoForm = document.querySelector(".todo-form");
const toDoContent = document.querySelector(".todo-content");
const toDoDueDate = document.querySelector(".todo-duedate");
const toDoList = document.querySelector(".todo-list");
const toggleToDoForm = document.querySelector(".toggle-form");

const TODO_KEY = "toDos";

let toDos = [];

function handleToggleFrom() {
  toDoForm.hidden = !toDoForm.hidden;
}

function registerToDo() {
  localStorage.setItem(TODO_KEY, JSON.stringify(toDos));
}

function editToDo(event) {
  const curItem = event.target.parentElement.parentElement;
  const content = curItem.querySelector(".content");
  const dueDate = curItem.querySelector(".due-date");

  //input으로 변경 content & due date
  const editForm = document.createElement("form");
  editForm.id = curItem.id;
  editForm.className = "todo";
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  const inputContent = document.createElement("input");
  inputContent.className = "content";
  inputContent.type = "content";
  inputContent.value = content.innerText;
  inputContent.required = "true";
  const inputDueDate = document.createElement("input");
  inputDueDate.className = "due-date";
  inputDueDate.type = "date";
  inputDueDate.value = dueDate.innerText;
  inputDueDate.required = "true";
  const saveBtn = document.createElement("button");
  saveBtn.innerText = "save";
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "delete";

  editForm.appendChild(checkBox);
  editForm.appendChild(inputDueDate);
  editForm.appendChild(inputContent);
  editForm.appendChild(saveBtn);
  editForm.appendChild(deleteBtn);
  toDoList.replaceChild(editForm, curItem);

  //save changes
  editForm.addEventListener("submit", handleEditSubmit);
  deleteBtn.addEventListener("click", removeToDo);
}

function handleEditSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const content = form.querySelector(".content");
  const dueDate = form.querySelector(".due-date");
  const editedTodo = {
    date: dueDate.value,
    content: content.value,
    id: form.id,
  };
  toDos = toDos.map((toDo) =>
    toDo.id == parseInt(editedTodo.id)
      ? { ...toDo, date: editedTodo.date, content: editedTodo.content }
      : toDo
  );
  registerToDo();
  printEditedTodo(form, editedTodo);
}

function printEditedTodo(form, editedToDo) {
  const div = paintToDo(editedToDo);
  toDoList.replaceChild(div, form);
}

function removeToDo(event) {
  const div = event.target.parentElement.parentElement;
  div.remove();
  toDos = toDos.filter((toDo) => toDo.id !== parseInt(div.id));
  registerToDo();
}

function handleToDoSubmit(event) {
  event.preventDefault();
  const newToDoObject = {
    date: toDoDueDate.value,
    content: toDoContent.value,
    id: Date.now(),
  };
  toDos.push(newToDoObject);
  toDoContent.value = "";
  toDoDueDate.value = "";
  registerToDo();
  toDoList.appendChild(paintToDo(newToDoObject));
}

function paintToDo(newToDo) {
  const item = document.createElement("div");
  item.id = newToDo.id;
  item.className = "todo";
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  const dueDate = document.createElement("span");
  dueDate.className = "due-date";
  dueDate.innerText = newToDo.date;
  const content = document.createElement("span");
  content.className = "content";
  content.innerText = newToDo.content;
  const editBtn = document.createElement("button");
  const editSpan = document.createElement("span");
  editSpan.innerText = "edit";
  editBtn.appendChild(editSpan);
  const deleteBtn = document.createElement("button");
  const deleteSpan = document.createElement("span");
  deleteSpan.innerText = "delete";
  deleteBtn.appendChild(deleteSpan);
  editBtn.addEventListener("click", editToDo);
  deleteBtn.addEventListener("click", removeToDo);
  item.appendChild(checkBox);
  item.appendChild(dueDate);
  item.appendChild(content);
  item.appendChild(editBtn);
  item.appendChild(deleteBtn);
  return item;
}

toDoForm.addEventListener("submit", handleToDoSubmit);

toggleToDoForm.addEventListener("click", handleToggleFrom);

const savedToDos = localStorage.getItem(TODO_KEY);

if (savedToDos !== null) {
  const parsedToDos = JSON.parse(savedToDos);
  toDos = parsedToDos;
  parsedToDos.forEach((prevToDo) => toDoList.appendChild(paintToDo(prevToDo)));
}
