import { QuoteResponse } from "../types/common";

const NETLIFY_QUOTE_URL = process.env.REACT_APP_NETLIFY_QUOTE_URL as string;

export const getQuoteFromNetlify = async () => {
  const response = await fetch(NETLIFY_QUOTE_URL);
  const data = await response.json();
  return data.data as QuoteResponse;
}