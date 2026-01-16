import { OpenAI } from 'openai';

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { messages, existingMemory } = await req.json();

    // Build conversation transcript
    const transcript = messages
      .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    const extractionPrompt = `You are analyzing a conversation to extract key information about the user for future conversations.

CONVERSATION TRANSCRIPT:
${transcript}

EXISTING MEMORY:
${JSON.stringify(existingMemory, null, 2)}

Extract and return ONLY NEW information that isn't already in the existing memory:

{
  "facts": ["fact1", "fact2"],
  "preferences": ["preference1", "preference2"],
  "topics": ["topic1", "topic2"]
}

GUIDELINES:
- **Facts**: Concrete information about the user (job, location, relationships, hobbies, etc.)
- **Preferences**: What they like/dislike, values, how they prefer to handle things
- **Topics**: Main themes discussed (work stress, anxiety, relationships, health, etc.)
- Keep items concise (5-10 words max each)
- Only extract meaningful, relevant information
- Don't include generic statements
- Don't duplicate what's already in existing memory
- If nothing new, return empty arrays

Output ONLY valid JSON, no other text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert at extracting and organizing personal information from conversations. Always output valid JSON.' },
        { role: 'user', content: extractionPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = response.choices[0]?.message?.content;

    if (!result) {
      throw new Error('No response from OpenAI');
    }

    const extracted = JSON.parse(result);

    return new Response(JSON.stringify(extracted), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Memory extraction API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to extract memory' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
