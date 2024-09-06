'use client'

import { useState } from 'react'
import { zeroAddress } from 'viem'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/trpc/react'
import { TRPCClientError } from '@trpc/client'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '../ui/textarea'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { type UserProfile } from '@dynamic-labs/sdk-react-core'
import Spinner from '../ux/spinner'
import { useRouter } from 'next/navigation'

const userFormSchema = z.object({
  appWallet: z.string(),
  avatarUrl: z
    .string()
    .max(256)
    .trim()
    .nullish()
    .transform((x) => x ?? undefined)
    .optional(),
  bannerUrl: z.string().max(256).trim().optional(),
  bio: z.string().max(256).trim().optional(),
  displayName: z.string().min(1).max(64).trim(),
  email: z.union([z.literal(''), z.string().email()]),
  walletProviderId: z.string().uuid(),
  username: z
    .string()
    .trim()
    .regex(
      /^[a-zA-Z0-9_-]{5,64}$/,
      'min 5, max 64 characters, accepted: letters, numbers, underscores, and hyphens',
    ),
})

export default function NewUserForm({
  appWallet,
  walletProviderUser,
}: {
  appWallet: string
  walletProviderUser: UserProfile
}) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      appWallet: appWallet as `0x${string}`,
      avatarUrl: '',
      bannerUrl: '',
      bio: '',
      displayName: '',
      email: walletProviderUser.email,
      username: '',
      walletProviderId: walletProviderUser.userId,
    },
  })

  const { mutateAsync: createUser } = api.users.create.useMutation()

  async function onSubmitHandler(values: z.infer<typeof userFormSchema>) {
    setIsLoading(true)

    if (values.appWallet === zeroAddress) {
      return toast.warning('app wallet not detected, please try again...')
    }
    try {
      const createdUser = await createUser(values)
      toast.success(`user ${createdUser.username} created successfully`)
      router.push('/dashboard')
    } catch (error) {
      if (error instanceof TRPCClientError && error.message) {
        toast.warning(error.message)
      } else {
        console.error(error)
        toast.warning('something went wrong, please try again...')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitHandler)}
        className="flex w-full flex-col gap-y-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full text-left">
              <FormLabel className="ml-2">username</FormLabel>
              <FormControl>
                <Input placeholder="guyincognito" {...field} />
              </FormControl>
              <FormMessage className="ml-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem className="w-full text-left">
              <FormLabel className="ml-2">display name</FormLabel>
              <FormControl>
                <Input placeholder="guy incognito" {...field} />
              </FormControl>
              <FormMessage className="ml-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full text-left">
              <FormLabel className="ml-2">email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="jared@piedpiper.com"
                  {...field}
                />
              </FormControl>
              <FormMessage className="ml-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="w-full text-left">
              <FormLabel className="ml-2">bio</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="tell us why you're so cool :)"
                  {...field}
                />
              </FormControl>
              <FormMessage className="ml-2" />
            </FormItem>
          )}
        />
        <div className="flex w-full justify-center pt-4">
          <Button
            size="lg"
            type="submit"
            disabled={isLoading}
            className="flex w-1/2 items-center justify-center gap-x-2"
          >
            {isLoading ? 'creating' : 'create'}
            {isLoading && <Spinner color="white" h="6" w="6" />}
          </Button>
        </div>
      </form>
    </Form>
  )
}
