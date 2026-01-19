const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');

// Cập nhật bộ đếm task counters 
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

function addTask() {
    const task = inputBox.value.trim(); // Trim whitespace
    if (!task) {
        alert("You must write something!");
        return;
    }

    // FR-01 | Thêm task mới
    const li = document.createElement('li');

    li.innerHTML = `
    <label>
        <input type='checkbox'/>
        <span> ${task}</span>
    </label>
    <span class='edit-btn'>Edit</span>
    <span class='delete-btn'>Delete</span>
    `;

    listContainer.appendChild(li);
    inputBox.value = "";
    updateCounters();

    const checkbox = li.querySelector("input");
    const editBtn = li.querySelector(".edit-btn");
    const taskSpan = li.querySelector("span");
    const deleteBtn = li.querySelector(".delete-btn");

    // FR-05 | Đánh dấu hoàn thành
    // Gắn event listener cho checkbox
    checkbox.addEventListener("click", function () {
        // thêm hoặc bỏ class "completed" cho thẻ <li>
        li.classList.toggle("completed", checkbox.checked);

        // Cập nhật bộ đếm nhiệm vụ
        updateCounters();
    });

    // FR-03 | Sửa task
    editBtn.addEventListener("click", function () {
        const update = prompt("Edit task:", taskSpan.textContent);
        if (update !== null) {
            taskSpan.textContent = update;
            li.classList.remove("completed");
        }

        //add the code below
        checkbox.checked = false;
        updateCounters();
    });


}

function updateCounters() {
    const completedTasks = document.querySelectorAll(".completed").length;
    const uncompletedTasks =
        document.querySelectorAll("li:not(.completed)").length;

    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;
}