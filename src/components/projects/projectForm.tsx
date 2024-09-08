'use client'

import { useState } from 'react'
import { isAddress } from 'viem'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/trpc/react'
import { TRPCClientError } from '@trpc/client'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

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
import Spinner from '../ux/spinner'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { type UserProfile } from '@dynamic-labs/sdk-react-core'

const projectFormSchema = z.object({
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
    ['idea', 'validation', 'build', 'mvp', 'traction', 'raising', 'startup'],
    {
      required_error: 'You need to select a stage for your project',
    },
  ),
  supportNeeded: z.array(z.string()).optional(),
  socialMediaLinks: z.record(z.string().url()).optional(),
  importantLinks: z.record(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  ownerId: z.string().uuid(),
})

export default function ProjectForm({
  walletProviderUser,
}: {
  walletProviderUser: UserProfile
}) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      idea: '',
      description: '',
      category: '',
      currentStage: 'idea',
      ownerId: walletProviderUser.userId, // userId
    },
  })

  console.log(form.formState.errors)

  const { mutateAsync: createProject } = api.projects.create.useMutation()

  async function onSubmitHandler(values: z.infer<typeof projectFormSchema>) {
    setIsLoading(true)

    try {
      console.log(values)
      const createdProject = await createProject(values) // { username: 'placeholder ' }
      toast.success(`project ${createdProject.name} created successfully`)
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
          name="name"
          render={({ field }) => (
            <FormItem className="w-full text-left">
              <FormLabel className="ml-2">project name</FormLabel>
              <FormControl>
                <Input placeholder="pied piper" {...field} />
              </FormControl>
              <FormMessage className="ml-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="idea"
          render={({ field }) => (
            <FormItem className="w-full text-left">
              <FormLabel className="ml-2">idea</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="your idea's one-liner"
                  {...field}
                />
              </FormControl>
              <FormMessage className="ml-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full text-left">
              <FormLabel className="ml-2">description</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="explain how your idea 'works' in one or two sentences"
                  {...field}
                />
              </FormControl>
              <FormMessage className="ml-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="w-full text-left">
              <FormLabel className="ml-2">category</FormLabel>
              <FormControl>
                <Input placeholder="ie defi, nft, etc" {...field} />
              </FormControl>
              <FormMessage className="ml-2" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currentStage"
          render={({ field }) => (
            <FormItem className="w-full text-left">
              <FormLabel className="ml-2">current stage</FormLabel>
              <FormControl className="ml-8">
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="idea" />
                    </FormControl>
                    <FormLabel className="font-normal">idea</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="validation" />
                    </FormControl>
                    <FormLabel className="font-normal">validation</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="build" />
                    </FormControl>
                    <FormLabel className="font-normal">build</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="mvp" />
                    </FormControl>
                    <FormLabel className="font-normal">mvp</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="traction" />
                    </FormControl>
                    <FormLabel className="font-normal">traction</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="raising" />
                    </FormControl>
                    <FormLabel className="font-normal">raising</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="startup" />
                    </FormControl>
                    <FormLabel className="font-normal">startup</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage className="ml-2" />
            </FormItem>
          )}
        />
        {/* 
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
        /> */}
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
