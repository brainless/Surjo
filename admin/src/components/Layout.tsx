import { type Component, type JSX } from 'solid-js'

interface LayoutProps {
  children: JSX.Element
  title?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '6xl' | 'full'
  class?: string
}

const Layout: Component<LayoutProps> = (props) => {
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full'
  }
  
  const maxWidth = () => props.maxWidth || 'full'
  
  return (
    <div class={`min-h-screen bg-gray-50 ${props.class || ''}`}>
      <div class={`mx-auto px-4 sm:px-6 lg:px-8 py-6 ${maxWidths[maxWidth()]}`}>
        {props.title && (
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
              {props.title}
            </h1>
          </div>
        )}
        {props.children}
      </div>
    </div>
  )
}

export default Layout