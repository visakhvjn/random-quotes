import type { Context } from '@netlify/functions';
import { getQuoteFromNinja } from './ninja';
import { getQuoteFromGemini } from './gemini';

export const quote = async (req: Request, context: Context) => {
  let data;

  if (Math.random() < 0.5) {
    data = await getQuoteFromNinja();
  } else {
    data = await getQuoteFromGemini();
  }

  return new Response(data);
}