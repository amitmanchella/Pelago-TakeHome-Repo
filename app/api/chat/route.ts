import { OpenAI } from 'openai';

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { messages, systemPrompt, workingMemory } = await req.json();

    // Build the full context including working memory
    let fullSystemPrompt = systemPrompt;

    if (workingMemory && (workingMemory.facts.length > 0 || workingMemory.preferences.length > 0 || workingMemory.topics.length > 0)) {
      fullSystemPrompt += '\n\n=== WHAT YOU KNOW ABOUT THIS USER ===\n';
      fullSystemPrompt += 'Use this information when it\'s naturally relevant to the conversation. Don\'t force connections.\n';

      if (workingMemory.facts.length > 0) {
        fullSystemPrompt += '\n📝 Personal Facts:\n' + workingMemory.facts.map((f: string) => `• ${f}`).join('\n');
      }

      if (workingMemory.preferences.length > 0) {
        fullSystemPrompt += '\n\n💭 Their Preferences & Values:\n' + workingMemory.preferences.map((p: string) => `• ${p}`).join('\n');
      }

      if (workingMemory.topics.length > 0) {
        fullSystemPrompt += '\n\n💬 Past Conversation Topics:\n' + workingMemory.topics.map((t: string) => `• ${t}`).join('\n');
      }

      fullSystemPrompt += '\n\nReference these details only when they naturally relate to what the user is sharing right now.';
    }

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [
        { role: 'system', content: fullSystemPrompt },
        ...messages,
      ],
      temperature: 0.8,
      max_tokens: 200, // Keep responses brief
    });

    // Create a streaming response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate response' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
