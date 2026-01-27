const taskInput = document.querySelector(".task-input input");
const filters = document.querySelectorAll(".filters span");
const clearAll = document.querySelector(".clear-btn");
const taskBox = document.querySelector(".task-box");

let editId;
let isEditTask = false;
let todos = JSON.parse(localStorage.getItem("todo-list"));


filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) {
    let liTag = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let done = todo.status == "done" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${done}>
                                <p class="${done}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;

    updateCounters();

    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodo("all");

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "done";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))

    updateCounters();
}

function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo()
});

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    
    // BR-03: Non-Empty Task Content , chặn lỗi input rỗng
    if (e.key == "Enter" && userTask) {
        // validation
        if (!validation(userTask)) {
            return;
        }

        if (!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        
        // lưu vào localStorage
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});

function updateCounters() {
    const totalCounter = todos ? todos.length : 0;
    const doneCounter = todos ? todos.filter(todo => todo.status === 'done').length : 0;
    const pendingCounter = todos ? todos.filter(todo => todo.status === 'pending').length : 0;
    document.getElementById('total-count').innerText = totalCounter;
    document.getElementById('done-count').innerText = doneCounter;
    document.getElementById('pending-count').innerText = pendingCounter;
}

function validation(input) {
    let validationMessage = document.querySelector(".validation-message");
    let message = "";    

    // TC-02: VAL-01: Bỏ trống nội dung
    if (input.length === 0) {
        message += "TC-02: VAL-01: Bỏ trống nội dung\n";
    }
    // TC-03: VAL-02: Nội dung chỉ có khoảng trắng
    if (input.trim().length === 0) {
        message += "TC-03: VAL-02: Nội dung chỉ có khoảng trắng\n";
    }
    // TC-04: VAL-03: Nội dung quá dài
    if (input.length > 120) {
        message += "TC-04: VAL-03: Nội dung quá dài \n";
    }

    validationMessage.innerText = message;
    taskInput.value = "";

    // Return false nếu có lỗi, true nếu hợp lệ
    return message.length === 0;
}