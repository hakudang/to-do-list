# 業務ルール（Business Rules）

To-Do List Web Application
```
Version : 1.0  
Status  : Frozen  
Applies : All Use Cases
```
## 1. 目的（Purpose）

Tài liệu này định nghĩa các quy tắc nghiệp vụ bắt buộc của hệ thống To-Do List.
Mọi thiết kế, phát triển và kiểm thử phải tuân thủ đầy đủ các Business Rules dưới đây.

## 2. 業務ルール一覧（Business Rules）
### BR-01 Task Content Required

- Task phải có nội dung
- Không cho phép tạo task nếu không có nội dung

### BR-02 Task Content Length

- Nội dung task tối đa 120 ký tự

### BR-03 Empty Task Prohibition
- Không cho phép thêm task rỗng
- Không cho phép task chỉ chứa khoảng trắng

### BR-04 Task Status Definition

Task chỉ có 2 trạng thái:

 - pending
 - done

### BR-05 Editable Done Task

- Task ở trạng thái done vẫn được phép chỉnh sửa nội dung

### BR-06 Data Storage Method
- Dữ liệu task phải được lưu trữ cục bộ trên trình duyệt
- Dữ liệu được xử lý theo đơn vị từng task

### BR-07 Data Persistence After Reload

- Reload hoặc mở lại trang không làm mất dữ liệu task đã lưu

### BR-08 Filter Behavior
- Việc lọc task chỉ ảnh hưởng đến hiển thị
- Không được làm thay đổi dữ liệu gốc

## 3. 業務ルールとユースケースの対応関係
| BR-ID               | UC-ID         |
| ------------------- | ------------- |
| BR-01, BR-02, BR-03 | UC-01, UC-02  |
| BR-04, BR-05        | UC-04         |
| BR-06, BR-07        | UC-01 ～ UC-05 |
| BR-08               | UC-05         |

## 4. 注意事項（Important Notes）

- Business Rules không mô tả xử lý UI
- Business Rules không mô tả chi tiết kỹ thuật
- Mọi thay đổi Business Rules phải được quản lý bằng Change Request

## 5. 改訂履歴（Revision History）
| Version | Date       | Description          | Author   |
| ------- | ---------- | -------------------- | -------- |
| 1.0     | 2026-01-17 | Initial Release      | BrSE    |

## 🔒 Đánh giá cuối cùng (BrSE perspective)

✔ 8 rule – số lượng chấp nhận được

✔ Rõ ràng cho dev & QA

✔ Không over-design

✔ Phù hợp cho training / mini project / interview

👉 Bộ BR này đủ điều kiện Freeze v1.0
👉 Có thể dùng làm baseline chính thức.