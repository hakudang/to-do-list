# バリデーション仕様書（Validation Specification）

**To-Do List Web Application**
```
Version : 1.0  
Status  : Draft → To be Frozen  
Applies : SC-01 To-Do Main Screen  
Scope   : Task input / Task edit
```
## 1. 目的（Purpose）

Tài liệu này định nghĩa các quy tắc kiểm tra dữ liệu (validation) khi người dùng thêm hoặc sửa task trong hệ thống To-Do List.

Validation nhằm đảm bảo:

- Dữ liệu hợp lệ theo Business Rules
- Hệ thống hoạt động ổn định
- Dev & QA có cùng một cách hiểu khi xử lý input

## 2. 適用範囲（Scope）

- UC-01: タスクを追加する（Add Task）
- UC-02: タスクを編集する（Edit Task）

Không áp dụng cho:

- UC-03 Delete
- UC-04 Done
- UC-05 Filter

## 3. バリデーション対象項目（Validation Targets）

| 項目           | Field | Ghi chú       |
| ------------ | ----- | ------------- |
| Task content | title | Nội dung task |

## 4. バリデーション一覧（Validation Rules）
### 4.1 Validation Rule Table
| VAL-ID | 内容             | 条件                      | Kết quả khi NG | Trace |
| ------ | ---------------- | ------------------------ | -------------- | ----- |
| VAL-01 | Required check   | title = null / empty     | Không cho lưu  | BR-01 |
| VAL-02 | Whitespace check | title chỉ chứa space/tab | Không cho lưu  | BR-03 |
| VAL-03 | Length check     | title > 120 ký tự        | Không cho lưu  | BR-02 |

## 5. バリデーション詳細仕様（Validation Details）
### VAL-01 Required Check

- 対象: Add / Edit
- Mô tả: Task phải có nội dung
- Điều kiện NG:
  - title = ""
  - title = null
- Hành vi hệ thống:
  - Không tạo / không cập nhật task
  - Giữ nguyên dữ liệu hiện tại

### VAL-02 Whitespace Check
- 対象: Add / Edit
- Mô tả: Không cho phép task chỉ chứa khoảng trắng
- Điều kiện NG:
  - " "
  - "\t\t"
- Hành vi hệ thống:
  - Không tạo / không cập nhật task
  - Giữ nguyên dữ liệu hiện tại

### VAL-03 Length Check
- 対象: Add / Edit
- Mô tả: Giới hạn độ dài nội dung task
- Điều kiện NG:
  - Số ký tự > 120
- Hành vi hệ thống (đã chốt):
  - Reject input
  - Không tự động cắt chuỗi
  - Không thay đổi dữ liệu cũ

```
📌 Quyết định Reject (>120) là để:
- QA test rõ ràng
- Tránh mất dữ liệu người dùng do truncate ngầm
```
## 6. バリデーションタイミング（Validation Timing）

| Timing | Mô tả                                              |
| ------ | -------------------------------------------------- |
| Add    | Khi user nhấn Add hoặc Enter                       |
| Edit   | Khi user xác nhận sửa (Enter / Blur theo thiết kế) |

## 7. エラーハンドリング方針（Error Handling Policy）

- Khi validation NG:
  - Không cập nhật dữ liệu
  - Không thay đổi trạng thái task
- Không bắt buộc hiển thị message cụ thể
(chi tiết UI message sẽ được định nghĩa ở Error Spec nếu cần)

## 8. ユースケース・業務ルールとの対応関係
### 8.1 Validation ↔ Business Rules
| VAL-ID | BR-ID |
| ------ | ----- |
| VAL-01 | BR-01 |
| VAL-02 | BR-03 |
| VAL-03 | BR-02 |

### 8.2 Validation ↔ Use Case
| VAL-ID | UC-ID          |
| ------ | -------------- |
| VAL-01 | UC-01, UC-02   |
| VAL-02 | UC-01, UC-02   |
| VAL-03 | UC-01, UC-02   |

## 9. 非対象事項（Out of Validation Scope）

- Status (pending / done)
- Delete action
- Filter action
- LocalStorage format / key
→ Các nội dung này được quản lý bởi BR / SR, không thuộc validation

## 🔒 Validation Freeze Check（BrSE視点）

- Validation bám BR ✔
- Không lấn Use Case ✔
- Không lấn UI ✔
- QA test được ngay ✔

👉 Validation Spec này đủ điều kiện Freeze v1.0

### 🎯 Tiếp theo

- Viết エラー仕様書（Error Specification）
(message, timing, UI behavior)
- Test Case cho Validation (VAL-01～03)