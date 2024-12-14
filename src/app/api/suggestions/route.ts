import { llm } from '@/lib/llm';
import { generateText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const DEFAULT_SUGGESTIONS = [
  'Login page for netflix',
  'Product detail card for sneakers',
  'Ecommerce checkout page',
  'Dashboard for sales data',
  'Instagram App UI clone',
];

export async function GET(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const modelId = url.searchParams.get('modelId');

    if (!modelId) {
      return new Response(JSON.stringify(DEFAULT_SUGGESTIONS), {
        headers: { 'content-type': 'application/json' },
      });
    }

    try {
      let suggestions: string[] = [];

      // Remove caching for now as it's causing URL issues
      const result = await generateText({
        model: llm(modelId),
        topP: 1,
        maxRetries: 1,
        tools: {
          appIdea: tool({
            description:
              'Generate exactly 5 unique and creative UI component ideas',
            parameters: z.object({
              suggestions: z
                .array(z.string())
                .length(5)
                .describe('Exactly 5 unique UI component ideas'),
            }),
            execute: async ({ suggestions: newSuggestions }) => {
              suggestions = newSuggestions;
              return { suggestions: newSuggestions };
            },
          }),
        },
        prompt: `You are a UI designer. Generate 5 unique UI component ideas.

IMPORTANT: Respond ONLY with a JSON array containing exactly 5 strings. No markdown, no explanations.

Example response:
["3D parallax card", "Floating action menu", "Gradient progress bar", "Animated avatar", "Smart dropdown"]

Requirements:
- Each idea must be under 60 characters
- Focus on visual and interactive elements
- Be specific and creative
- Use modern UI trends
- Include animations or interactions`,
      });

      if (suggestions.length === 5) {
        return new Response(JSON.stringify(suggestions), {
          headers: { 'content-type': 'application/json' },
        });
      }

      if (result.text) {
        const match = result.text.match(/\[[\s\S]*\]/);
        if (match) {
          try {
            const parsed = JSON.parse(match[0]);
            if (Array.isArray(parsed) && parsed.length === 5) {
              return new Response(JSON.stringify(parsed), {
                headers: { 'content-type': 'application/json' },
              });
            }
          } catch {
            // Silently fall through to default suggestions
            console.warn('Failed to parse AI response as JSON array');
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('quota')) {
        console.warn('Quota exceeded, using default suggestions');
      } else {
        console.error('Error generating suggestions:', error);
      }
    }

    return new Response(JSON.stringify(DEFAULT_SUGGESTIONS), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in suggestions API route:', error);
    return new Response(JSON.stringify(DEFAULT_SUGGESTIONS), {
      headers: { 'content-type': 'application/json' },
    });
  }
}
