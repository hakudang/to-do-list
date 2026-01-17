
## 1️⃣ CR – Customer Requirements

(Yêu cầu khách hàng)

### CR-01. Mục tiêu

Khách hàng muốn một web app To-Do List đơn giản, chạy trên trình duyệt, giúp người dùng:

- Quản lý công việc cá nhân
- Theo dõi trạng thái hoàn thành
- Không cần đăng nhập
### CR-02. Đối tượng sử dụng

- Cá nhân (single user)
- Sử dụng trên PC / Mobile browser

### CR-03. Yêu cầu tổng quát

- Giao diện đơn giản, dễ dùng
- Thao tác nhanh: thêm / sửa / xóa / đánh dấu hoàn thành
- Dữ liệu không bị mất khi reload trang

### CR-04. Phạm vi

- Web app frontend-only
- Không yêu cầu server / database

## 2️⃣ FR – Functional Requirements

(Yêu cầu chức năng)

| FR-ID | Mô tả chức năng                            |
| ----- | ------------------------------------------ |
| FR-01 | Thêm task mới                              |
| FR-02 | Hiển thị danh sách task                    |
| FR-03 | Sửa nội dung task                          |
| FR-04 | Xóa task                                   |
| FR-05 | Đánh dấu task hoàn thành / chưa hoàn thành |
| FR-06 | Lọc task (All / Active / Done)             |
| FR-07 | Lưu dữ liệu local (reload không mất)       |

## 3️⃣ UC – Use Case Definition

(ユースケース定義書)

### UC-01 – Add Task

Actor: User

Mô tả: Thêm công việc mới

Pre-condition: Ứng dụng đã mở

Post-condition: Task được thêm vào danh sách

Basic Flow

User nhập nội dung task

User nhấn nút Add / Enter

System validate dữ liệu

System thêm task và hiển thị

### UC-02 – Edit Task

Actor: User

Mô tả: Sửa nội dung task

Basic Flow

User chọn task

User sửa nội dung

User xác nhận

System cập nhật task

### UC-03 – Delete Task

Actor: User

Mô tả: Xóa task

Basic Flow

User nhấn Delete

System xóa task khỏi danh sách

### UC-04 – Complete Task

Actor: User

Mô tả: Đánh dấu hoàn thành

Basic Flow

User click checkbox

System cập nhật trạng thái task

### UC-05 – Filter Tasks

Actor: User

Mô tả: Lọc danh sách task

Basic Flow

User chọn filter (All / Active / Done)

System hiển thị task tương ứng

## 4️⃣ ST – Screen Transition

(画面遷移定義)

Screen List
| Screen ID | Tên màn hình      |
| --------- | ----------------- |
| SC-01     | To-Do Main Screen |

Transition
| From  | Action      | To    |
| ----- | ----------- | ----- |
| SC-01 | Add task    | SC-01 |
| SC-01 | Edit task   | SC-01 |
| SC-01 | Delete task | SC-01 |
| SC-01 | Filter task | SC-01 |

👉 Single Page App – không có chuyển trang

## 5️⃣ BR – Business Rules

(業務ルール)

| BR-ID | Nội dung rule                          |
| ----- | -------------------------------------- |
| BR-01 | Task content là bắt buộc               |
| BR-02 | Task content tối đa 120 ký tự          |
| BR-03 | Không cho thêm task rỗng               |
| BR-04 | Task có 2 trạng thái: `active`, `done` |
| BR-05 | Task đã done vẫn cho phép sửa          |
| BR-06 | Dữ liệu phải lưu bằng LocalStorage     |
| BR-07 | Reload trang không làm mất dữ liệu     |
| BR-08 | Filter không làm thay đổi dữ liệu gốc  |

## 🎯 Nhận xét BrSE (quan trọng)

CR: nói vì sao làm

FR: nói làm được gì

UC: nói ai làm – làm thế nào

ST: nói màn hình phản ứng ra sao

BR: nói luật không được phá

👉 Với bộ này, dev chỉ việc code, QA viết test case không hỏi thêm, PM chốt scope rất nhanh.