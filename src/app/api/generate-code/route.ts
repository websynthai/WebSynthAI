import { trimCode } from '@/lib/code';
import { llm } from '@/lib/llm';
import { getGenerationPrompt, getOptimizerPrompt } from '@/lib/prompt';
import { generateText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const inputSchema = z.object({
  codeDescription: z.string().min(1, 'Code description is required'),
  modelId: z.string(),
  uiType: z.string(),
});

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { codeDescription, modelId, uiType } = inputSchema.parse(body);

    const result = await generateText({
      model: llm(modelId),
      messages: [
        {
          role: 'system',
          content: getGenerationPrompt(uiType),
        },
        {
          role: 'user',
          content: `Now generate React code for this: ${codeDescription} `,
        },
      ],
    });

    if (!result?.text) {
      return new Response(JSON.stringify({ error: 'No response from model' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    const code = trimCode(
      result.text
        .replace(/```/g, '')
        .replace(/typescript|javascript|jsx|tsx|ts|js/g, '')
        .replace('asChild', ' ')
        .replace('fixed', 'absolute')
        .trim(),
    );

    if (!code) {
      return new Response(JSON.stringify({ error: 'Empty code generated' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ code, success: true }), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      },
    );
  }
}
