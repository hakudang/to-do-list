# ユースケース定義書（Use Case Specification）

To-Do List Web Application
```
Version : 1.0  
Status  : Draft → To be Frozen  
Scope   : Frontend Web App
```
## 1. ユースケース一覧（Use Case List）
| UC-ID | ユースケース名         | 概要                       |
| ----- | --------------- | ------------------------ |
| UC-01 | タスクを追加する        | Thêm task mới            |
| UC-02 | タスクを編集する        | Sửa nội dung task        |
| UC-03 | タスクを削除する        | Xóa task                 |
| UC-04 | タスクを完了にする       | Đánh dấu task hoàn thành |
| UC-05 | タスクを一覧・絞り込み表示する | Hiển thị & lọc task      |

## 2. UC-01 タスクを追加する（Add Task）
### 基本情報

- Primary Actor: User
- 関連画面: SC-01 To-Do Main Screen
- 対応FR: FR-01

### 事前条件（Pre-condition）

- Ứng dụng đã được mở
- Người dùng đang ở màn hình chính

### 事後条件（Post-condition）

- Task mới được thêm vào danh sách
- Dữ liệu được lưu lại

### 基本フロー（Basic Flow）

1. User nhập nội dung task
2. User nhấn nút Add hoặc Enter
3. System kiểm tra dữ liệu nhập
4. System thêm task mới vào danh sách
5. System hiển thị task vừa thêm

### 代替フロー（Alternate Flow）

- AF-01: Nội dung task rỗng
→ System không thêm task và giữ nguyên màn hình

## 3. UC-02 タスクを編集する（Edit Task）
### 基本情報

- Primary Actor: User
- 関連画面: SC-01
- 対応FR: FR-03
事前条件

### 事前条件（Pre-condition）

- Task tồn tại trong danh sách

### 事後条件（Post-condition）

- Nội dung task được cập nhật
- Dữ liệu được lưu lại

### 基本フロー（Basic Flow）

1. User chọn task cần sửa
2. User chỉnh sửa nội dung
3. User xác nhận thao tác sửa
4. System cập nhật nội dung task
5. System hiển thị task đã được sửa

System hiển thị task đã được sửa

### 代替フロー（Alternate Flow）

- AF-01: User hủy thao tác
→ System không thay đổi dữ liệu

## 4. UC-03 タスクを削除する（Delete Task）
### 基本情報

- Primary Actor: User
- 関連画面: SC-01
- 対応FR: FR-04

### 事前条件（Pre-condition）

- Task tồn tại

### 事後条件（Post-condition）

- Task bị xóa khỏi danh sách
- Dữ liệu được cập nhật

### 基本フロー（Basic Flow）

1. User nhấn nút Delete của task
2. System xóa task khỏi danh sách
3. System cập nhật hiển thị

## 5. UC-04 タスクを完了にする（Complete Task）
### 基本情報

- Primary Actor: User
- 関連画面: SC-01
- 対応FR: FR-05

### 事前条件（Pre-condition）

- Task tồn tại

### 事後条件（Post-condition）
- Trạng thái task được thay đổi

### 基本フロー（Basic Flow）

1. User click checkbox của task
2. System đổi trạng thái task (active ↔ done)
3. System cập nhật hiển thị

## 6. UC-05 タスクを一覧・絞り込み表示する（View & Filter Tasks）
### 基本情報

- Primary Actor: User
- 関連画面: SC-01
- 対応FR: FR-02, FR-06

### 事前条件（Pre-condition）

- Có hoặc không có task

### 事後条件（Post-condition）

- Danh sách task được hiển thị theo điều kiện lọc

### 基本フロー（Basic Flow）

1. User mở màn hình chính
2. System hiển thị toàn bộ task
3. User chọn điều kiện lọc (All / Active / Done)
4. System hiển thị task phù hợp

## 7. 共通ルール（Common Rules）

- Mọi thao tác đều thực hiện trên một màn hình duy nhất
- Sau mỗi thao tác, hệ thống không chuyển màn hình
- Thay đổi dữ liệu phải được lưu ngay

## 8. ユースケースと他ドキュメントの対応関係
| UC-ID | FR       | BR       | Screen |
| ----- | -------- | -------- | ------ |
| UC-01 | FR-01    | BR-01～03 | SC-01  |
| UC-02 | FR-03    | BR-02,05 | SC-01  |
| UC-03 | FR-04    | BR-06    | SC-01  |
| UC-04 | FR-05    | BR-04    | SC-01  |
| UC-05 | FR-02,06 | BR-08    | SC-01  |

## 9. 改訂履歴（Revision History）
| Version | Date       | Description          | Author   |
| ------- | ---------- | -------------------- | -------- |
| 1.0     | 2026-01-17 | 初版作成             | BrSE     |


🔒 チェックポイント

- Actor rõ ràng ✔
- Pre/Post-condition đầy đủ ✔
- Basic / Alternate flow tách bạch ✔
- Trace được sang FR / BR / Screen ✔

👉 Use Case này đủ điều kiện Freeze.
Dev có thể code, QA có thể viết test case ngay.