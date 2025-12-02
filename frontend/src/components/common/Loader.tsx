import { Loader as LoaderIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export default function Loader({ size = 'md', className, text }: LoaderProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <LoaderIcon className={cn(sizes[size], 'animate-spin text-primary', className)} />
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  )
}
