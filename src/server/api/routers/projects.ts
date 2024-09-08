import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

import { z } from 'zod'
import { isAddress } from 'viem'

export const projectsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany()

    return projects
  }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.id,
        },
      })

      return project
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(32).trim(),
        wallet: z
          .string()
          .refine((value) => isAddress(value), {
            message: 'appWallet: not a valid Ethereum address',
          })
          .optional(),
        website: z.string().max(256).url().optional(),
        idea: z.string().min(32).max(256).trim(),
        description: z.string().max(1024).trim().optional(),
        avatarUrl: z
          .string()
          .max(256)
          .trim()
          .nullish()
          .transform((x) => x ?? undefined)
          .optional(),
        bannerUrl: z.string().max(256).trim().optional(),
        category: z.string().min(1).max(16).trim(),
        currentStage: z.enum(
          [
            'idea',
            'validation',
            'build',
            'mvp',
            'traction',
            'raising',
            'startup',
          ],
          {
            required_error: 'You need to select a stage for your project',
          },
        ),
        supportNeeded: z.array(z.string()).optional(),
        socialMediaLinks: z.record(z.string().url()).optional(),
        importantLinks: z.record(z.string().url()).optional(),
        tags: z.array(z.string()).optional(),
        ownerId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const createdProject = await ctx.db.project.create({
        data: input,
      })

      return createdProject
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(1).max(32).trim(),
        wallet: z
          .string()
          .refine((value) => isAddress(value), {
            message: 'appWallet: not a valid Ethereum address',
          })
          .optional(),
        website: z.string().max(256).url().optional(),
        idea: z.string().min(64).max(256).trim(),
        description: z.string().max(1024).trim().optional(),
        avatarUrl: z
          .string()
          .max(256)
          .trim()
          .nullish()
          .transform((x) => x ?? undefined)
          .optional(),
        bannerUrl: z.string().max(256).trim().optional(),
        category: z.string().min(1).max(16).trim(),
        currentStage: z.enum(
          [
            'idea',
            'validation',
            'build',
            'mvp',
            'traction',
            'raising',
            'startup',
          ],
          {
            required_error: 'You need to select a stage for your project',
          },
        ),
        supportNeeded: z.array(z.string()).optional(),
        socialMediaLinks: z.record(z.string().url()).optional(),
        importantLinks: z.record(z.string().url()).optional(),
        tags: z.array(z.string()).optional(),
        ownerId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedProject = await ctx.db.project.update({
        where: {
          id: input.id,
        },
        data: input,
      })

      return updatedProject
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedProject = await ctx.db.project.delete({
        where: {
          id: input.id,
        },
      })

      return deletedProject
    }),
})
