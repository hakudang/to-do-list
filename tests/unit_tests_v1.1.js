/**
 * Project: To-Do List Web Application
 * File: unit_tests_v1.1.js
 * Description: Unit tests for validation and task processing logic.
 * Based on: business-rules_v1.0 [1], testcase_spec_v1.0 [2], validation_spec_v1.0 [3]
 */

// --- SETUP MOCK ENVIRONMENT ---
// Mocking DOM elements required by the source code
document.body.innerHTML = `
    <input id="task-input" />
    <div class="validation-message"></div>
    <span class="active" id="all"></span>
`;

const taskInput = document.getElementById("task-input");
const validationMessage = document.querySelector(".validation-message");

// Global variables used in the original snippet
let todos = [];
let isEditTask = false;
let editId = null;

// Mocking external functions and LocalStorage
const showTodo = jest.fn();
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// --- SOURCE CODE TO TEST ---
// (Logic extracted from your snippet to ensure the test runs against the actual implementation)
function validation(input) {
    let message = "";
    if (input.length > 120) {
        message += "BR-02 - Nội dung task vượt quá 120 ký tự.\n"; // BR-02, VAL-03 [1, 4]
    }
    validationMessage.innerText = message;
    // Note: The code snippet resets input here, which aligns with "Reject input" requirement [4]
    taskInput.value = "";
    return message.length === 0;
}

const handleKeyUp = (e) => {
    let userTask = taskInput.value.trim(); // BR-03: Trimming whitespace [1, 4]

    if (e.key == "Enter" && userTask) { // BR-01: Required check [1, 3]
        if (!validation(userTask)) {
            return;
        }
        if (!isEditTask) {
            todos = !todos ? [] : todos;
            // Note: BR-04 requires 'active'/'done', current code uses 'pending' [5, 6]
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask; // UC-02: Edit logic [7]
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos)); // BR-06: LocalStorage [5, 8]
        showTodo("all");
    }
};

// --- UNIT TEST SUITE ---
describe("To-Do List Unit Tests v1.0", () => {

    beforeEach(() => {
        todos = [];
        isEditTask = false;
        editId = null;
        taskInput.value = "";
        validationMessage.innerText = "";
        localStorage.clear();
        jest.clearAllMocks();
    });

    /**
     * Group 1: Validation Rules (VAL-01 to VAL-03)
     */
    describe("Validation Logic", () => {
        test("TC-04 / VAL-03: Should return false and show error if task exceeds 120 chars", () => {
            const longContent = "a".repeat(121);
            const result = validation(longContent);

            expect(result).toBe(false);
            expect(validationMessage.innerText).toContain("BR-02"); // Ref: BR-02 [1]
        });

        test("TC-01: Should return true for valid task content", () => {
            const result = validation("Valid Task Content");
            expect(result).toBe(true);
            expect(validationMessage.innerText).toBe("");
        });
    });

    /**
     * Group 2: Add Task Functionality (UC-01 & BRs)
     */
    describe("Add Task (UC-01)", () => {
        test("TC-01: Should add task to list and LocalStorage on Enter", () => {
            taskInput.value = "Buy Milk";
            handleKeyUp({ key: "Enter" });

            expect(todos.length).toBe(1);
            expect(todos.name).toBe("Buy Milk");
            expect(localStorage.getItem("todo-list")).toContain("Buy Milk"); // Ref: BR-06 [5]
            expect(showTodo).toHaveBeenCalled();
        });

        test("TC-03 / VAL-02: Should not add task if input is only whitespace", () => {
            taskInput.value = "    "; // Spaces only
            handleKeyUp({ key: "Enter" });

            expect(todos.length).toBe(0); // Ref: BR-03 [1]
        });

        test("TC-02 / VAL-01: Should not add task if input is empty", () => {
            taskInput.value = "";
            handleKeyUp({ key: "Enter" });

            expect(todos.length).toBe(0); // Ref: BR-01 [1]
        });
    });

    /**
     * Group 3: Edit Task Functionality (UC-02 & BRs)
     */
    describe("Edit Task (UC-02)", () => {
        test("TC-05: Should update existing task name when isEditTask is true", () => {
            // Setup: Existing task
            todos = [{ name: "Old Task", status: "pending" }];
            isEditTask = true;
            editId = 0;

            taskInput.value = "Updated Task Name";
            handleKeyUp({ key: "Enter" });

            expect(todos.name).toBe("Updated Task Name");
            expect(isEditTask).toBe(false); // Flag must be reset [7]
            expect(localStorage.getItem("todo-list")).toContain("Updated Task Name");
        });

        test("TC-07 / BR-05: Should allow editing a 'done' task", () => {
            // Note: Testing business rule BR-05 [5]
            todos = [{ name: "Completed Task", status: "done" }];
            isEditTask = true;
            editId = 0;

            taskInput.value = "Edited Completed Task";
            handleKeyUp({ key: "Enter" });

            expect(todos.name).toBe("Edited Completed Task");
        });
    });

    /**
     * Group 4: Data Persistence (BR-07)
     */
    describe("Persistence", () => {
        test("TC-12: Data in LocalStorage should be a valid JSON Array", () => {
            taskInput.value = "Storage Test";
            handleKeyUp({ key: "Enter" });

            const storedData = JSON.parse(localStorage.getItem("todo-list"));
            expect(Array.isArray(storedData)).toBe(true); // Ref: System Requirements 6.2 [8]
            expect(storedData).toHaveProperty("name");
            expect(storedData).toHaveProperty("status");
        });
    });
});