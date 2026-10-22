import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { DrawnCard, AITone, ReadingResponse } from '@/types/tarot'

interface ReadingRequestBody {
  question: string
  userName: string
  spreadType: string
  drawnCards: DrawnCard[]
  tone: AITone
  apiKey?: string
  isFollowUp?: boolean
  context?: ReadingResponse
  chatHistory?: { role: string; content: string }[]
}

const TONE_INSTRUCTIONS: Record<AITone, string> = {
  empathetic:
    'Hãy viết với giọng điệu ấm áp, đồng cảm, khuyến khích và thấu hiểu cảm xúc của người dùng. Sử dụng ngôn ngữ nhẹ nhàng và đầy tình yêu thương.',
  direct:
    'Hãy viết thẳng thắn, rõ ràng, thực tế và đi vào trọng tâm. Đưa ra lời khuyên cụ thể và có thể thực hiện ngay.',
  mystical:
    'Hãy viết với ngôn ngữ huyền bí, thơ ca, giàu hình ảnh vũ trụ và tâm linh. Sử dụng ẩn dụ, hình ảnh thiên nhiên và ngôn ngữ tâm linh.',
}

function buildReadingPrompt(body: ReadingRequestBody): string {
  const { question, userName, drawnCards, tone, spreadType } = body
  const toneInstr = TONE_INSTRUCTIONS[tone]

  const cardsList = drawnCards
    .map(
      (dc) =>
        `- Vị trí "${dc.position.label}" (${dc.position.description}): ${dc.card.nameVi} (${dc.card.name}) - ${dc.isReversed ? 'NGƯỢC' : 'XUÔI'}`
    )
    .join('\n')

  return `Bạn là Thầy Bói Tarot huyền bí và thấu hiểu, tên là Astra. Bạn có kiến thức sâu rộng về Tarot và tâm linh học.

THÔNG TIN NGƯỜI DÙNG:
- Tên: ${userName || 'Người dùng'}
- Câu hỏi: ${question || 'Thông điệp tổng quan cho hôm nay'}
- Kiểu quẻ: ${spreadType}

LÁ BÀI ĐÃ RÚT:
${cardsList}

PHONG CÁCH VIẾT: ${toneInstr}

NHIỆM VỤ: Hãy giải quẻ bài Tarot này theo định dạng JSON sau (PHẢI trả về JSON hợp lệ, không có markdown code block):
{
  "overallMessage": "Phân tích tổng quan 2-3 đoạn văn về thông điệp tổng thể của quẻ bài, liên kết các lá bài lại với nhau và trả lời câu hỏi của ${userName}",
  "cardAnalyses": [
    {
      "cardName": "Tên lá bài (bao gồm XUÔI/NGƯỢC)",
      "position": "Tên vị trí",
      "analysis": "Phân tích sâu sắc 1-2 đoạn về ý nghĩa lá bài này trong bối cảnh câu hỏi và vị trí của nó"
    }
  ],
  "advice": "Lời khuyên thực tế và hành động cụ thể 1-2 đoạn, trả lời trực tiếp câu hỏi của người dùng",
  "affirmation": "Một câu khẳng định tích cực ngắn gọn và đầy cảm hứng (không quá 30 từ)"
}

QUY TẮC QUAN TRỌNG:
1. Luôn tích cực và xây dựng - không gieo rắc nỗi sợ hãi hay hoang mang
2. Viết hoàn toàn bằng tiếng Việt, tự nhiên và truyền cảm
3. Phân tích mỗi lá bài dựa trên cả ý nghĩa bài bản và bối cảnh câu hỏi cụ thể
4. Lá bài ngược có ý nghĩa bị trì hoãn, cần xem xét lại, hoặc năng lượng hướng vào trong - không phải hoàn toàn tiêu cực
5. Liên kết các lá bài với nhau để tạo câu chuyện mạch lạc
6. Trả về ĐÚNG định dạng JSON, không thêm bất kỳ text nào bên ngoài JSON`
}

