import type { Context } from '@netlify/functions';
import { getQuoteFromNinja } from './ninja';
import { getQuoteFromGemini } from './gemini';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
};

const quote = async (req: Request, context: Context) => {
  let data;

  if (req.method === 'OPTIONS') {
    return {
      statusCode: 200, 
      headers,
      body: 'OPTIONS'
    };
  }

  if (Math.random() < 0.5) {
    data = await getQuoteFromNinja();
  } else {
    data = await getQuoteFromGemini();
  }

  return Response.json({ data });
}

export default quote;