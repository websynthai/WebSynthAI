import { generateText, tool } from 'ai';
import { z } from 'zod';
import { llm } from '@/lib/llm';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(req: Request): Promise<Response> {
  try {
    // Default suggestions in case of any issues
    const defaultSuggestions = [
      "Login page for netflix",
      "Product detail card for sneakers",
      "Ecommerce checkout page",
      "Dashboard for sales data",
      "Instagram App UI clone"
    ];

    const url = new URL(req.url);
    const modelId = url.searchParams.get('modelId');

    if (!modelId) {
      return new Response(JSON.stringify(defaultSuggestions), {
        headers: { 'content-type': 'application/json' },
      });
    }

    try {
      let suggestions: string[] = [];

      const result = await generateText({
        model: llm(modelId),
        topP: 1,
        tools: {
          appIdea: tool({
            description: 'Generate an array of 5 app ideas for a web or mobile application or specific functionality within an app',
            parameters: z.object({
              suggestions: z.array(z.string().describe('A list of app ideas')),
            }),
            execute: async ({ suggestions: newSuggestions }) => {
              suggestions = newSuggestions;
              return { suggestions: newSuggestions };
            },
          }),
        },
        prompt: `Generate 5 very very simple prompts for creating innovative UI components for a web or mobile application. The prompts should only contain UI request and not the functionality. Each prompt should not be more than 60 characters.`
      });

      
      if (result.text) {
        const lines = result.text.split('\n').filter(line => 
          line.trim() && !line.startsWith('Here') && !line.startsWith('\n')
        );
        suggestions = lines.map(line => 
          line.replace(/^\d+\.\s*/, '').trim()
        );
      }
      
      if (suggestions.length > 0) {
        return new Response(JSON.stringify(suggestions), {
          headers: { 'content-type': 'application/json' },
        });
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }

    // Return default suggestions if generation fails
    return new Response(JSON.stringify(defaultSuggestions), {
      headers: { 'content-type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in suggestions API route:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
