import React, { ReactNode } from "react";
import styles from "./page-structure.module.css";
import { cn } from "@lib/utils";

export function Title({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn(styles.title, className)} {...props} />
  );
}

export function TitleBar({ children, className }: { children?: ReactNode, className?: string }) {
  return (
    <div className={`${styles.titleBar} ${className}`}>
      {
        children ?
        children :
        <DraggableArea className="size-full flex flex-row pl-2 gap-1">
          <Title>{document.title}</Title>
        </DraggableArea>
      }
    </div>
  );
}

export function DraggableArea({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className={`${styles.draggableArea} ${className}`} {...props} />
  );
}

export function Content({ children, className }: { children?: ReactNode, className?: string }) {
  return (
    <div className={cn(`${styles.content} border-t`, className)}>
      {children}
    </div>
  );
}
