import { db } from '@/lib/db';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

let redis: Redis | null;
try {
  const env =
    process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_TOKEN;
  redis = env ? Redis.fromEnv() : null;
} catch (error) {
  console.error('Failed to initialize Redis:', error);
}

const inputSchema = z.object({
  uiid: z.string().min(1, 'UIId is required'),
});

const getIp = async () => {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  return '0.0.0.0';
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { uiid: UIId } = inputSchema.parse(body);

    const ip = await getIp();

    try {
      const buf = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(ip),
      );
      const hash = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      if (redis) {
        const isNew = await redis.set(
          ['deduplicate', hash, UIId].join(':'),
          true,
          {
            nx: true,
            ex: 24 * 60 * 60 * 1000 * 3,
          },
        );

        if (!isNew) {
          return new NextResponse(null, { status: 202 });
        }

        console.log('Incrementing view count for UIId:', UIId);
        await redis.incr(['pageviews', 'projects', UIId].join(':'));
      }
      await db.uI.update({
        where: {
          id: UIId,
        },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });

      return new NextResponse(null, { status: 202 });
    } catch (innerError) {
      console.error('Specific operation error:', innerError);
      throw innerError;
    }
  } catch (error) {
    console.error('Error in view-increment API route:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid input', details: error.errors }),
        {
          status: 400,
          headers: { 'content-type': 'application/json' },
        },
      );
    }
    return new NextResponse(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      },
    );
  }
}
