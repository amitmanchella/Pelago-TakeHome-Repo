import { OpenAI } from 'openai';

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { messages } = await req.json();

    if (!messages || messages.length < 2) {
      return new Response(
        JSON.stringify({ sentiment: null }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const transcript = messages
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    const analysisPrompt = `Analyze the emotional sentiment of this conversation and classify it into exactly ONE of these three categories: happy, sad, or angry.

CONVERSATION:
${transcript}

Consider the overall emotional tone of the conversation, especially the user's messages. Look for:
- Happy: positive emotions, joy, excitement, gratitude, relief, accomplishment, hope
- Sad: negative emotions like sadness, disappointment, grief, loneliness, feeling down, worry, anxiety
- Angry: frustration, irritation, annoyance, resentment, feeling upset or mad

Respond with ONLY a JSON object in this exact format:
{
  "sentiment": "happy" | "sad" | "angry"
}

Choose the sentiment that best represents the dominant emotional tone of the conversation.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert at analyzing emotional sentiment in conversations. Always output valid JSON with exactly one of the three sentiment values: happy, sad, or angry.' },
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
    const sentiment = parsed.sentiment;

    if (!['happy', 'sad', 'angry'].includes(sentiment)) {
      return new Response(
        JSON.stringify({ sentiment: null }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ sentiment }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Sentiment analysis API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze sentiment';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
