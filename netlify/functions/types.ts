export enum QuoteSource {
  NINJA = 'NINJA',
  GEMINI = 'GEMINI'
}

export type QuoteResponse = {
  quote: string;
  author: string;
  type: QuoteSource;
}