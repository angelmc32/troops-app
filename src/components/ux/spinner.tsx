import React from 'react'
import { LoaderCircle } from 'lucide-react'

type SpinnerProps = {
  color?: string
  h?: string
  w?: string
}

export default function Spinner({
  color = 'primary',
  h = '4',
  w = '4',
}: SpinnerProps) {
  return <LoaderCircle className={`h-${h} w-${w} text-${color} animate-spin`} />
}
