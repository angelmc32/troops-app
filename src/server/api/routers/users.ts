import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'

import { z } from 'zod'
import { isAddress } from 'viem'

export const usersRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          id: input.id,
        },
      })
      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'user does not exist',
        })
      }

      return user
    }),

  create: publicProcedure
    .input(
      z.object({
        appWallet: z.string().refine((value) => isAddress(value), {
          message: 'appWallet: not a valid Ethereum address',
        }),
        avatarUrl: z.string().max(256).optional(),
        bannerUrl: z.string().max(256).optional(),
        bio: z.string().max(256).optional(),
        displayName: z.string().min(1).max(64),
        email: z.union([z.literal(''), z.string().email()]),
        username: z
          .string()
          .regex(
            /^[a-zA-Z0-9_-]{5,64}$/,
            'min 5, max 64 characters, accepted: letters, numbers, underscores, and hyphens',
          ),
        walletProviderId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findFirst({
        where: {
          OR: [
            { appWallet: input.appWallet },
            {
              email: input.email,
            },
            {
              username: input.username,
            },
          ],
        },
      })

      if (existingUser) {
        if (input.username === existingUser.username) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'username not available, please try another one',
          })
        } else {
          console.log(existingUser)
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'user already exists',
          })
        }
      }

      const createdUser = await ctx.db.user.create({
        data: {
          appWallet: input.appWallet.toLowerCase(),
          avatarUrl: input.avatarUrl,
          bannerUrl: input.bannerUrl,
          bio: input.bio,
          displayName: input.displayName,
          email: input.email,
          id: input.walletProviderId,
          username: input.username,
          walletProviderId: input.walletProviderId,
        },
      })

      return createdUser
    }),
  update: publicProcedure
    .input(
      z.object({
        avatarUrl: z.string().max(256).optional(),
        bannerUrl: z.string().max(256).optional(),
        bio: z.string().max(256).optional(),
        displayName: z.string().min(1).max(64),
        email: z.union([z.literal(''), z.string().email()]),
        id: z.string().uuid(),
        username: z
          .string()
          .regex(
            /^[a-zA-Z0-9_-]{5,64}$/,
            'min 5, max 64 characters, accepted: letters, numbers, underscores, and hyphens',
          ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          avatarUrl: input.avatarUrl,
          bannerUrl: input.bannerUrl,
          bio: input.bio,
          displayName: input.displayName,
          email: input.email,
          username: input.username,
        },
      })

      return updatedUser
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedUser = await ctx.db.user.delete({
        where: {
          id: input.id,
        },
      })

      return deletedUser
    }),
})
