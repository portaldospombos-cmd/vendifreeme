import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export interface PriceAnalysis {
  fairPrice: number;
  status: 'below' | 'within' | 'above';
  reasoning: string;
}

export async function analyzePrice(
  title: string,
  category: string,
  price: number,
  details?: any
): Promise<PriceAnalysis> {
  if (!ai) {
    return {
      fairPrice: price,
      status: 'within',
      reasoning: 'AI analyze pending API setup.'
    };
  }

  try {
    const prompt = `
      Analyze the following product listing price for a secondhand marketplace in Portugal.
      Product: ${title}
      Category: ${category}
      User Price: ${price} EUR
      Details: ${JSON.stringify(details)}

      Based on market knowledge current as of 2024-2025:
      1. Estimate a fair market price range.
      2. Compare the user price to this range.
      3. Return a JSON object.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fairPrice: { type: Type.NUMBER },
            status: { 
              type: Type.STRING, 
              enum: ["below", "within", "above"] 
            },
            reasoning: { type: Type.STRING }
          },
          required: ["fairPrice", "status", "reasoning"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    throw new Error('Empty AI response');
  } catch (error) {
    console.error('Gemini error:', error);
    return {
      fairPrice: price,
      status: 'within',
      reasoning: 'Não foi possível analisar o preço no momento.'
    };
  }
}
