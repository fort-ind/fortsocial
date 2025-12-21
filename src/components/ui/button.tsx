
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ripple",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-material-1 hover:shadow-material-2 hover:-translate-y-0.5 active:shadow-material-1 active:translate-y-0 rounded-sm",
        destructive:
          "bg-destructive text-destructive-foreground shadow-material-1 hover:shadow-material-2 hover:-translate-y-0.5 active:shadow-material-1 active:translate-y-0 rounded-sm",
        outline:
          "border border-input bg-card shadow-material-1 hover:shadow-material-2 hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5 active:translate-y-0 rounded-sm",
        secondary:
          "bg-secondary text-secondary-foreground shadow-material-1 hover:shadow-material-2 hover:-translate-y-0.5 active:shadow-material-1 active:translate-y-0 rounded-sm",
        ghost: "hover:bg-muted hover:text-accent-foreground rounded-sm",
        link: "text-primary underline-offset-4 hover:underline",
        material: "bg-primary text-primary-foreground shadow-material-1 hover:shadow-material-2 hover:-translate-y-0.5 active:shadow-material-1 active:translate-y-0 rounded-sm uppercase tracking-wide",
        flat: "bg-transparent text-primary hover:bg-primary/10 rounded-sm uppercase tracking-wide",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-sm px-3 text-xs",
        lg: "h-10 rounded-sm px-8",
        icon: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
