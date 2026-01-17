# 要件定義書（System Requirements）

To-Do List Web Application
```
Version : 1.0  
Status  : Draft → To be Frozen  
Scope   : Frontend only (HTML / CSS / JavaScript)
```
## 1. システム概要（System Overview）
### 1.1 目的（Purpose）

Hệ thống To-Do List được xây dựng nhằm hỗ trợ người dùng quản lý công việc cá nhân một cách đơn giản, trực quan, không cần đăng nhập, sử dụng trực tiếp trên trình duyệt web.

### 1.2 背景（Background）
- Người dùng cần một công cụ nhẹ, nhanh để ghi chú và theo dõi task hằng ngày
- Không yêu cầu server, tài khoản hay kết nối backend
- Phù hợp làm mini project đào tạo BrSE / Frontend cơ bản

## 2. 利用者（Users）
| Loại người dùng | Mô tả                                    |
| --------------- | ---------------------------------------- |
| User            | Cá nhân sử dụng web app trên trình duyệt |

👉 Không phân quyền, không role

## 3. システム構成（System Configuration）
### 3.1 Kiến trúc tổng thể

- Client-side only
- Single Page Application (SPA)
- Lưu trữ dữ liệu bằng LocalStorage

```
Browser
 ├─ HTML (UI structure)
 ├─ CSS (UI design)
 └─ JavaScript
      ├─ Logic xử lý task
      └─ LocalStorage
```
## 4. 機能要件（Functional Requirements – 再掲）
| FR-ID | Nội dung                       |
| ----- | ------------------------------ |
| FR-01 | Thêm task                      |
| FR-02 | Hiển thị danh sách task        |
| FR-03 | Sửa task                       |
| FR-04 | Xóa task                       |
| FR-05 | Đánh dấu hoàn thành            |
| FR-06 | Lọc task (All / Active / Done) |
| FR-07 | Lưu dữ liệu local              |

👉 Chi tiết xử lý được định nghĩa tại UC & BR

## 5. 非機能要件（Non-Functional Requirements）
### 5.1 Usability（Khả dụng）

- Giao diện đơn giản, dễ hiểu
- Thao tác tối đa 1–2 bước cho mỗi hành động
- Có phản hồi UI ngay sau thao tác (add/edit/delete)

### 5.2 Performance（Hiệu năng）
- Thêm / sửa / xóa task phản hồi < 1 giây
- Chạy mượt với ≤ 1,000 task

### 5.3 Compatibility（Tương thích）

- Chrome / Edge / Firefox (latest)
- Responsive cho PC & Mobile

### 5.4 Reliability（Độ tin cậy）

- Reload trang không mất dữ liệu
- Không crash khi LocalStorage rỗng

### 5.5 Security（Bảo mật – mức tối thiểu）

- Không xử lý dữ liệu nhạy cảm
- Không thực thi script từ input user (escape HTML)

## 6. データ要件（Data Requirements）
### 6.1 Đối tượng dữ liệu: Task
| Field      | Type     | Mô tả              |
| ---------- | -------- | ------------------ |
| id         | string   | Định danh duy nhất |
| title      | string   | Nội dung task      |
| status     | enum     | active / done      |
| created_at | datetime | Thời điểm tạo      |
| updated_at | datetime | Thời điểm cập nhật |

### 6.2 Lưu trữ

- LocalStorage (key cố định)
- Format: JSON Array

## 7. 画面要件（Screen Requirements）
### 7.1 Danh sách màn hình
| Screen ID | Tên               |
| --------- | ----------------- |
| SC-01     | To-Do Main Screen |

### 7.2 Thành phần chính

- Input nhập task
- Button Add
- Task list
- Checkbox hoàn thành
- Button Edit / Delete
- Filter buttons (All / Active / Done)

## 8. ユースケース対応表（Traceability）
| UC-ID          | FR-ID | Screen |
| -------------- | ----- | ------ |
| UC-01 Add      | FR-01 | SC-01  |
| UC-02 Edit     | FR-03 | SC-01  |
| UC-03 Delete   | FR-04 | SC-01  |
| UC-04 Complete | FR-05 | SC-01  |
| UC-05 Filter   | FR-06 | SC-01  |

## 9. 業務ルール参照（Business Rules）

- BR-01 ～ BR-08
→ Tham chiếu chi tiết tại tài liệu 業務ルール（BR）

## 10. スコープ外（Out of Scope）

- Đăng nhập / đăng ký
- Backend / API
- Đồng bộ cloud
- Multi-user / chia sẻ task

## 11. 前提条件・制約（Assumptions & Constraints）

- Chỉ chạy trên browser
- Không đảm bảo dữ liệu nếu user xóa cache trình duyệt
- Không yêu cầu SEO

## 🔒 Logic Freeze Check (BrSE góc nhìn)

- Scope rõ ✔
- Actor đơn giản ✔
- UC ↔ FR ↔ BR ↔ Screen map đầy đủ ✔
- Không có open point ✔

👉 Tài liệu này đủ điều kiện “Freeze v1.0”.