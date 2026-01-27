# TEST CASE SPECIFICATION
To-Do List Web Application
```
Version : 1.0  
Status  : Draft → To be Frozen
Applies : All Use Cases
Scope   : Frontend Web App
```
## 1. Thông tin chung
- Mục tiêu: Kiểm thử các chức năng, quy tắc nghiệp vụ (BR) và đặc tả kiểm tra dữ liệu (VAL) của hệ thống.
- Phạm vi: Tập trung vào các Use Case cốt lõi (UC-01 đến UC-05) và các quy tắc Validation.
- Môi trường: Trình duyệt Web (PC/Mobile), kiến trúc SPA.

## 2. Kịch bản kiểm thử chi tiết
### 2.1 Nhóm Kiểm thử Thêm Task (UC-01 & Validation)
Nhóm này tập trung vào việc xác thực dữ liệu đầu vào theo Validation Spec và Business Rules.
| ID | Mục tiêu kiểm thử | Các bước thực hiện | Kết quả mong đợi | Tham chiếu |
|----|------------------|-------------------|------------------|------------|
| TC-01 | Thêm task hợp lệ | 1. Nhập nội dung task hợp lệ.<br>2. Nhấn Enter. | Task mới hiển thị trong danh sách. Trạng thái mặc định là pending. Dữ liệu lưu vào LocalStorage. |FR-01, UC-01, BR-04 |
| TC-02 | VAL-01: Bỏ trống nội dung | 1. Để trống ô nhập liệu.<br>2. Nhấn Enter. | Hệ thống không thêm task, giữ nguyên màn hình hiện tại. Hiển thị lỗi. |BR-01, VAL-01 |
| TC-03 | VAL-02: Nội dung chỉ có khoảng trắng | 1. Nhập "   " (space) hoặc tab vào ô input.<br>2. Nhấn Enter. | Hệ thống không tạo task, không cập nhật dữ liệu. Hiển thị lỗi. |BR-03, VAL-02 |
| TC-04 | VAL-03: Nội dung quá dài | 1. Nhập nội dung > 120 ký tự.<br>2. Nhấn Enter. | Hệ thống reject input, không tạo task (không tự động cắt chuỗi). Hiển thị lỗi.| BR-02, VAL-03 |

### 2.2 Nhóm Kiểm thử Chỉnh sửa Task (UC-02 & Business Rules)

Kiểm tra khả năng cập nhật và các ràng buộc khi sửa nội dung.
| ID | Mục tiêu kiểm thử |Các bước thực hiện | Kết quả mong đợi | Tham chiếu |
|----|------------------|-------------------|------------------|------------|
| TC-05 | Sửa task hợp lệ | 1. Chọn Edit trên task.<br>2. Nhập nội dung mới (<= 120 ký tự).<br>3. Nhấn Enter. | Nội dung task được cập nhật thành công và lưu lại. | UC-02, FR-03 |
| TC-06 | Hủy thao tác sửa | 1. Chọn task đang sửa.<br>2. Nhấn Esc (hoặc click ra ngoài tùy UI). | Hệ thống không thay đổi dữ liệu cũ. | UC-02 (AF-01) |
| TC-07 | BR-05: Sửa task đã hoàn thành | 1. Chọn Edit trên task có trạng thái done.<br>2. Chỉnh sửa nội dung và lưu. | Hệ thống vẫn cho phép sửa nội dung ngay cả khi task đã xong. | BR-05, UC-02 |
| TC-08 | Validation khi sửa | Thực hiện sửa task với nội dung rỗng hoặc > 120 ký tự. | Áp dụng tương tự VAL-01, VAL-02, VAL-03: Không cho phép lưu dữ liệu mới. | VAL-01, 02, 03 |

### 2.3 Nhóm Kiểm thử Trạng thái & Hiển thị (UC-04, UC-05 & BR-08)

Kiểm tra logic chuyển đổi trạng thái và bộ lọc hiển thị.
| ID | Mục tiêu kiểm thử |Các bước thực hiện | Kết quả mong đợi | Tham chiếu |
|----|------------------|-------------------|------------------|------------|
| TC-09 | Chuyển đổi trạng thái | 1. Click vào checkbox của task. | Trạng thái chuyển đổi linh hoạt giữa pending ↔ done. | UC-04, BR-04 |
| TC-10 | Lọc danh sách | 1. Chọn các filter: All, Pending, Done. | Hiển thị đúng các task tương ứng với trạng thái. | UC-05, FR-06 |
| TC-11 | BR-08: Tính toàn vẹn khi lọc | 1. Thực hiện lọc task.<br>2. Reload trang hoặc chọn filter khác. | Việc lọc không làm thay đổi hay mất dữ liệu gốc trong LocalStorage. | BR-08 |

### 2.4 Nhóm Kiểm thử Lưu trữ & Độ tin cậy (BR-06, BR-07)

Đảm bảo dữ liệu được bảo toàn theo yêu cầu của khách hàng.
| ID | Mục tiêu kiểm thử | Các bước thực hiện | Kết quả mong đợi | Tham chiếu |
|----|------------------|-------------------|------------------|------------|
| TC-12 | Lưu trữ LocalStorage | 1. Thực hiện Thêm/Sửa/Xóa.<br>2. Kiểm tra Application tab trong DevTools. | Dữ liệu được lưu dưới dạng JSON Array với các field: id, title, status, created_at, updated_at. | BR-06, FR-07 |
| TC-13 | BR-07: Persistence (F5) | 1. Thao tác dữ liệu.<br>2. Nhấn F5 hoặc mở lại trình duyệt. | Toàn bộ danh sách và trạng thái task vẫn còn nguyên vẹn. | BR-07, NFR-5.4 |

## 3. Quy tắc kiểm thử chung (Common Test Rules)
- Single Page Application (SPA): Tất cả các TC trên phải được thực hiện mà không có hành vi tải lại trang (ngo trừ TC-13) hoặc chuyển sang URL khác.
- Thời gian phản hồi: Sau mỗi thao tác Add/Edit/Delete/Complete, UI phải phản hồi trong vòng < 1 giây.
- Bảo mật: Nhập chuỗi <script>alert(1)</script> để kiểm tra hệ thống có escape HTML hay không (không được thực thi script).

## 4. Quy trình kiểm thử
1. Chuẩn bị môi trường kiểm thử: Mở trình duyệt, xóa Local
2. Storage trước khi bắt đầu.
3. Thực hiện từng Test Case theo thứ tự.
4. Ghi nhận kết quả và so sánh với Kết quả mong đợi.

## Tiếp theo
- Viết unit test dựa trên Test Case Spec này.
