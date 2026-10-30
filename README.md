# Oxyz Geometry Lab

Website học tập và tính toán hình học giải tích không gian Oxyz, giao diện tiếng Việt kết hợp thuật ngữ tiếng Anh.

## Chạy thử trên máy tính
1. Tải và giải nén `oxyz-geometry-lab.zip`.
2. Mở thư mục `oxyz-geometry-website`.
3. Mở `index.html` bằng Chrome, Edge hoặc Firefox.

Các thư viện Three.js và MathJax được tải từ CDN, vì vậy cần kết nối Internet để hiển thị phần 3D và công thức đẹp. Các phép tính JavaScript chạy ngay trên trình duyệt.

## Đưa website lên GitHub Pages
1. Đăng nhập GitHub và chọn **New repository**.
2. Đặt tên, ví dụ `oxyz-geometry-lab`. Chọn **Public**, sau đó **Create repository**.
3. Trong repository, chọn **Add file → Upload files**.
4. Tải lên toàn bộ nội dung bên trong thư mục `oxyz-geometry-website` (không chỉ tải file ZIP). Đảm bảo `index.html`, `styles.css`, `app.js` nằm ở thư mục gốc của repository.
5. Chọn **Commit changes**.
6. Mở **Settings → Pages**.
7. Ở **Build and deployment**, chọn **Deploy from a branch**.
8. Chọn branch `main`, folder `/(root)`, rồi nhấn **Save**.
9. Đợi GitHub triển khai. Địa chỉ website thường có dạng:
   `https://TEN-TAI-KHOAN.github.io/oxyz-geometry-lab/`

Nếu thay đổi mã nguồn, tải các file mới lên và commit lại; GitHub Pages sẽ tự cập nhật.

## Cấu trúc thư mục
- `index.html`: cấu trúc trang và nội dung.
- `styles.css`: giao diện responsive.
- `app.js`: các phép tính vector, giao diện tương tác, bài tập và mô hình 3D.

## Chức năng hiện có
- Khoảng cách: điểm–điểm, điểm–đường thẳng, điểm–mặt phẳng, hai đường thẳng chéo nhau, hai mặt phẳng song song.
- Góc: đường thẳng–đường thẳng, đường thẳng–mặt phẳng, mặt phẳng–mặt phẳng.
- Lập phương trình đường thẳng, mặt phẳng; giao điểm đường thẳng và mặt phẳng.
- Xét vị trí tương đối hai đường thẳng.
- Thư viện công thức và bài tập trắc nghiệm.
- Khung minh họa 3D có thể kéo để xoay và cuộn để zoom.

## Lưu ý học thuật
Đây là phiên bản nền tảng. Công cụ khoảng cách giữa hai mặt phẳng yêu cầu hai mặt phẳng song song. Công cụ hai đường thẳng chéo nhau dùng công thức tích hỗn tạp và yêu cầu hai vectơ chỉ phương không cùng phương. Mô hình 3D hiện là minh họa tổng quát, chưa tự động dựng chính xác các đối tượng từ dữ liệu nhập. Hãy kiểm tra lời giải và điều kiện hình học khi sử dụng trong bài tập.
