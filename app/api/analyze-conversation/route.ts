import { OpenAI } from 'openai';

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { messages, style } = await req.json();

    // Build conversation transcript for analysis
    const transcript = messages
      .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    const analysisPrompt = `You are analyzing a conversation from Voiced, an emotional support app. The user just tapped "Done" to end their conversation.

Your task is to create a personalized end-of-conversation screen that:
1. **Validates** their emotional experience
2. **Reflects** on what was discussed
3. **Encourages** them to return

CONVERSATION TRANSCRIPT:
${transcript}

Generate a JSON response with these fields:

{
  "validation": "A warm, empathetic statement that validates what they shared (1-2 sentences)",
  "reflection": "A gentle reflection on the conversation - what did they explore? (2-3 sentences)",
  "themes": ["theme1", "theme2", "theme3"],
  "encouragement": "An encouraging message that motivates them to return (1-2 sentences)",
  "keyMoment": "One particularly meaningful moment from the conversation (1 sentence, optional)",
  "emotionalTone": "One word: calm/hopeful/relieved/understood/lighter/clearer",
  "suggestedNextStep": "A gentle suggestion for when they return (1 sentence, optional)"
}

Style: ${style || 'warm and supportive'}

IMPORTANT:
- Be genuine and specific to their conversation
- Avoid generic platitudes
- Focus on emotional relief and feeling heard
- Make it feel personal, not templated
- Output ONLY valid JSON, no other text`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert at creating emotionally resonant, personalized end-of-conversation experiences. Always output valid JSON.' },
        { role: 'user', content: analysisPrompt },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const result = response.choices[0]?.message?.content;

    if (!result) {
      throw new Error('No response from OpenAI');
    }

    const endScreen = JSON.parse(result);

    return new Response(JSON.stringify(endScreen), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Analysis API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to analyze conversation' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
