import { NextResponse } from 'next/server';
import { MockProvider, GeminiProvider, ModelProvider } from '../../../lib/ai';

export async function POST(request: Request) {
  try {
    const { code, error } = await request.json();

    if (!code || !error) {
      return NextResponse.json(
        { error: 'Code and error message are required.' },
        { status: 400 }
      );
    }

    // Use Gemini if an API key is present, otherwise fallback to the mock provider
    const apiKey = process.env.GEMINI_API_KEY;
    const provider: ModelProvider = apiKey ? new GeminiProvider(apiKey) : new MockProvider();
    
    const analysis = await provider.analyzeError(code, error);

    return NextResponse.json(analysis);
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
