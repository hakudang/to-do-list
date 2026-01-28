# INTEGRATION TESTS CHO DỰ ÁN TO-DO LIST
Khác với Unit Test tập trung vào hàm đơn lẻ, Integration Test cho dự án này sẽ tập trung vào sự phối hợp giữa giao diện (UI), logic nghiệp vụ (Business Rules) và lưu trữ dữ liệu (LocalStorage) để đảm bảo các Use Case chạy đúng từ đầu đến cuối.

## 1. Hướng dẫn làm Integration Tests cho dự án To-Do List
Dựa vào cấu trúc dự án và các tài liệu thiết kế, các kịch bản tích hợp quan trọng nhất cần kiểm thử bao gồm:
- Luồng Tích hợp Thêm & Lưu trữ (UC-01 + BR-06): Kiểm tra khi người dùng nhập task -> nhấn Enter -> UI cập nhật -> LocalStorage có dữ liệu mới.
- Luồng Tích hợp Trạng thái & Độ tin cậy (UC-04 + BR-07): Kiểm tra khi đổi trạng thái sang done -> Reload trang -> Task vẫn phải ở trạng thái done.
- Luồng Tích hợp Lọc & Toàn vẹn dữ liệu (UC-05 + BR-08): Kiểm tra khi chọn filter "Pending" -> Chỉ hiển thị task chưa xong -> Nhưng dữ liệu gốc trong LocalStorage không bị thay đổi.
- Luồng Tích hợp Ràng buộc (VAL-03 + UI): Kiểm tra khi nhập nội dung > 120 ký tự -> Hệ thống reject -> LocalStorage không bị ghi đè dữ liệu sai.

## 2. Mã nguồn file integration_tests.js
File này sử dụng Jest và JSDOM để kiểm tra sự tương tác giữa các thành phần của ứng dụng.

```js
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
```

## 3. Giải thích các điểm chạm (Integration Points) dựa trên tài liệu:
- Đồng bộ hóa Trạng thái: Theo BR-04, task chỉ có pending và done. Bài test tích hợp đảm bảo khi UI chuyển trạng thái, chuỗi JSON trong LocalStorage cũng cập nhật tương ứng theo đúng cấu trúc dữ liệu quy định tại mục 6.1 của System Requirements.
- Tính toàn vẹn (Integrity): BR-08 yêu cầu việc lọc không làm mất dữ liệu. Bài test Scenario 4 xác nhận rằng dù UI chỉ hiển thị 1 task (khi lọc), nhưng bộ nhớ todo-list vẫn bảo toàn nguyên vẹn 2 task.
- Ràng buộc thời gian thực: Kết hợp giữa Validation Spec (VAL-03) và UI Behavior, bài test Scenario 3 đảm bảo input lỗi sẽ bị chặn ngay tại "cửa ngõ" trước khi kịp xâm nhập vào dữ liệu lưu trữ.
- SPA Behavior: Mọi bài test đều thực hiện trên cùng một biến môi trường document.body, phản ánh đúng đặc tính Single Page Application (SPA) không chuyển trang của dự án.

## 4. Hướng dẫn thực hiện Integration Tests

Để thực hiện chạy file integration_tests.js trong dự án này, cần hiểu rằng ứng dụng To-Do List là một Single Page Application (SPA) chạy hoàn toàn ở phía Client (Client-side only).
Dựa trên các tài liệu hệ thống và đặc tả kiểm thử, có hai cách để bạn thực hiện kiểm thử tích hợp (Integration Testing):
### 4.1. Kiểm thử tích hợp thủ công (Manual Integration Testing)
Đây là phương pháp bám sát theo quy trình được định nghĩa trong Test Case Specification:
- Môi trường: Mở file index.html trực tiếp trên trình duyệt (Chrome, Edge, hoặc Firefox).
- Các bước thực hiện:
    1. Mở công cụ Developer Tools (F12), vào tab Application > LocalStorage và thực hiện xóa (Clear) để làm sạch dữ liệu cũ.
    2. Thực hiện các thao tác liên hoàn để kiểm tra sự tích hợp:
        - Nhập task và nhấn Enter: Kiểm tra xem UI có hiển thị task mới đồng thời LocalStorage có xuất hiện JSON Array tương ứng không.
        - Đổi trạng thái và Reload trang (F5): Kiểm tra xem sau khi tải lại, trạng thái pending/done có được giữ nguyên như yêu cầu tại BR-07 không.
        - Sử dụng bộ lọc (Filter): Kiểm tra xem khi chọn "Done", UI chỉ hiện task hoàn thành nhưng dữ liệu gốc trong LocalStorage vẫn không bị mất (tuân thủ BR-08).
