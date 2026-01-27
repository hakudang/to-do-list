/**
 * unit_tests_v1.0.js
 * ------------------------------------------------------------
 * Cách chạy (khuyến nghị):
 * 1) HTML phải có tối thiểu các element sau (đúng class/id):
 *    - .task-input input
 *    - .filters span#all, span#pending, span#done (1 cái có class="active" lúc load)
 *    - .clear-btn
 *    - .task-box
 *    - #total-count, #done-count, #pending-count
 *    - .validation-message
 *
 * 2) Load theo thứ tự:
 *    <script src="app.js"></script>
 *    <script src="unit_tests_v1.0.js"></script>
 *
 * Ghi chú:
 * - File này test theo Test Case Spec + thực trạng app.js.
 * - Một số TC trong spec KHÔNG khớp app.js (data fields, cancel edit, XSS escape).
 *   Những test đó được đánh dấu XFAIL (expected fail) để bạn thấy GAP rõ ràng.
 * ------------------------------------------------------------
 */

/* ------------------------------
   Tiny Test Harness
-------------------------------- */
(function () {
  const results = [];
  const pad = (s, n = 2) => String(s).padStart(n, "0");

  function logBanner() {
    console.log("%cUNIT TESTS v1.0 - ToDo App", "font-weight:bold;font-size:14px");
  }

  function assert(condition, msg = "Assertion failed") {
    if (!condition) throw new Error(msg);
  }

  function equal(actual, expected, msg = "Expected values to be equal") {
    if (actual !== expected) {
      throw new Error(`${msg}\n  expected: ${expected}\n  actual:   ${actual}`);
    }
  }

  function deepEqual(actual, expected, msg = "Expected values to be deep-equal") {
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    if (a !== e) {
      throw new Error(`${msg}\n  expected: ${e}\n  actual:   ${a}`);
    }
  }

  function test(name, fn, opts = {}) {
    const { xfail = false } = opts;
    try {
      fn();
      if (xfail) {
        results.push({ name, status: "XFAIL-UNEXPECTED-PASS" });
      } else {
        results.push({ name, status: "PASS" });
      }
    } catch (err) {
      if (xfail) {
        results.push({ name, status: "XFAIL", error: String(err.message || err) });
      } else {
        results.push({ name, status: "FAIL", error: String(err.message || err) });
      }
    }
  }

  function summary() {
    const counts = results.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      },
      {}
    );

    console.log("------------------------------------------------------------");
    console.log(
      `Summary: PASS=${counts.PASS || 0}, FAIL=${counts.FAIL || 0}, XFAIL=${counts.XFAIL || 0}, XFAIL-UNEXPECTED-PASS=${counts["XFAIL-UNEXPECTED-PASS"] || 0}`
    );
    console.table(
      results.map((r, i) => ({
        "#": pad(i + 1),
        Status: r.status,
        Test: r.name,
        Error: r.error || "",
      }))
    );
  }

  /* ------------------------------
     Preconditions / Sanity
  -------------------------------- */
  function requireGlobals() {
    // app.js globals
    assert(typeof showTodo === "function", "showTodo() not found. Load app.js before tests.");
    assert(typeof updateStatus === "function", "updateStatus() not found.");
    assert(typeof editTask === "function", "editTask() not found.");
    assert(typeof deleteTask === "function", "deleteTask() not found.");
    assert(typeof validation === "function", "validation() not found.");
    assert(typeof updateCounters === "function", "updateCounters() not found.");
  }

  function requireDOM() {
    assert(window.taskInput instanceof HTMLElement || window.taskInput instanceof HTMLInputElement, "taskInput not initialized.");
    assert(document.querySelector(".task-input input"), "Missing .task-input input");
    assert(document.querySelector(".filters"), "Missing .filters");
    assert(document.querySelector(".filters span#all"), "Missing filter span#all");
    assert(document.querySelector(".filters span#pending"), "Missing filter span#pending");
    assert(document.querySelector(".filters span#done"), "Missing filter span#done");
    assert(document.querySelector(".clear-btn"), "Missing .clear-btn");
    assert(document.querySelector(".task-box"), "Missing .task-box");
    assert(document.getElementById("total-count"), "Missing #total-count");
    assert(document.getElementById("done-count"), "Missing #done-count");
    assert(document.getElementById("pending-count"), "Missing #pending-count");
    assert(document.querySelector(".validation-message"), "Missing .validation-message");
  }

  function resetAppState() {
    // Reset localStorage + in-memory todos to known state
    localStorage.removeItem("todo-list");
    window.todos = [];
    localStorage.setItem("todo-list", JSON.stringify(window.todos));

    // Ensure active filter exists (app.js expects "span.active")
    const active = document.querySelector(".filters span.active");
    if (!active) {
      const all = document.querySelector(".filters span#all");
      if (all) all.classList.add("active");
    }

    // Render clean
    showTodo("all");
  }

  function getTodosFromStorage() {
    try {
      return JSON.parse(localStorage.getItem("todo-list")) || [];
    } catch {
      return [];
    }
  }

  function setInputAndEnter(value) {
    taskInput.value = value;
    const ev = new KeyboardEvent("keyup", { key: "Enter", bubbles: true });
    taskInput.dispatchEvent(ev);
  }

  function addTask(value) {
    setInputAndEnter(value);
    return getTodosFromStorage();
  }

  function renderAll() {
    // keep filter consistent
    const all = document.querySelector(".filters span#all");
    document.querySelectorAll(".filters span").forEach((s) => s.classList.remove("active"));
    all.classList.add("active");
    showTodo("all");
  }

  function countRenderedTasks() {
    return document.querySelectorAll(".task-box .task").length;
  }

  function getRenderedTexts() {
    return Array.from(document.querySelectorAll(".task-box .task p")).map((p) => p.textContent);
  }

  function clickCheckboxByIndex(idx, checked) {
    renderAll();
    const cb = document.querySelector(`.task-box input[type="checkbox"]#${idx}`);
    assert(cb, `Checkbox #${idx} not found`);
    cb.checked = checked;
    updateStatus(cb);
  }

  /* ------------------------------
     Run
  -------------------------------- */
  logBanner();
  requireGlobals();
  requireDOM();

  // Make sure we start clean
  resetAppState();

  /* ------------------------------
     TC-01 .. TC-04 (Add + Validation)
  -------------------------------- */

  test("TC-01 Add task hợp lệ (pending default, saved to LocalStorage)", () => {
    resetAppState();
    const before = getTodosFromStorage().length;

    addTask("Buy milk");

    const todosNow = getTodosFromStorage();
    equal(todosNow.length, before + 1, "Task should be added");
    equal(todosNow[todosNow.length - 1].name, "Buy milk", "Task content should match");
    // Spec says "active" sometimes; app.js uses pending/done. We treat pending == active.
    equal(todosNow[todosNow.length - 1].status, "pending", "Default status should be pending");
    showTodo("all");
    assert(getRenderedTexts().includes("Buy milk"), "Task should be rendered");
  });

  test("TC-02 VAL-01: Bỏ trống nội dung -> không thêm", () => {
    resetAppState();
    const before = getTodosFromStorage().length;

    // app.js: Enter + userTask.trim() falsy => won't add
    setInputAndEnter("");

    const after = getTodosFromStorage().length;
    equal(after, before, "Should not add empty task");
  });

  test("TC-03 VAL-02: Nội dung chỉ khoảng trắng -> không thêm", () => {
    resetAppState();
    const before = getTodosFromStorage().length;

    setInputAndEnter("   ");

    const after = getTodosFromStorage().length;
    equal(after, before, "Should not add whitespace-only task");
  });

  test("TC-04 VAL-03: Nội dung > 120 -> reject, không tạo task + show message", () => {
    resetAppState();
    const before = getTodosFromStorage().length;
    const long121 = "A".repeat(121);

    setInputAndEnter(long121);

    const after = getTodosFromStorage().length;
    equal(after, before, "Should not add >120 chars task");
    const msg = document.querySelector(".validation-message").innerText || "";
    assert(msg.includes("BR-02"), "Validation message should mention BR-02");
  });

  /* ------------------------------
     TC-05 .. TC-08 (Edit)
  -------------------------------- */

  test("TC-05 Sửa task hợp lệ (<=120) -> cập nhật + lưu", () => {
    resetAppState();
    addTask("Buy milk");

    // Edit first task (id 0)
    const todos1 = getTodosFromStorage();
    // app.js uses index as id in UI; editTask takes (taskId, textName)
    editTask(0, todos1[0].name);

    setInputAndEnter("Buy milk and bread");

    const todos2 = getTodosFromStorage();
    equal(todos2[0].name, "Buy milk and bread", "Task should be updated");
  });

  test("TC-06 Hủy thao tác sửa (AF-01) -> KHÔNG SUPPORT trong app.js (XFAIL)", () => {
    // Spec says cancel (click outside / cancel). app.js does not implement explicit cancel behavior.
    resetAppState();
    addTask("Task A");

    editTask(0, "Task A");
    taskInput.value = "Changed but should cancel";

    // Simulate "cancel" - there's no handler in app.js, so we expect no change.
    // In reality: nothing happens until Enter. We'll trigger blur to simulate click-outside,
    // but app.js has no blur listener either.
    taskInput.blur();

    const todosNow = getTodosFromStorage();
    equal(todosNow[0].name, "Task A", "Should remain unchanged after cancel");
  }, { xfail: true });

  test("TC-07 BR-05: Sửa task đã done vẫn cho phép", () => {
    resetAppState();
    addTask("Task Done Editable");

    // Mark done
    clickCheckboxByIndex(0, true);

    const todos1 = getTodosFromStorage();
    equal(todos1[0].status, "done", "Should be done");

    editTask(0, todos1[0].name);
    setInputAndEnter("Edited even when done");

    const todos2 = getTodosFromStorage();
    equal(todos2[0].name, "Edited even when done", "Done task should still be editable");
    equal(todos2[0].status, "done", "Editing should not change done status");
  });

  test("TC-08 Validation khi sửa: rỗng hoặc >120 -> không cho lưu", () => {
    resetAppState();
    addTask("Task X");

    // Try edit to empty -> should not update (because Enter handler checks userTask)
    editTask(0, "Task X");
    setInputAndEnter("   ");
    let todosNow = getTodosFromStorage();
    equal(todosNow[0].name, "Task X", "Whitespace edit should not be saved");

    // Try edit to >120 -> validation() should block
    editTask(0, "Task X");
    setInputAndEnter("A".repeat(121));
    todosNow = getTodosFromStorage();
    equal(todosNow[0].name, "Task X", ">120 edit should not be saved");
  });

  /* ------------------------------
     TC-09 .. TC-11 (Status + Filter)
  -------------------------------- */

  test("TC-09 Chuyển đổi trạng thái pending ↔ done", () => {
    resetAppState();
    addTask("Toggle Me");

    clickCheckboxByIndex(0, true);
    let todosNow = getTodosFromStorage();
    equal(todosNow[0].status, "done", "Should be done");

    clickCheckboxByIndex(0, false);
    todosNow = getTodosFromStorage();
    equal(todosNow[0].status, "pending", "Should be pending again");
  });

  test("TC-10 Lọc danh sách: all/pending/done hiển thị đúng", () => {
    resetAppState();
    addTask("A");
    addTask("B");
    // Mark B done (index 1 if push order, but UI uses current array indices)
    // app.js pushes to end, so [0]=A, [1]=B
    clickCheckboxByIndex(1, true);

    // Filter all
    showTodo("all");
    equal(countRenderedTasks(), 2, "All should show 2");

    // Filter pending
    showTodo("pending");
    equal(countRenderedTasks(), 1, "Pending should show 1");
    deepEqual(getRenderedTexts(), ["A"], "Pending list should contain A");

    // Filter done
    showTodo("done");
    equal(countRenderedTasks(), 1, "Done should show 1");
    deepEqual(getRenderedTexts(), ["B"], "Done list should contain B");
  });

  test("TC-11 BR-08: Filter không làm thay đổi dữ liệu gốc (LocalStorage)", () => {
    resetAppState();
    addTask("A");
    addTask("B");
    clickCheckboxByIndex(1, true);

    const before = getTodosFromStorage();
    showTodo("pending");
    showTodo("done");
    showTodo("all");
    const after = getTodosFromStorage();

    deepEqual(after, before, "Filtering should not mutate stored data");
  });

  /* ------------------------------
     TC-12 .. TC-13 (Storage / Persistence)
  -------------------------------- */

  test("TC-12 Spec yêu cầu fields id/title/created_at/updated_at nhưng app.js KHÔNG có (XFAIL)", () => {
    resetAppState();
    addTask("Field Check");

    const data = getTodosFromStorage();
    assert(data.length === 1, "Should have 1 task");
    // Spec expectation
    assert("id" in data[0], "Missing id");
    assert("title" in data[0], "Missing title");
    assert("created_at" in data[0], "Missing created_at");
    assert("updated_at" in data[0], "Missing updated_at");
  }, { xfail: true });

  test("TC-12 (Implementation reality): localStorage stores {name,status}", () => {
    resetAppState();
    addTask("Impl Check");

    const data = getTodosFromStorage();
    assert(data.length === 1, "Should have 1 task");
    assert(typeof data[0].name === "string", "Should have name:string");
    assert(data[0].status === "pending" || data[0].status === "done", "Should have status pending/done");
  });

  test("TC-13 BR-07: Persistence (F5/reload) giữ nguyên dữ liệu", () => {
    resetAppState();
    addTask("Keep 1");
    addTask("Keep 2");
    clickCheckboxByIndex(1, true); // mark Keep 2 done

    // Simulate reload: re-read todos from storage, then render
    window.todos = JSON.parse(localStorage.getItem("todo-list"));
    showTodo("all");

    equal(countRenderedTasks(), 2, "After reload render should still show 2 tasks");
    const texts = getRenderedTexts();
    assert(texts.includes("Keep 1") && texts.includes("Keep 2"), "Tasks should remain after reload");

    // Status should remain
    const data = getTodosFromStorage();
    equal(data[0].name, "Keep 1");
    equal(data[1].name, "Keep 2");
    equal(data[1].status, "done");
  });

  /* ------------------------------
     Security check from spec (XSS)
     app.js uses innerHTML with todo.name => XSS risk
  -------------------------------- */
  test('Security: input "<script>alert(1)</script>" should be escaped (XFAIL)', () => {
    resetAppState();
    const payload = `<script>window.__xss_ran = true;</script>`;
    window.__xss_ran = false;

    addTask(payload);
    showTodo("all");

    // Expect NOT to contain raw script tag in DOM (should be escaped)
    const html = document.querySelector(".task-box").innerHTML;
    assert(!html.includes("<script>"), "Should not render raw <script> tag");
    assert(window.__xss_ran === false, "Script must not execute");
  }, { xfail: true });

  /* ------------------------------
     Optional: delete / clear all sanity
  -------------------------------- */
  test("DeleteTask removes correct item and updates storage", () => {
    resetAppState();
    addTask("A");
    addTask("B");
    // delete first item (id=0) while filter 'all'
    deleteTask(0, "all");

    const data = getTodosFromStorage();
    equal(data.length, 1, "Should have 1 task after delete");
    equal(data[0].name, "B", "Remaining should be B");
  });

  test("ClearAll removes all items and clears UI", () => {
    resetAppState();
    addTask("A");
    addTask("B");

    // click clear button (listener already bound in app.js)
    document.querySelector(".clear-btn").click();

    const data = getTodosFromStorage();
    equal(data.length, 0, "Storage should be empty after clear");
    showTodo("all");
    equal(countRenderedTasks(), 0, "UI should show no task items");
  });

  summary();
})();
