import { OpenAI } from 'openai';

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ sentiment: null }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const transcript = messages
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    const analysisPrompt = `You are analyzing a conversation from an emotional support app. Your task is to determine the current emotional sentiment of the USER based on their messages.

CONVERSATION TRANSCRIPT:
${transcript}

Analyze the USER's messages (not the assistant's) and determine their current emotional state. Focus on:
- The tone and language they use
- The topics they're discussing
- Any explicit emotional expressions
- The overall mood conveyed

Classify the user's current sentiment into ONE of these three categories:
- "happy": User seems positive, content, grateful, excited, relieved, or generally in good spirits
- "sad": User seems down, disappointed, grieving, lonely, hopeless, or experiencing negative emotions that aren't anger-related
- "angry": User seems frustrated, irritated, resentful, annoyed, or expressing anger/hostility

Output ONLY a JSON object with this format:
{
  "sentiment": "happy" | "sad" | "angry"
}

Choose the sentiment that best represents the user's CURRENT emotional state based on their most recent messages. If the conversation is neutral or unclear, make your best judgment based on the overall tone.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert at detecting emotional sentiment in conversations. Always output valid JSON with a single "sentiment" field.' },
        { role: 'user', content: analysisPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = response.choices[0]?.message?.content;

    if (!result) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(result);

    if (!['happy', 'sad', 'angry'].includes(parsed.sentiment)) {
      parsed.sentiment = 'happy';
    }

    return new Response(JSON.stringify(parsed), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Sentiment analysis API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze sentiment';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
