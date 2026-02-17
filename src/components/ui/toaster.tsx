"use client"

import { useToast } from "@/components/ui/use-toast"
import { Toast, ToastProps } from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map(function ({ id, title, description, ...props }: ToastProps) {
        return (
          <Toast key={id} id={id} title={title} description={description} {...props} />
        )
      })}
    </div>
  )
}
