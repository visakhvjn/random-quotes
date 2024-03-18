import type { Context } from '@netlify/functions';
import { getQuoteFromNinja } from './ninja';
import { getQuoteFromGemini } from './gemini';

const quote = async (req: Request, context: Context) => {
  let data;

  if (Math.random() < 0.5) {
    data = await getQuoteFromNinja();
  } else {
    data = await getQuoteFromGemini();
  }

  return Response.json({ data });
}

export default quote;