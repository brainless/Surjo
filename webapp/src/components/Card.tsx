import { type Component, type JSX } from 'solid-js'

interface CardProps {
  children: JSX.Element
  class?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
}

const Card: Component<CardProps> = (props) => {
  const baseClasses = "bg-white rounded-lg border border-gray-200"
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }
  
  const padding = () => props.padding || 'md'
  const shadow = () => props.shadow || 'md'
  
  return (
    <div class={`${baseClasses} ${paddings[padding()]} ${shadows[shadow()]} ${props.class || ''}`}>
      {props.children}
    </div>
  )
}

export default Card