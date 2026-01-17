import { OpenAI } from 'openai';
import { SentimentAnalysisResult, SentimentType } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ 
          sentiment: 'neutral' as SentimentType, 
          confidence: 0, 
          summary: 'No messages to analyze' 
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const transcript = messages
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    const analysisPrompt = `You are analyzing a conversation from an emotional support app. Your task is to classify the overall sentiment of the user's messages in this conversation.

CONVERSATION TRANSCRIPT:
${transcript}

Analyze the user's emotional state based on their messages and provide a sentiment classification.

Generate a JSON response with these fields:

{
  "sentiment": "positive" | "negative" | "neutral" | "mixed",
  "confidence": 0.0-1.0,
  "summary": "A brief 1-sentence summary of the user's emotional state"
}

Guidelines:
- "positive": User expresses happiness, gratitude, hope, excitement, relief, or other positive emotions
- "negative": User expresses sadness, anxiety, frustration, anger, fear, or other negative emotions
- "neutral": User's messages are factual, informational, or lack strong emotional content
- "mixed": User expresses a combination of positive and negative emotions
- confidence: How confident you are in this classification (0.0 = not confident, 1.0 = very confident)
- summary: A brief description of the user's emotional state

Focus ONLY on the user's messages, not the assistant's responses.
Output ONLY valid JSON, no other text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert at analyzing emotional sentiment in conversations. Always output valid JSON.' },
        { role: 'user', content: analysisPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = response.choices[0]?.message?.content;

    if (!result) {
      throw new Error('No response from OpenAI');
    }

    const sentimentResult: SentimentAnalysisResult = JSON.parse(result);

    return new Response(JSON.stringify(sentimentResult), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Sentiment Analysis API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze sentiment';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