function buildFollowUpPrompt(body: ReadingRequestBody): string {
  const { question, userName, drawnCards, tone, context, chatHistory } = body
  const toneInstr = TONE_INSTRUCTIONS[tone]

  const cardsList = drawnCards
    .map((dc) => `${dc.card.nameVi} (${dc.isReversed ? 'Ngược' : 'Xuôi'}) - Vị trí: ${dc.position.label}`)
    .join(', ')

  const history = chatHistory
    ?.map((m) => `${m.role === 'user' ? userName : 'Astra'}: ${m.content}`)
    .join('\n') || ''

  return `Bạn là Thầy Bói Tarot Astra. Bạn đang tiếp tục cuộc trò chuyện về quẻ bài Tarot.

QUẺ BÀI ĐÃ ĐỌC:
- Lá bài: ${cardsList}
- Lời giải tổng quan: ${context?.overallMessage?.substring(0, 300)}...

LỊCH SỬ TRÒ CHUYỆN:
${history}

CÂU HỎI MỚI CỦA ${userName}: ${question}

PHONG CÁCH VIẾT: ${toneInstr}

Hãy trả lời câu hỏi của ${userName} dựa trên ngữ cảnh của quẻ bài và cuộc trò chuyện. Trả lời bằng tiếng Việt, tự nhiên và sâu sắc. Chỉ trả về text thuần túy (không phải JSON).`
}

function getMockReading(body: ReadingRequestBody): ReadingResponse {
  const { drawnCards, userName, question } = body
  const firstName = userName?.split(' ').pop() || 'bạn'

  return {
    overallMessage: `Kính gửi ${firstName},\n\nNhững lá bài vũ trụ đã lên tiếng và chúng mang một thông điệp đặc biệt dành riêng cho bạn. ${drawnCards[0]?.card.nameVi || 'Lá bài đầu tiên'} xuất hiện như một ánh sáng hướng dẫn trên con đường của bạn, nhắc nhở rằng mọi hành trình đều bắt đầu từ một bước đầu tiên đầy dũng cảm.\n\nVũ trụ đang thì thầm với bạn rằng: ${drawnCards[0]?.card.uprightMeaning || 'hãy tin vào hành trình của bản thân'}. Đây là thời điểm để lắng nghe tiếng gọi sâu bên trong và hành động theo sự dẫn dắt của trực giác.`,
    cardAnalyses: drawnCards.map((dc) => ({
      cardName: `${dc.card.nameVi}${dc.isReversed ? ' (Ngược)' : ''}`,
      position: dc.position.label,
      analysis: dc.isReversed ? dc.card.reversedMeaning : dc.card.uprightMeaning,
    })),
    advice: `Câu hỏi "${question || 'của bạn'}" được vũ trụ lắng nghe. ${drawnCards[0]?.card.advice || 'Hãy tin vào bản thân và tiến bước'}. Hành trình của bạn đang ở đúng nơi cần thiết - hãy tiếp tục với lòng dũng cảm và tin tưởng.`,
    affirmation: `Tôi tin tưởng vào hành trình của mình và mở lòng đón nhận những điều kỳ diệu phía trước.`,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ReadingRequestBody = await request.json()
    const { apiKey, isFollowUp } = body

    // Use API key from env first, then from user
    const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || apiKey

    if (!geminiKey) {
      // Return mock reading if no API key
      if (isFollowUp) {
        return NextResponse.json({
          message:
            'Chế độ thử nghiệm: Để nhận lời giải AI đầy đủ, hãy cung cấp Gemini API Key trong phần Cài Đặt. Câu trả lời tạm thời: Hãy tin vào trực giác của bạn và lắng nghe thông điệp từ những lá bài. Mỗi câu hỏi bạn đặt ra đều phản ánh sự khôn ngoan bên trong.',
        })
      }
      const mockReading = getMockReading(body)
      return NextResponse.json(mockReading)
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey })

    if (isFollowUp) {
      const prompt = buildFollowUpPrompt(body)
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      })
      const text = response.text || 'Xin lỗi, tôi chưa thể trả lời ngay lúc này.'
      return NextResponse.json({ message: text })
    }

    // Main reading
    const prompt = buildReadingPrompt(body)
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    })

    let text = response.text || ''

    // Remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let reading: ReadingResponse
    try {
      reading = JSON.parse(text)
    } catch {
      // Fallback if AI doesn't return valid JSON
      reading = getMockReading(body)
      reading.overallMessage = text.substring(0, 500) || reading.overallMessage
    }

    return NextResponse.json(reading)
  } catch (error) {
    console.error('Tarot API error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi kết nối với AI. Hãy thử lại sau.' },
      { status: 500 }
    )
  }
}
