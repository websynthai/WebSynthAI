'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const SubPromptInput = z.object({
  subPrompt: z.string().min(1),
  UIId: z.string().min(1),
  parentSUBId: z.string().min(1),
  code: z.string().min(1),
  modelId: z.string().min(1),
});

const log = (message: string, data?: any) => {
  process.stdout.write(
    `[INFO] ${message}${data ? `: ${JSON.stringify(data, null, 2)}` : ''}\n`,
  );
};

export const createSubPrompt = async (
  subPrompt: string,
  UIId: string,
  parentSUBId: string,
  code: string,
  modelId: string,
) => {
  try {
    // 1. Validate input
    const input = SubPromptInput.parse({
      subPrompt,
      UIId,
      parentSUBId,
      code,
      modelId,
    });
    log('Input validated');

    // 2. Find next available SUBId
    const existingSubPrompts = await db.subPrompt.findMany({
      where: {
        UIId: input.UIId,
        SUBId: {
          startsWith: input.parentSUBId,
        },
      },
      orderBy: {
        SUBId: 'desc',
      },
    });

    const finalSUBId =
      existingSubPrompts.length === 0
        ? input.parentSUBId
        : `${input.parentSUBId}-${existingSubPrompts.length}`;

    log('Generated SUBId', finalSUBId);

    // 3. Create everything in a single transaction
    const result = await db.$transaction(async (tx) => {
      // Create code first
      const codeEntry = await tx.code.create({
        data: { code: input.code },
      });
      log('Code created', { id: codeEntry.id });

      // Create subPrompt
      const subPrompt = await tx.subPrompt.create({
        data: {
          UIId: input.UIId,
          subPrompt: input.subPrompt,
          SUBId: finalSUBId,
          codeId: codeEntry.id,
          modelId: input.modelId,
        },
      });
      log('SubPrompt created', { id: subPrompt.id });

      // Update UI timestamp
      await tx.uI.update({
        where: { id: input.UIId },
        data: { updatedAt: new Date() },
      });

      return { data: subPrompt, codeData: codeEntry };
    });

    revalidatePath(`/ui/${UIId}`);
    return result;
  } catch (error) {
    // If it's a unique constraint violation, retry with a timestamp
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      try {
        const timestamp = Date.now();
        const result = await db.$transaction(async (tx) => {
          const codeEntry = await tx.code.create({
            data: { code },
          });

          const sP = await tx.subPrompt.create({
            data: {
              UIId,
              subPrompt,
              SUBId: `${parentSUBId}-${timestamp}`,
              codeId: codeEntry.id,
              modelId,
            },
          });

          await tx.uI.update({
            where: { id: UIId },
            data: { updatedAt: new Date() },
          });

          return { data: sP, codeData: codeEntry };
        });

        revalidatePath(`/ui/${UIId}`);
        return result;
      } catch (_retryError) {
        throw new Error('Failed to create subPrompt after retry');
      }
    }

    throw error;
  }
};
