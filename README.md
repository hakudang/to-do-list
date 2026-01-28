
# To-Do List Application
```
version: 1.0
status : Draft → To be Frozen
Date : 16/01/2026
```
## 1. Giới thiệu dự án
Dự án nhằm xây dựng một ứng dụng To-Do List đơn giản trên nền tảng web, hỗ trợ người dùng quản lý công việc cá nhân hằng ngày một cách dễ dàng và trực quan. Hệ thống cho phép ghi lại các công việc, theo dõi tiến độ và đảm bảo không bỏ lỡ các task quan trọng mà không cần các thủ tục đăng nhập phức tạp.

## 2. Đối tượng sử dụng
- Người dùng cá nhân: Bất kỳ ai cần một công cụ nhẹ, nhanh để theo dõi công việc hằng ngày.
- Hệ thống không phân quyền: Không phân biệt vai trò hay quyền hạn của người dùng.

## 3. Các tính năng chính
Dựa trên yêu cầu chức năng (FR) và các Use Case (UC) đã định nghĩa:
- Thêm task : Tạo công việc mới với nội dung cụ thể.
- Sửa task : Chỉnh sửa nội dung các task đã tồn tại.
- Xóa task : Loại bỏ task khỏi danh sách.
- Đánh dấu hoàn thành : Chuyển đổi trạng thái task giữa pending và done.
- Hiển thị & Lọc : Xem danh sách task và lọc theo các điều kiện All, Pending hoặc Done.
- Lưu trữ cục bộ: Tự động lưu dữ liệu vào trình duyệt.

## 4. Quy tắc nghiệp vụ (Business Rules)
Hệ thống tuân thủ 8 quy tắc cốt lõi để đảm bảo tính nhất quán:
- Nội dung bắt buộc : Task phải có nội dung; không chấp nhận nội dung rỗng hoặc chỉ chứa khoảng trắng.
- Giới hạn độ dài : Nội dung task tối đa 120 ký tự.
- Trạng thái : Task chỉ có hai trạng thái là pending và done.
- Quy tắc chỉnh sửa : Cho phép sửa nội dung ngay cả khi task đã hoàn thành.
- Lưu trữ bền vững : Dữ liệu được lưu tại LocalStorage, không bị mất khi reload (F5) hoặc mở lại trình duyệt.
- Tính toàn vẹn : Thao tác lọc chỉ ảnh hưởng đến hiển thị, không làm thay đổi dữ liệu gốc.

## 5. Đặc tính kỹ thuật
- Nền tảng: Ứng dụng độc lập (Standalone), chạy trên trình duyệt Web như Chrome, Edge, Firefox và các trình duyệt di động.
- Công nghệ: Chỉ xử lý phía Client (Client-side only), kiến trúc Single Page Application (SPA), sử dụng LocalStorage với định dạng JSON Array.
- Hiệu suất: Phản hồi các thao tác thêm/sửa/xóa dưới 1 giây; hoạt động mượt mà với quy mô lên đến 1,000 task.
- Quyền riêng tư: Không yêu cầu đăng ký/đăng nhập, không xử lý dữ liệu nhạy cảm và thực hiện escape HTML để ngăn chặn các cuộc tấn công script (XSS) từ người dùng.

## 6. Phạm vi ngoài (Out of Scope)
Các tính năng sau không nằm trong phạm vi phát triển của dự án:
- Quản lý tài khoản (Đăng ký/Đăng nhập).
- Hệ thống Backend, API hoặc cơ sở dữ liệu server.
- Đồng bộ dữ liệu qua Internet (Cloud sync).
- Ứng dụng Mobile Native.
- Tạo và quản lý nhiều danh sách công việc riêng biệt.

## 7. Cấu trúc tài liệu dự án
Dự án được quản lý chặt chẽ thông qua hệ thống tài liệu có tính truy vết cao (Traceability):
- Mục đích (Goal): Client Requirements → System Requirements.
- Logic: Business Rules → Use Case Specification.
- Xác thực: Validation Specification → Test Case Specification.

## 8. Tổ chức cây thư mục

```
/ To-Do-List
  / docs
    / requirements
      - client_requirements_v1.0.md
      - system_requirements_v1.0.md
    / design
      - business_rule_v1.0.md
      - usecase_spec_v1.0.md
      - validation_spec_v1.0.md
      - testcase_spec_v1.0.md
  / src
    / components
    / styles
    - index.html
    - app.js
    - styles.css
  / tests
    - unit_tests.js
    - integration_tests.js
  - README.md
```
## 🎯 Nhận xét

- CR: nói vì sao làm
- FR: nói làm được gì
- UC: nói ai làm – làm thế nào
- ST: nói màn hình phản ứng ra sao
- BR: nói luật không được phá
  
👉 Với bộ này, dev chỉ việc code, QA viết test case không hỏi thêm, PM chốt scope rất nhanh.