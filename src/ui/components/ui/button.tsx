import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@lib/utils";
import { ChevronDown } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary-background text-secondary-foreground hover:bg-secondary-background/90",
        ghost: "hover:bg-secondary-background hover:text-secondary-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        "sm-icon": "h-9 w-9"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean,
  destructive?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, destructive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          destructive ? "text-destructive-foreground bg-destructive hover:bg-destructive/90" : "",
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";


const ButtonWithDropdown = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button className={cn(className, "rounded-none rounded-l-[20px] rounded-r-[0.4rem]")} ref={ref} {...props} />
    );
  }
);
ButtonWithDropdown.displayName = "ButtonWithDropdown";

const DropdownButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button className={cn(className, "rounded-none rounded-r-[20px] rounded-l-[0.4rem]")} ref={ref} size="icon" {...props} >
        <ChevronDown />
      </Button>
    );
  }
);
DropdownButton.displayName = "DropdownButton";

const ButtonWithDropdownContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(className, "inline-flex flex-row gap-0.5")} {...props} />
    );
  }
);
ButtonWithDropdownContainer.displayName = "ButtonWithDropdown";

export { Button, ButtonWithDropdownContainer, DropdownButton, ButtonWithDropdown, buttonVariants };
