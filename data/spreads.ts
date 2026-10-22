import { Spread } from '@/types/tarot'

export const SPREADS: Spread[] = [
  {
    id: 'daily',
    name: 'Daily Message',
    nameVi: 'Thông Điệp Ngày Mới',
    description: 'Nhận thông điệp từ vũ trụ cho ngày hôm nay. Một lá bài sẽ hé lộ năng lượng và hướng dẫn cho bạn.',
    emoji: '🌟',
    cardCount: 1,
    positions: [
      {
        id: 1,
        label: 'Thông Điệp Hôm Nay',
        description: 'Năng lượng và hướng dẫn cho ngày hôm nay',
      },
    ],
    theme: 'from-violet-900 to-indigo-900',
  },
  {
    id: 'past-present-future',
    name: 'Past - Present - Future',
    nameVi: 'Quá Khứ - Hiện Tại - Tương Lai',
    description: 'Ba lá bài hé lộ hành trình của bạn qua thời gian - từ những gì đã định hình bạn đến con đường phía trước.',
    emoji: '⏳',
    cardCount: 3,
    positions: [
      {
        id: 1,
        label: 'Quá Khứ',
        description: 'Những gì đã định hình tình huống hiện tại của bạn',
      },
      {
        id: 2,
        label: 'Hiện Tại',
        description: 'Năng lượng hiện tại và những gì bạn đang đối mặt',
      },
      {
        id: 3,
        label: 'Tương Lai',
        description: 'Kết quả có thể xảy ra nếu bạn tiếp tục con đường này',
      },
    ],
    theme: 'from-purple-900 to-blue-900',
  },
  {
    id: 'love',
    name: 'Love & Relationships',
    nameVi: 'Tình Cảm & Mối Quan Hệ',
    description: 'Khám phá chiều sâu tình yêu và các mối quan hệ. Ba lá bài soi sáng trái tim, đối phương và kết nối của bạn.',
    emoji: '💖',
    cardCount: 3,
    positions: [
      {
        id: 1,
        label: 'Bạn',
        description: 'Năng lượng và cảm xúc của bạn trong mối quan hệ này',
      },
      {
        id: 2,
        label: 'Đối Phương',
        description: 'Năng lượng và cảm xúc của người kia',
      },
      {
        id: 3,
        label: 'Mối Quan Hệ',
        description: 'Tiềm năng và hướng đi của mối quan hệ',
      },
    ],
    theme: 'from-rose-900 to-pink-900',
  },
  {
    id: 'career',
    name: 'Career & Finance',
    nameVi: 'Công Danh & Tài Chính',
    description: 'Nhận hướng dẫn về sự nghiệp và tài chính. Ba lá bài tiết lộ tình trạng hiện tại, thử thách và cơ hội.',
    emoji: '💼',
    cardCount: 3,
    positions: [
      {
        id: 1,
        label: 'Tình Trạng Hiện Tại',
        description: 'Năng lượng hiện tại trong sự nghiệp và tài chính của bạn',
      },
      {
        id: 2,
        label: 'Thử Thách',
        description: 'Những trở ngại bạn cần vượt qua',
      },
      {
        id: 3,
        label: 'Cơ Hội Phía Trước',
        description: 'Tiềm năng và cơ hội đang chờ đợi bạn',
      },
    ],
    theme: 'from-amber-900 to-yellow-900',
  },
  {
    id: 'celtic-cross',
    name: 'Deep Guidance',
    nameVi: 'Tổng Quan & Lời Khuyên Chuyên Sâu',
    description: 'Quẻ 5 lá toàn diện hé lộ tình huống tổng thể, thách thức ẩn, quá khứ, tương lai và lời khuyên cao cả.',
    emoji: '🔮',
    cardCount: 5,
    positions: [
      {
        id: 1,
        label: 'Tình Huống Cốt Lõi',
        description: 'Trung tâm của vấn đề bạn đang đối mặt',
      },
      {
        id: 2,
        label: 'Thử Thách Ẩn',
        description: 'Những gì đang cản trở hoặc hỗ trợ bạn một cách bí ẩn',
      },
      {
        id: 3,
        label: 'Nền Tảng',
        description: 'Nguyên nhân sâu xa và nền tảng của tình huống',
      },
      {
        id: 4,
        label: 'Hướng Đi Tương Lai',
        description: 'Hướng phát triển tốt nhất cho bạn',
      },
      {
        id: 5,
        label: 'Kết Quả & Lời Khuyên',
        description: 'Kết quả tổng thể và lời khuyên cuối cùng từ vũ trụ',
      },
    ],
    theme: 'from-indigo-900 to-purple-900',
  },
]

export const getSpreadById = (id: string): Spread | undefined =>
  SPREADS.find((s) => s.id === id)
