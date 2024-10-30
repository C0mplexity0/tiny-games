import React, { ReactNode } from "react";
import styles from "./page-structure.module.css";

export function TitleBar({ children }: { children?: ReactNode }) {
  return (
    <div className={`${styles.titleBar} bg-secondary`}>
      {
        children ?
        children :
        <DraggableArea className="size-full">
          <span className={styles.title}>{document.title}</span>
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
