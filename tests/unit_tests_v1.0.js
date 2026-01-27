/**
 * Unit Tests cho Calculator Application
 * Dựa trên Test Case Specification v1.0 [1-5]
 * Bao phủ các Validation ID (V) và Business Rules (BR)
 */

// Giả lập môi trường DOM nếu chạy trong môi trường Node.js (tùy chọn)
// Nếu chạy trên trình duyệt, bạn có thể gọi trực tiếp các test case này.

function runTests() {
    console.log("--- Bắt đầu chạy Unit Tests ---");
    let input = "";
    // --- Nhóm 1: Nhóm Kiểm thử Thêm Task (UC-01 & Validation) ---

    test("TC-02: VAL-01: Bỏ trống nội dung", () => {
        input = "";
        return validation(input) === false;
    });
    
    test("TC-03: VAL-02: Nội dung chỉ có khoảng trắng", () => {
        input = "     ";
        return validation(input) === false;
    });

    test("TC-04: Nội dung quá dài", () => {
        input = "Lorem ipsum dolor sit amet. Eos asperiores adipisci vel quisquam molestiae in fugiat corrupti ea tempore voluptas ea magni consequatur est nemo numquam. Id voluptas temporibus ut Quis veritatis rem maxime mollitia.";
        return validation(input) === false;
    });

    console.log("--- Hoàn tất kiểm thử ---");
}

// Hàm bổ trợ chạy test
function test(name, fn) {
    try {
        const result = fn();
        if (result) {
            console.log(`✅ [PASS] ${name}`);
        } else {
            console.error(`❌ [FAIL] ${name}`);
        }
    } catch (e) {
        console.error(`💥 [ERROR] ${name}: ${e.message}`);
    }
}

// Thực thi
runTests();