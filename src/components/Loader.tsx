interface LoaderProps {
  message?: string
}

export function Loader({ message }: LoaderProps) {
  return (
    <div class="loader">
      <div class="loader-dots">
        <div class="loader-dot" />
        <div class="loader-dot" />
        <div class="loader-dot" />
      </div>
      {message && <div class="loader-message">{message}</div>}
    </div>
  )
}
