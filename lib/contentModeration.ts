// Content moderation utilities
const BAD_WORDS = [
  'spam', 'scam', 'hate', 'abuse', 'harassment', 'threat', 'violence',
  'discrimination', 'bullying', 'doxxing', 'illegal', 'drugs', 'weapon'
]

export const moderateContent = (text: string): boolean => {
  const lowerText = text.toLowerCase()
  return BAD_WORDS.some(word => lowerText.includes(word))
}

export const cleanContent = (text: string): string => {
  let cleanText = text
  BAD_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi')
    cleanText = cleanText.replace(regex, '*'.repeat(word.length))
  })
  return cleanText
}

export const reportReasons = [
  'Spam or unwanted content',
  'Harassment or bullying',
  'Hate speech or discrimination',
  'Violence or threats',
  'Inappropriate content',
  'Misinformation',
  'Other'
] as const

export type ReportReason = typeof reportReasons[number]