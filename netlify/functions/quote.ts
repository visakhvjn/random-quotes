import type { Context } from '@netlify/functions';
import { getQuoteFromNinja } from './ninja';
import { getQuoteFromGemini } from './gemini';

const quote = async (req: Request, context: Context) => {
  let data;

  if (req.method === 'OPTIONS') {
    const res = new Response();

    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.append("Access-Control-Allow-Headers", "*");
    res.headers.append("Access-Control-Allow-Methods", "*");

    return res;
  }

  if (Math.random() < 0.5) {
    data = await getQuoteFromNinja();
  } else {
    data = await getQuoteFromGemini();
  }

  return Response.json({ data });
}

export default quote;