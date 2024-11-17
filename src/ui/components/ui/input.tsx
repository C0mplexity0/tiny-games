import * as React from "react";

import { cn } from "@lib/utils";
import { useCharacterLimit } from "@hooks/use-character-limit";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";


export interface CharacterLimitInputProps extends InputProps {
  maxLength: number
}

const CharacterLimitInput = React.forwardRef<HTMLInputElement, CharacterLimitInputProps>(({ maxLength, onChange, ...props }: CharacterLimitInputProps, ref) => {
  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({ maxLength });

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          className="peer pe-14"
          type="text"
          value={value}
          maxLength={maxLength}
          onChange={(event) => {
            handleChange(event);

            if (onChange) {
              onChange(event);
            }
          }}
          aria-describedby="character-count"
          ref={ref}
          {...props}
        />
        <div
          id="character-count"
          className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums text-muted-foreground peer-disabled:opacity-50"
          aria-live="polite"
          role="status"
        >
          {characterCount}/{limit}
        </div>
      </div>
    </div>
  );
});
CharacterLimitInput.displayName = "CharacterLimitInput";

export { Input, CharacterLimitInput };
