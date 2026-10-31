# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Người tìm kiếm định hướng & chiêm nghiệm hàng ngày**: Người dùng tiếng Việt gặp bế tắc, phân vân trong chuyện tình cảm, sự nghiệp, hoặc muốn có một thông điệp năng lượng tích cực/chữa lành cho ngày mới.
- **Người quan tâm và học Tarot**: Muốn tra cứu ý nghĩa 78 lá bài (xuôi/ngược, nguyên tố, chiêm tinh), rèn luyện cách kết nối các lá bài trong trải bài thực tế, và lưu lại lịch sử chiêm nghiệm.

## Product Purpose

Cung cấp trải nghiệm Tarot trực tuyến trực quan, tinh tế và đáng tin cậy. Kết hợp sự kỳ diệu của biểu tượng Tarot truyền thống với khả năng thông dịch nhạy bén của AI, giúp người dùng đạt được sự sáng tỏ, định hướng hành động và xoa dịu tâm thức mà không rơi vào mê tín dị đoan.

## Positioning

Người bạn đồng hành thấu cảm kết hợp trí tuệ nhân tạo: Không chỉ bốc bài ngẫu nhiên rồi trả về văn bản tĩnh, MysticTarot AI lắng nghe câu hỏi cụ thể, tên người dùng, và ngữ cảnh trải bài để phân tích đa chiều theo từng tông giọng do người dùng chọn (Thấu Cảm, Trực Diện, Huyền Bí). Hệ thống tôn trọng chiều sâu biểu tượng Rider-Waite, tích hợp bách khoa toàn thư 78 lá và lưu trữ lịch sử cá nhân ngay trên thiết bị.

## Operating Context

- Sử dụng trên trình duyệt web máy tính và điện thoại di động trong không gian yên tĩnh, lúc cần suy ngẫm hoặc đầu ngày/cuối ngày.
- Tương tác nghi thức: Nhập câu hỏi, chọn tụ/kiểu trải bài, xáo bài tương tác với hiệu ứng 3D/hạt sáng, rút bài trực tiếp, lật bài và nhận thông điệp phân tích từ AI.
- Không gian phụ trợ: Tra cứu bách khoa toàn thư 78 lá bài, xem lại lịch sử các lần trải bài trước đó.

## Capabilities and Constraints

- **Công nghệ nền tảng**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.
- **Khả năng AI**: Tích hợp Google Gemini qua `@google/genai` (`app/api/tarot-reading`), hỗ trợ API key tùy chọn từ người dùng hoặc biến môi trường `GEMINI_API_KEY`.
- **Dữ liệu & Trải bài**: Bộ 78 lá bài chuẩn (Major Arcana & Minor Arcana) kèm bản dịch tiếng Việt, ý nghĩa xuôi/ngược, từ khóa, nguyên tố, lời khuyên (`data/tarot-cards.ts`). 5 kiểu trải bài chuẩn: Daily Message (1 lá), Past-Present-Future (3 lá), Love & Relationships (3 lá), Career (3 lá), Celtic Cross (10 lá) (`data/spreads.ts`).
- **Lưu trữ & Bảo mật**: Lịch sử bói bài và API key được lưu cục bộ (localStorage) trên thiết bị của người dùng để tôn trọng sự riêng tư.
- **Ngôn ngữ chính**: Tiếng Việt (giao diện, thuật ngữ, lời giải AI).

## Brand Commitments

- **Tên**: MysticTarot AI.
- **Giọng điệu (Voice)**: Tôn trọng, ấm áp, soi sáng và tạo cảm hứng; tránh hù dọa, tuyệt đối không đưa ra các phán xét định mệnh tiêu cực, cực đoan hay mê tín dị đoan.
- **Tính cách**: Huyền bí nhưng sáng tỏ, trí tuệ, hiện đại và sâu lắng.

## Evidence on Hand

- Toàn bộ cơ sở dữ liệu 78 lá bài với mô tả, lời khuyên, từ khóa tiếng Việt tại `data/tarot-cards.ts`.
- 5 kiểu trải bài chi tiết kèm vị trí và câu hỏi ý nghĩa tại `data/spreads.ts`.
- Hệ thống UI hiện có với tính năng bốc bài, xáo bài 3D, từ điển tra cứu, lịch sử và hướng dẫn người dùng mới (Onboarding Tour).

## Product Principles

1. **Thấu cảm và hướng đến hành động**: Mỗi giải đoán không dừng lại ở việc đọc lá bài mà phải giúp người dùng nhìn nhận vấn đề sáng suốt và có bước đi cụ thể tích cực.
2. **Tôn trọng tính trang nghiêm của Tarot**: Giữ trọn vẹn tinh thần biểu tượng, vị trí xuôi/ngược, tương quan giữa các lá bài trong từng trải bài.
3. **Riêng tư và tự do**: Câu hỏi, lịch sử và dữ liệu cá nhân thuộc về người dùng, lưu trữ cục bộ, không bắt buộc đăng nhập.
4. **Trực quan và dễ tiếp cận**: Nghi thức xáo bài và rút bài trực quan, giao diện mượt mà, thân thiện với cả người mới bắt đầu lẫn người đã có kinh nghiệm.
