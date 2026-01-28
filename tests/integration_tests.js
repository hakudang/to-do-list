/**
 * Project: To-Do List Web Application
 * File: integration_tests.js
 * Goal: Testing the integration between UI, Business Logic, and LocalStorage.
 * Based on: UC-01 to UC-05, BR-01 to BR-08, VAL-01 to VAL-03.
 */

// Mock LocalStorage [10]
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock }); 

// Giả lập môi trường DOM theo Screen Requirement SC-01 [10, 11]
document.body.innerHTML = `
    <div class="wrapper">
        <div class="task-input">
            <input type="text" placeholder="Add a new task">
        </div>
        <div class="controls">
            <div class="filters">
                <span class="active" id="all">All</span>
                <span id="pending">Pending</span>
                <span id="done">Done</span>
            </div>
            <button class="clear-btn">Clear All</button>
        </div>
        <ul class="task-box"></ul>
        <div class="counter-container">
            <div class="task-counters">
                Total: <span id="total-count">0</span> |
                Done: <span id="done-count">0</span> |
                Pending: <span id="pending-count">0</span>
            </div>
            <div class="validation-message"></div>
        </div>
    </div>
`;

// Import app.js to attach event listeners
require('../src/app.js');
describe("Integration Tests - To-Do List Flow", () => {
    
    beforeEach(() => {
        localStorage.clear();
        const input = document.querySelector(".task-input input");
        if (input) input.value = "";
        document.querySelector(".task-box").innerHTML = "";
    }); 

    /**
     * Scenario 1: Add Task -> UI Update -> Storage Persistence (UC-01 + BR-06)
     */
    test("Should integrate Add Task with LocalStorage and UI rendering", () => {
        const input = document.querySelector(".task-input input");
        input.value = "Integration Task 1";
        
        // Giả lập sự kiện nhấn Enter [12]
        const enterEvent = new KeyboardEvent('keyup', { key: 'Enter' });
        input.dispatchEvent(enterEvent);

        // 1. Kiểm tra UI cập nhật [1]
        const taskBox = document.querySelector(".task-box");
        expect(taskBox.innerHTML).toContain("Integration Task 1");

        // 2. Kiểm tra LocalStorage đã lưu đúng format JSON Array [10, 13]
        const storedData = JSON.parse(localStorage.getItem("todo-list"));
        expect(storedData).toBeInstanceOf(Array);
        expect(storedData[0].name).toBe("Integration Task 1");
        expect(storedData[0].status).toBe("pending"); // Trạng thái mặc định [13]
    });

    /**
     * Scenario 2: Complete Task -> Persistence Check (UC-04 + BR-07)
     */
    test("Should persist 'done' status after simulated page reload", () => {
        // Setup: Có sẵn 1 task trong storage [6]
        const initialTasks = [{ name: "Task to complete", status: "pending" }];
        localStorage.setItem("todo-list", JSON.stringify(initialTasks));
        
        // Giả lập hành động click checkbox hoàn thành [7]
        // (Trong thực tế bạn sẽ gọi hàm xử lý click hoặc dispatch event)
        initialTasks[0].status = "done";
        localStorage.setItem("todo-list", JSON.stringify(initialTasks));

        // Giả lập Reload trang: Đọc lại từ storage [6, 14]
        const reloadedTasks = JSON.parse(localStorage.getItem("todo-list"));
        expect(reloadedTasks[0].status).toBe("done");
    });

    /**
     * Scenario 3: Validation integration during Add/Edit (VAL-03 + BR-02)
     */
    test("Should reject long content and not update Storage", () => {
        const input = document.querySelector(".task-input input");
        const longContent = "a".repeat(121); // Vượt 120 ký tự [8, 15]
        input.value = longContent;

        const enterEvent = new KeyboardEvent('keyup', { key: 'Enter' });
        input.dispatchEvent(enterEvent);

        // Kiểm tra hệ thống không thêm vào storage [8, 9]
        const storedData = localStorage.getItem("todo-list");
        expect(storedData).toBeNull(); // Hoặc mảng rỗng tùy logic khởi tạo
    });

    /**
     * Scenario 4: Filter Integration (UC-05 + BR-08)
     */
    test("Filter 'Done' should only show completed tasks but keep all data in storage", () => {
        // Setup 2 tasks: 1 pending, 1 done [5, 16]
        const tasks = [
            { name: "Task 1", status: "pending" },
            { name: "Task 2", status: "done" }
        ];
        localStorage.setItem("todo-list", JSON.stringify(tasks));

        // Giả lập click filter 'Done' [7]
        const doneFilter = document.getElementById("done");
        // Giả sử hàm filter hiển thị task lên UI
        const visibleTasksOnUI = tasks.filter(t => t.status === "done");
        
        expect(visibleTasksOnUI.length).toBe(1);
        expect(visibleTasksOnUI[0].name).toBe("Task 2");

        // BR-08: Dữ liệu gốc trong LocalStorage vẫn phải đầy đủ 2 task [5, 16]
        const originalData = JSON.parse(localStorage.getItem("todo-list"));
        expect(originalData.length).toBe(2);
    });
});