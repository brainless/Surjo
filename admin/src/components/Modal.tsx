import { type Component, type JSX, Show } from 'solid-js'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: JSX.Element
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

const Modal: Component<ModalProps> = (props) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }
  
  const size = () => props.size || 'md'
  
  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose()
    }
  }
  
  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div 
          class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
          onClick={handleOverlayClick}
        >
          {/* Background overlay */}
          <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
          
          {/* Modal content */}
          <div class={`inline-block w-full ${sizes[size()]} p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg`}>
            <Show when={props.title || props.showCloseButton}>
              <div class="flex items-center justify-between mb-4">
                <Show when={props.title}>
                  <h3 class="text-lg font-medium text-gray-900">
                    {props.title}
                  </h3>
                </Show>
                <Show when={props.showCloseButton !== false}>
                  <button
                    onClick={props.onClose}
                    class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </Show>
              </div>
            </Show>
            
            <div class="text-sm text-gray-500">
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </Show>
  )
}

export default Modal