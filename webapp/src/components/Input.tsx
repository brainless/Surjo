import { type Component } from 'solid-js'

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  value?: string
  disabled?: boolean
  required?: boolean
  error?: string
  label?: string
  class?: string
  onInput?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
}

const Input: Component<InputProps> = (props) => {
  const baseClasses = "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors"
  const normalClasses = "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
  const errorClasses = "border-red-300 focus:border-red-500 focus:ring-red-500"
  
  const inputClasses = () => {
    const classes = [baseClasses]
    if (props.error) {
      classes.push(errorClasses)
    } else {
      classes.push(normalClasses)
    }
    if (props.class) {
      classes.push(props.class)
    }
    return classes.join(' ')
  }
  
  return (
    <div class="w-full">
      {props.label && (
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {props.label}
          {props.required && <span class="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={props.type || 'text'}
        class={inputClasses()}
        placeholder={props.placeholder}
        value={props.value || ''}
        disabled={props.disabled}
        required={props.required}
        onInput={(e) => props.onInput?.(e.currentTarget.value)}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
      />
      {props.error && (
        <p class="mt-1 text-sm text-red-600">{props.error}</p>
      )}
    </div>
  )
}

export default Input