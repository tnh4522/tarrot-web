export type TarotSuit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'

export type TarotElement = 'fire' | 'water' | 'air' | 'earth' | 'spirit'

export interface TarotCard {
  id: number
  name: string
  nameVi: string
  suit: TarotSuit
  number: number | string
  element?: TarotElement
  planet?: string
  zodiac?: string
  keywords: string[]
  keywordsReversed: string[]
  uprightMeaning: string
  reversedMeaning: string
  description: string
  advice: string
  image: string // emoji or icon identifier
  arcana: 'major' | 'minor'
}

export type SpreadType =
  | 'daily'
  | 'past-present-future'
  | 'love'
  | 'career'
  | 'celtic-cross'

export interface SpreadPosition {
  id: number
  label: string
  description: string
}

export interface Spread {
  id: SpreadType
  name: string
  nameVi: string
  description: string
  emoji: string
  cardCount: number
  positions: SpreadPosition[]
  theme: string
}

export interface DrawnCard {
  card: TarotCard
  position: SpreadPosition
  isReversed: boolean
}

export type AITone = 'empathetic' | 'direct' | 'mystical'

export interface ReadingRequest {
  question: string
  userName: string
  spreadType: SpreadType
  drawnCards: DrawnCard[]
  tone: AITone
  apiKey?: string
}

export interface ReadingResponse {
  overallMessage: string
  cardAnalyses: {
    cardName: string
    position: string
    analysis: string
  }[]
  advice: string
  affirmation: string
}

export interface SavedReading {
  id: string
  date: string
  userName: string
  question: string
  spreadName: string
  drawnCards: DrawnCard[]
  reading: ReadingResponse
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}
