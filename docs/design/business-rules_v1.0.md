# 業務ルール（Business Rules）

To-Do List Web Application
```
Version : 1.1  
Status  : Frozen  
Applies : All Use Cases
```
## 1. 目的（Purpose）

Tài liệu này định nghĩa các quy tắc nghiệp vụ cốt lõi của hệ thống To-Do List.
Mọi thiết kế, phát triển và kiểm thử bắt buộc tuân thủ các rule dưới đây.

## 2. 業務ルール一覧（Business Rules）
### BR-01 Task Validity

- Task phải có nội dung hợp lệ
- Không cho phép tạo task rỗng hoặc chỉ chứa khoảng trắng

### BR-02 Task Length

- Nội dung task tối đa 120 ký tự

### BR-03 Task Status

- Task chỉ có 2 trạng thái: active, done
- Task mới được tạo mặc định ở trạng thái active

### BR-04 Editable Completed Task

- Task ở trạng thái done vẫn cho phép chỉnh sửa nội dung

### BR-05 Data Persistence

- Dữ liệu task phải được lưu cục bộ
- Reload trang không làm mất dữ liệu đã lưu

### BR-06 Filter Behavior

- Việc lọc task không được thay đổi dữ liệu gốc

## 3. 業務ルールとユースケースの対応関係
| BR-ID        | UC-ID         |
| ------------ | ------------- |
| BR-01, BR-02 | UC-01, UC-02  |
| BR-03, BR-04 | UC-04         |
| BR-05        | UC-01 ～ UC-05 |
| BR-06        | UC-05         |

## 4. 注意事項（Notes）

- 業務ルール không mô tả UI chi tiết
- 業務ルール không mô tả cách implement
- Mọi thay đổi rule phải được quản lý bằng Change Request
  
## 5. 改訂履歴（Revision History）
| Version | Date       | Author   | Description            |
| ------- | ---------- | -------- | ---------------------- |
| 1.0     | 2026-06-01 | BrSE     | 初版作成               |

## 🔒 BrSE Kết luận

✔ Số lượng rule: tối ưu

✔ Không trùng UC

✔ Không lẫn Screen / UI

✔ Dev đọc là code được

✔ QA đọc là test được