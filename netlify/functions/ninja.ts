import { QuoteResponse } from './types';

const NINJA_API_KEY = process.env.REACT_APP_NINJA_API_KEY as string;
const NINJA_URL = process.env.REACT_APP_NINJA_URL as string;

export const getQuoteFromNinja = async () => {
  const response = await fetch(NINJA_URL,
    {
      method: 'GET',
      headers: { 'X-Api-Key': NINJA_API_KEY }
    }
  );

  const data = await response.json();
  return data[0] as QuoteResponse;
}