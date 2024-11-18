import React, { ReactNode } from "react";
import styles from "./page-structure.module.css";

export function Title({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`${styles.title} ${className}`} {...props} />
  );
}

export function TitleBar({ children, className }: { children?: ReactNode, className?: string }) {
  return (
    <div className={`${styles.titleBar} bg-secondary-background ${className}`}>
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

export function Content({ children }: { children?: ReactNode }) {
  return (
    <div className={`${styles.content} border-t`}>
      {children}
    </div>
  );
}
