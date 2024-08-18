import React from "react";

export function PageHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`h-fit p-3  ${className}`} {...props} />
  )
}

export function PageTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={`text-4xl font-bold text-center ${className}`} {...props} />
  )
}

export function PageSubtitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={`text-xl font-bold text-center text-secondary-foreground ${className}`} {...props} />
  )
}
