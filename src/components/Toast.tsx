import { useToastStore } from '@/stores/toastStore'

export function Toast() {
  const message = useToastStore((s) => s.message)
  const visible = useToastStore((s) => s.visible)

  return (
    <div class={`toast ${visible ? 'toast-visible' : ''}`}>
      {message}
    </div>
  )
}
