import * as React from "react"
// Simplified Toast component since missing radix-ui/react-toast
import { X } from "lucide-react"

export type ToastProps = {
    id: string
    title?: string
    description?: string
    variant?: "default" | "destructive"
    onOpenChange?: (open: boolean) => void
    open?: boolean
}

export function Toast({ id, title, description, variant, onOpenChange }: ToastProps) {
    return (
        <div className={`fixed bottom-4 right-4 z-[100] flex w-full max-w-md flex-col gap-1 overflow-hidden rounded-lg border bg-white p-6 shadow-lg transition-all ${
            variant === 'destructive' ? 'border-red-600 bg-red-50 text-red-900' : 'border-gray-200'
        }`}>
           <div className="flex items-start gap-4">
              <div className="grid gap-1">
                 {title && <h3 className="font-semibold leading-none tracking-tight">{title}</h3>}
                 {description && <div className="text-sm opacity-90">{description}</div>}
              </div>
              <button 
                onClick={() => onOpenChange?.(false)}
                className="ml-auto inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm opacity-50 hover:opacity-100 focus:outline-none"
              >
                  <X className="h-4 w-4" />
              </button>
           </div>
        </div>
    )
}