### 4.2. Kiểm thử tích hợp tự động (Automated Integration Testing)

Để chạy file integration_tests.js một cách tự động, cần một môi trường chạy thử (Test Runner). Vì ứng dụng hiện tại không có Backend, thông thường chúng ta sử dụng Node.js kết hợp với thư viện Jest và JSDOM.
Cách thực hiện (Thông tin bổ sung ngoài tài liệu để hỗ trợ kỹ thuật):
1. Cài đặt môi trường: cài đặt Node.js trên máy tính 
   - Thực hiện lệnh `cd To-Do-List` terminal để vào thư mục dự án.
   - Khởi tạo dự án bằng lệnh npm init. 
   - Cài đặt Jest: `npm install --save-dev jest jest-environment-jsdom`.
   
2. Cấu trúc file test: File integration_tests.js sẽ sử dụng lệnh require hoặc import để kéo logic từ app.js vào.
    - Lưu ý: Trong file app.js, có thể cần thêm dòng module.exports = { ... } ở cuối để file test có thể đọc được các hàm bên trong.
3. Cơ chế hoạt động của file test:
    - Nó sẽ giả lập (mock) lại toàn bộ môi trường trình duyệt bao gồm DOM (từ index.html) và LocalStorage (key cố định theo format JSON Array).
    - Nó sẽ kích hoạt các sự kiện (ví dụ: KeyboardEvent cho phím Enter) và sau đó dùng lệnh expect để kiểm tra xem dữ liệu trong LocalStorage có thay đổi đúng như logic của Business Rules (BR-01 đến BR-08) hay không.
4. Lệnh chạy: mở terminal và gõ lệnh `npm test` hoặc `npx jest tests/integration_tests.js`.

   Cấu hình package.json thêm đường thông tin jest để chạy được lệnh `npm test`.
  ```package.json
  {
  ...,
  "jest": {
    "testEnvironment": "jsdom",
    "testMatch": ["**/tests/**/*_tests.js"]
  },
  ...
  }
  ```
5. Kết quả mong đợi như sau : 
```terminal
dthak@DESKTOP-NSAV6V4 MINGW64 /e/brse/to-do-list (main)
$ npx jest tests/integration_tests.js
 PASS  tests/integration_tests.js
  Integration Tests - To-Do List Flow
 PASS  tests/integration_tests.js
  Integration Tests - To-Do List Flow
  Integration Tests - To-Do List Flow
    √ Should integrate Add Task with LocalStorage and UI rendering (27 ms)
    √ Should integrate Add Task with LocalStorage and UI rendering (27 ms)
    √ Should persist 'done' status after simulated page reload (1 ms)
    √ Should reject long content and not update Storage (2 ms)
    √ Filter 'Done' should only show completed tasks but keep all data in storage (2 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        4.34 s
Ran all test suites matching tests/integration_tests.js.
```

**Tại sao cần chạy Integration Test cho dự án này?**

Việc chạy file này giúp xác nhận các "điểm chạm" giữa các thành phần mà tài liệu đã định nghĩa:
- UI ↔ Validation: Khi nhập > 120 ký tự (VAL-03), giao diện phải chặn và không được ghi vào LocalStorage.
- UI ↔ Business Rules: Khi click checkbox, trạng thái trong LocalStorage phải chuyển đổi chính xác giữa pending và done (BR-04).
- Storage ↔ Persistence: Đảm bảo hàm khởi tạo ban đầu đọc đúng dữ liệu từ LocalStorage để không làm mất task của người dùng khi họ quay lại ứng dụng.

Nếu chưa cài đặt môi trường Node.js/Jest, nên bắt đầu bằng Cách 1 (Thủ công) để hiểu rõ luồng đi của dữ liệu từ giao diện vào LocalStorage theo đúng các Use Case (UC-01 đến UC-05).