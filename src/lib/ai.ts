import { GoogleGenAI } from '@google/genai';

export interface AgentResponse {
  rootCause: string;
  proposedFix: string;
  reviewerVerdict: string;
}

export interface ModelProvider {
  analyzeError(code: string, errorMsg: string): Promise<AgentResponse>;
}

export class MockProvider implements ModelProvider {
  async analyzeError(code: string, errorMsg: string): Promise<AgentResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    return {
      rootCause: "Demo Mode: The application is running in mock mode. Typically, this error indicates a null reference or undefined variable being accessed.",
      proposedFix: "Demo Mode: Check the variable initialization before line 1. Ensure you are not accessing properties on an undefined object.",
      reviewerVerdict: "Demo Mode: The fix is safe. For production, add proper type checking and error boundaries."
    };
  }
}

export class GeminiProvider implements ModelProvider {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async analyzeError(code: string, errorMsg: string): Promise<AgentResponse> {
    // Agent 1: Code Analysis Agent
    const rootCausePrompt = `You are an expert Code Analysis Agent.
Examine this code:
\`\`\`
${code}
\`\`\`

And this error:
${errorMsg}

What is the root cause of this error? Keep your answer concise (2-3 sentences max).`;

    const rootCauseResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: rootCausePrompt,
    });
    const rootCause = rootCauseResponse.text || "Failed to analyze root cause.";

    // Agent 2: Fix Agent
    const fixPrompt = `You are an expert Fix Agent.
Code:
\`\`\`
${code}
\`\`\`
Error: ${errorMsg}
Root Cause: ${rootCause}

Provide the precise code change to fix this. Do not explain, just provide the fixed code block or exact steps.`;

    const fixResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fixPrompt,
    });
    const proposedFix = fixResponse.text || "Failed to propose fix.";

    // Agent 3: Reviewer Agent
    const reviewPrompt = `You are a strict Code Reviewer Agent.
Original Code:
\`\`\`
${code}
\`\`\`
Error: ${errorMsg}
Proposed Fix:
${proposedFix}

Review this fix. Is it correct and safe? Keep your verdict to 2 concise sentences. Start with "Approved" or "Rejected".`;

    const reviewResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: reviewPrompt,
    });
    const reviewerVerdict = reviewResponse.text || "Failed to review.";

    return {
      rootCause,
      proposedFix,
      reviewerVerdict,
    };
  }
}
